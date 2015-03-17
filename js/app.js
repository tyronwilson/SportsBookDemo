(function profiler() {
    "use strict";

    Tracer.setTrace(false);

    var wsf = new WebSocketFactory();
    // Will save the web socket so we can attach event listeners to it later
    interceptSocketCreation(wsf, function (ws) {
        wsf.wrappedWebSocket = ws;
    });
    setupSSO(wsf);
    installForm(wsf);

    
    function setupSSO(webSocketFactory) {
        /* Respond to authentication challenges with popup login dialog */
        var basicHandler = new BasicChallengeHandler();
        basicHandler.loginHandler = function(callback) {
            var credentials;
            var dialog = $('#login');
            dialog.modal({backdrop:'static'});
        
            $('#login_ok').on('click', function(e) {
                credentials = new PasswordAuthentication($('#username').val(), $('#password').val());
                dialog.modal('hide'); // triggers a hide event that will present the credentials
            });
        
            $('#login_cancel').on('click', function(e) {
                credentials = null;
                dialog.modal('hide'); // triggers a hide event that will present the credentials (null == reject)
            });
        
            dialog.on('hidden.bs.modal', function(e) {
                callback(credentials);
            });
        };
        webSocketFactory.setChallengeHandler(basicHandler);
    }

    function performSampling(wsFactory, url, topics, sampleLimit, timeLimit) {
        requestConnection(url, wsFactory).then(
            function (connection) {
                return collectAll(wsFactory, connection, topics, sampleLimit, timeLimit);
            }
        ).then(function (data) {
                plotData(data, timeLimit)
            })
            .catch(function (error) {
                d3.select('div.error')
                    .style('display', 'block')
                    .text("ERROR: " + error.message);
                console.log("Failed!", error.message);
            });
    }

    /**
     * Call on load to wire up the form
     */
    function installForm(wsFactory) {
        var form = document.forms[0];
        form.elements.start.onclick = function () {
            submit(form, wsFactory);
        };
    }

    /*
     * Constructs the WebSocket URL based on the page's URL.
     */
    function makeURL(service) {
        // detect explicit host:port authority
        var authority = location.host;
        if (location.search) {
            authority = location.search.slice(1) + '.' + authority;
        } else {
            var hostPort = authority.split(':');
            var ports = {
                http: '80',
                https: '443'
            };
            authority = hostPort[0] + ':'
                + (parseInt(hostPort[1] || ports[location.protocol]));
        }
        return 'ws://' + authority + '/' + service;
    }

    /**
     *   Wraps the WebSocket factory with a promise that returns
     *   the websocket so we can instrument it later.
     */

    function interceptSocketCreation(wsFactory, intercept) {
        var superCreate = WebSocketFactory.prototype.createWebSocket;

        wsFactory.__proto__.createWebSocket = (function () {
            return function (location, protocols) {
                var webSocket = superCreate.call(wsFactory, location, protocols);
                intercept(webSocket);
                return webSocket;
            }
        })();
    }

    /*
     * Handle form submission, including verifying inputs.
     */
    function submit(form, wsFactory) {

        var errors = {count: 0, url: [], topics: [], timeout: []};

        function addError(field, error) {
            errors.count++;
            errors[field].push(error);
        }

        function require(field, value) {
            if (!value || !(value.trim())) addError(field, 'required')
        }

        d3.select('div.error')
            .style('display', 'none');

        var url = form.elements.url.value;
        var topicNames = form.elements.topics.value;
        var timeout = 5;

        require('url', url);
        require('topics', topicNames);
        require('timeout', timeout);

        // extract the topic names
        var topics = (topicNames || '').split(/\s+/)
            .filter(function (name) {
                return name.trim()
            });
        // be nice to the user and show the values we're using
        form.elements.topics.value = topics.join('\n');

        timeout = (timeout || '').trim();
        if (!/^(\+)?[0-9.]+$/.test(timeout)) addError('timeout', 'Must be an number > 0');
        timeout = parseFloat(timeout);

        // Update the form to reflect the error status
        ['url', 'topics', 'timeout'].forEach(function (field) {
            var group = document.querySelector('.' + field + '-group'); // e.g. .url-group
            var messageField = group.querySelector('.message');
            var message = errors[field].join(', ');
            if (!message) {
                group.classList.remove('has-error');
            } else {
                group.classList.add('has-error');
                messageField.innerHTML = message;
            }
            messageField.hidden = !message;
        });

        if (!errors.count) {
            if (window.localStorage) {
                window.localStorage.JMSProfiler = JSON.stringify({topics: (form.elements.topics.value), timeout: (timeout)});
            }
            plotData([], timeout * 1000);
            performSampling(wsFactory, url, topics, timeout * 1000);

        }
    }


    /*
     * Sets up the connection at url and returns a promise with the connection.
     */
    function requestConnection(url, wsFactory) {
        return new Q.Promise(function (resolve, reject) {
            var factory = new JmsConnectionFactory(url);
            factory.setWebSocketFactory(wsFactory);
            var future = factory.createConnection(function () {
                try {
                    var connection = future.getValue();
                    resolve(connection);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    function initProgress(selectors) {
        var names = selectors.map(function (t) {
            // strip '/topic/' prefix
            return t.substring(7)
        });
        var stats = names.map(function (topic) {
            return {topic: (topic), percent: 0, status: 0, scale: (1 / selectors.length) }
        });
        var container = d3.select('div.progress').style('display', 'none');
        var bar = container.selectAll('div.progress-bar').data(stats);

        function makePercent(d) {
            return Math.floor(d.percent * d.scale) + '%'
        }

        function redraw() {
            container.style('display', 'block');
            bar.data(stats).style('width', makePercent);
        }

        bar.enter()
            .append('div')
            .attr('class', 'progress-bar')
            .style('width', makePercent);

        bar.exit().remove();

        return (function () {
            return {
                update: function (selector, percent) {
                    var index = selectors.indexOf(selector);
                    stats[index].percent = percent;
                    redraw();
                },

                completed: function () {
                    container.style('display', 'none'); // TODO don't do this if there were errors
                }
            };
        })();

    }

    // TODO show name of the topic being collected
    // TODO report collection status by setting the color of the segment

    /*
     * Loops through the topics and collects statistics for each.
     */

    function collectAll(wsFactory, connection, topics, timeLimit) {
        return new Q.Promise(function (resolve, reject) {
            var result = [];
            var progress = initProgress(topics);
            topics.reduce(function (sequence, topic) {

                var updateInterval = 125; // ms
                var percentComplete = 0;
                var intervalRef;

                function incrementProgress(topic, increment) {
                    increment = increment || 10;
                    percentComplete += increment;
                    if (percentComplete > 100) percentComplete = 100;
                    progress.update(topic, percentComplete);
                }

                return sequence
                    .then(function () {
                        intervalRef = setInterval(function () {
                            incrementProgress(topic, 100 * (updateInterval / timeLimit))
                        }, updateInterval);
                    })
                    .then(function () {
                        return collectData(wsFactory.wrappedWebSocket, connection, topic, timeLimit)
                    })
                    .then(function (samples) {
                        samples = samples.filter(function (sample) {
                            return sample.b > 20
                        }); // filter out control packets, ping/pong, etc.
                        var sizes = samples.map(function (d) {
                            return d.b
                        });
                        var last = (samples.length) ? samples[samples.length - 1] : null;
                        var jmsCount = last ? last.j : 0;
                        var rate = Math.round(1000 * samples.length / timeLimit);
                        var tmax = last ? last.t : 0;
                        var extent = d3.extent(sizes);
                        var sum = d3.sum(sizes);
                        var bandwidth = Math.round(100 * sum / timeLimit) / 100;
                        result.push({topic: (topic), samples: (samples), min: (extent[0]), max: (extent[1]), rate: (rate), median: (d3.median(sizes)), sum: (sum), bandwidth: (bandwidth), tmax: (tmax), jmsCount: (jmsCount)});
                    })
                    .then(function () {
                        plotData(result, timeLimit)
                    }).fail(function(error) {
                        throw(error); // breaks out of the resolve loop, the catch below will get called 
                    }).finally(function () {
                        clearInterval(intervalRef);
                        progress.update(topic, 100);
                    })
;
            }, Q.Promise.resolve())
                .then(function () {
                    progress.completed();
                    resolve(result)
                }).catch(function (error) {
                    reject(error);
                });
        });
    }

    /*
     * Gathers the statistics for a single topic.
     */
    function collectData(webSocket, connection, topicName, timeLimit) {

        return new Q.Promise(function (resolve, reject) {
            var jmsCount = 0;

            var session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            // TODO handle errors when creating topic listeners
            var topic = session.createTopic(topicName);
            var consumer = session.createConsumer(topic);

            consumer.setMessageListener(function (msg) {
                ++jmsCount;
            });

            var wsSamples = [];

            /**
             * @returns a promise that resolves when the connection has been started.
             */
            function startConnection() {
                return new Q.Promise(function (resolve) {
                    function connectionStarted() {
                        resolve();
                    }

                    connection.start(connectionStarted);
                });
            }

            function stopConnection() {
                return new Q.Promise(function (resolve) {
                    function connectionStopped() {
                        resolve();
                    }

                    connection.stop(connectionStopped);
                });
            }

            function collectSamples() {
                return new Q.Promise(function (resolve) {
                    var timeoutID;
                    var startTime = Date.now();

                    function wsMessageListener(event) {
                        // event.data is a ByteBuffer
                        wsSamples.push({b: (event.data.limit), t: ((Date.now() - startTime) / 1000), j: (jmsCount) });
                    }

                    function completed() {
                        webSocket.removeEventListener('message', wsMessageListener, false);
                        if (timeoutID) clearTimeout(timeoutID);
                        resolve();
                    }

                    timeoutID = setTimeout(completed, timeLimit);
                    webSocket.addEventListener('message', wsMessageListener, false);
                });
            }

            function closeSession() {
                return new Q.Promise(function (resolve) {
                    function sessionClosed() {
                        session = null;
                        resolve();
                    }

                    session.close(sessionClosed);
                });
            }

            startConnection()
                .then(collectSamples)
                .then(stopConnection)
                .then(function () {
                    resolve(wsSamples);
                })
                .fail(function (error) {
                    reject(error);
                })
                .finally(closeSession);

        });
    }


// ========================================================
// Charting

    var margin = {top: 20, right: 80, bottom: 50, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    /*
     * Create or replace the SVG
     */
    function makeChart() {
        var div = d3.select('#graph');
        var oldSVG = div.select("svg");
        if (oldSVG) oldSVG.remove();

        return div.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    function makeTable() {
        var div = d3.select('#summary');
        var oldTable = div.select('table');
        if (oldTable) oldTable.remove();

        var table = div.append("table").attr('class', 'table table-striped');
        var thead = table.append("thead").append("tr");
        thead.append("th").text("Topic");
        thead.append("th").text("Packets");
        thead.append("th").text("Avg. Rate");
        thead.append("th").text("Min Size (B)");
        thead.append("th").text("Max Size (B)");
        thead.append("th").text("Median Size (B)");
        thead.append("th").text("Bandwidth");
        return table.append("tbody");
    }


    function plotData(data, timeLimit) {
        var div = d3.select('#results');
        var svg = makeChart();
        var tbody = makeTable();

        var hasData = !!data.length;
        var maxTime = d3.max(data.map(function (d) {
            return d.tmax
        })) || (timeLimit / 1000);
        var maxBytes = d3.max(data.map(function (d) {
            return d.max
        })) || 100; // initial byte count

        var t = d3.scale.linear()
            .range([0, width])
            .domain([0, Math.ceil(maxTime)]);

        var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, 10 * Math.ceil(maxBytes / 10)]);

        var color = d3.scale.category10()
            .domain(data.map(function (d) {
                return d.topic
            }));

        var xAxis = d3.svg.axis()
            .scale(t)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function (d) {
                return t(d.t);
            })
            .y(function (d) {
                return y(d.b);
            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append('text')
            .attr('font-style', 'italic')
            .attr('y', 30)
            .attr('x', 0)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .text("Time (s)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr('font-style', 'italic')
            .attr("y", -margin.left) // was: 6
            .attr("x", -height) // was: 6
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .text("Payload (bytes)");


        var topic = svg.selectAll('.topic')
            .data(data)
            .enter().append('g')
            .attr('class', 'topic');

        topic.append("path")
            .attr("class", "line")
            .attr("d", function (d) {
                return line(d.samples)
            })
            .style("stroke", function (d) {
                return color(d.topic)
            });

        topic.append("text")
            .datum(function (d) {
                var last = (d.samples.length == 0) ? 0 : d.samples[d.samples.length - 1];
                return {topic: (d.topic), sample: (last.t), value: (d.median) }
            })
            .attr("transform", function (d) {
                return "translate(" + t(d.sample) + "," + y(d.value) + ")";
            })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.topic.substr(7);
            })
            .style("fill", function (d) {
                return color(d.topic)
            });

        var summary = tbody.selectAll('tr.summary')
            .data(data)
            .enter()
            .append('tr')
            .attr('class', 'summary');

        summary.append('td').text(function (d) {
            return d.topic
        });
        summary.append('td').text(function (d) {
            return d.samples.length
        });
        summary.append('td').text(function (d) {
            return d.rate + " msg/s"
        });
        summary.append('td').text(function (d) {
            return d.min
        });
        summary.append('td').text(function (d) {
            return d.max
        });
        summary.append('td').text(function (d) {
            return d.median
        });
        summary.append('td').text(function (d) {
            return d.bandwidth + " KB/s";
        });

    }

})();



