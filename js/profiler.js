(function profiler() {
    "use strict";

    Tracer.setTrace(false);
    var profileIndexes = [];
    var url = "ws://localhost:8001/jms";

    var wsf = new WebSocketFactory();
    // Will save the web socket so we can attach event listeners to it later
    interceptSocketCreation(wsf, function (ws) {
        wsf.wrappedWebSocket = ws;
    });
    var connection = requestConnection(url, wsf);
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

    function performSampling(wsFactory, url, topic, sampleLimit, timeLimit) {
        collectAll(wsFactory, connection, topic, sampleLimit, timeLimit).then(
            function (data) {
                plotData(data, timeLimit);
            }
        ).catch(function (error) {
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

		var  subscribedTopics = sessionStorage.getItem('currentSportsbookTopicSubscriptions');
        var timeout = 5;
        
		// extract the topic names
		var topics = (subscribedTopics || '').split(",")
          .filter(function (name) {
              return name.trim()
          })
        
        setInterval(function () { gatherStats(wsFactory, url, topics, timeout)}, 5000);
		//gatherStats(wsFactory, url, topics, timeout);
    }
    
    function gatherStats(wsFactory, url, topics, timeout) {
    	plotData([], timeout * 1000);
        performSampling(wsFactory, url, topics, timeout * 1000);
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
       return (function () {
            return {
                update: function (selector, percent) {
                    var index = selectors.indexOf(selector);
                    stats[index].percent = percent;

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
    
    function getProfileTable() {
        var div = d3.select('#summary');
        var table = div.select('table');
        return table.select('tbody');
    }
    
    function plotData(data, timeLimit) {		
        var div = d3.select('#results');
        var tbody = getProfileTable();
        
       	var summary = tbody.selectAll('tr.summary')
            .data(data)
            .enter();
            
        if (data.length > 0) {
			var profileIndex = profileIndexes.indexOf(data[0].topic);
			if (profileIndex === -1) {
				profileIndexes.push(data[0].topic);
				profileIndex = profileIndexes.indexOf(data[0].topic)
			}
			var resultRow = profileTable.rows[profileIndex + 1];
			if (resultRow === undefined) {
				var profileIndex = profileTable.rows.length;
	    		resultRow = profileTable.insertRow(profileIndex);
	    		for (var cell = 0; cell < 7; cell++) {
	    			resultRow.insertCell(cell);
	    		}
	    	}
	    	resultRow.cells[0].innerHTML = data[0].topic;
   			resultRow.cells[1].innerHTML = data[0].samples.length;
        	resultRow.cells[2].innerHTML = data[0].rate + " msg/s";
        	resultRow.cells[3].innerHTML = data[0].min;
        	resultRow.cells[4].innerHTML = data[0].max;
        	resultRow.cells[5].innerHTML = data[0].median;
        	resultRow.cells[6].innerHTML = data[0].bandwidth + " KB/s";
    	}
    }
})();