// TODO: wrapped websocket should be created internally, need to extend the pattern and intercept JmsConnectionFactory.createConnection more intelligently
// TODO: use jquery instead of d3 to draw/update the table
// TODO: change results table update to map based on cell id so table/row not redrawn every time if already exists
// TODO: d3 required? now only being used for a couple of math functions and table drawing
// TODO: add latency probe like in FX demo http://demo.kaazing.com/forex/ - NB. This might require a gateway echo service etc
// TODO: handle connectivity breaks
// TODO: document config, usage and dependencies
// TODO: tighten defensive coding in initialisation and setters

// TODO: Optional - This could be a standalone widget and render its own UI buttons
// TODO: Optional - what's the best live chart format for this?

/****************************************************************
 *   console object stub for IE8 with no dev tools open etc
 ****************************************************************/
if(typeof console === 'undefined') {
    console = { log: function() { } };
}

/****************************************************************
 *   create jmsWebSocketProfiler module within Kaazing namespace
 ****************************************************************/
Kaazing = window.Kaazing || {};

Kaazing.jmsWebSocketProfiler = (function () {

    /****************************************************************
     *   compatibility check and dependencies
     ****************************************************************/
    var hasRequired =  !!(window.Modernizr && window.$ && window.WebSocketFactory && Array.prototype.forEach && document.querySelector), // TODO: foreach and querySelector required by d3?
        dependencies = [
            'lib/d3.v3.min.js'
        ];

    if (hasRequired) {
        console.log('JMS WebSocket Profiler: Loading dependencies');
        Modernizr.load([
            { load: dependencies }
        ]);
    } else {
        console.log('JMS WebSocket Profiler: Error! Unable to initialise due to missing dependencies.  Requires Modernizr, jQuery, Kaazing JMS client library, ES5 and querySelector');

        // return stub to prevent any subsequent application calls from throwing exceptions
        var stub = function () { console.log('JMS WebSocket Profiler: Error! Unsupported method call') };
        return {
            initialise: stub,
            start: stub,
            stop: stub
        };
    }


    /****************************************************************
     *   private variables
     ****************************************************************/
    var webSocketFactory,
        webSocket,
        profileFrequencyMilliseconds,
        profileIntervalID,
        intervalWebSocketPackets = [],
        cumulativeWebSocketPackets = 0,
        cumulativeWebSocketBytes = 0,
        tableDivIDSelector,
        statsHandler = null,
        includeControlPackets = false,
        enableLatencyProbe = false,
        debug,
        isInitialised = false;

    /****************************************************************
     *   private methods
     ****************************************************************/
    var initialise = function (config) {
            debug = config.debug || false;
            if (debug) { console.log('JMS WebSocket Profiler: initialising'); }
            profileFrequencyMilliseconds = config.profileFrequencyMilliseconds || 2000;
            if (config.tableDivID) { tableDivIDSelector = '#' + config.tableDivID; }
            statsHandler = config.statsHandler;
            includeControlPackets = config.includeControlPackets || false;
            enableLatencyProbe = config.enableLatencyProbe || false;
            isInitialised = true;
        },

        interceptSocketCreation = function (wsFactory, intercept) {
            var superCreate = WebSocketFactory.prototype.createWebSocket;

            wsFactory.__proto__.createWebSocket = (function () {
                return function (location, protocols) {
                    var webSocket = superCreate.call(wsFactory, location, protocols);
                    intercept(webSocket);
                    return webSocket;
                }
            })();
        },

        jmsWebSocketMessageEventListener = function (event) {
            var messageBytes = event.data.limit; // event.data is a Kaazing ByteBuffer
            if (includeControlPackets || messageBytes > 20) {
                cumulativeWebSocketPackets++;
                cumulativeWebSocketBytes = cumulativeWebSocketBytes + messageBytes;
                intervalWebSocketPackets.push({
                    bytes: (messageBytes)
                });
            }
        },

        processWebSocketPackets = function () {

            var sizes = intervalWebSocketPackets.map(function (d) {
                return d.bytes
            });

            var rate = Math.round(1000 * intervalWebSocketPackets.length / profileFrequencyMilliseconds);
            var extent = d3.extent(sizes);
            var sum = d3.sum(sizes);
            var bandwidth = Math.round(100 * sum / profileFrequencyMilliseconds) / 100;

            var stats = {
                cumulativeWebSocketPackets: (cumulativeWebSocketPackets),
                cumulativeWebSocketBytes: (cumulativeWebSocketBytes),
                intervalWebSocketPackets: (intervalWebSocketPackets.length),
                intervalMinPacketBytes: (extent[0]),
                intervalMaxPacketBytes: (extent[1]),
                intervalMedianPacketBytes: (d3.median(sizes)),
                intervalWebSocketPacketsPerSecond: (rate),
                intervalMilliseconds: (profileFrequencyMilliseconds),
                intervalKiloBytesPerSecond: (bandwidth)
            };

            // reset collated packets for next sampling period
            intervalWebSocketPackets = [];

            return stats;
        },

        makeTable = function () {
            var div = d3.select(tableDivIDSelector);
            var oldTable = div.select('table');
            if (oldTable) oldTable.remove();

            var table = div.append("table").attr('class', 'table table-striped');
            var thead = table.append("thead").append("tr");
            thead.append("th").text("Tot Msg");
            thead.append("th").text("Tot Size (KB)");
            thead.append("th").text("Int Msg");
            thead.append("th").text("Avg Rate");
            thead.append("th").text("Min Size (B)");
            thead.append("th").text("Max Size (B)");
            thead.append("th").text("Median Size (B)");
            thead.append("th").text("Bandwidth");
            return table.append("tbody");
        },

        emitStats = function (stats) {

            // call any stats handler registered by the application
            statsHandler && statsHandler(stats);

            // update table summary
            if (tableDivIDSelector) {

                var d3Data = [stats]; // insert stats object into array for d3
                var tbody = makeTable();

                var summary = tbody.selectAll('tr.summary')
                    .data(d3Data)
                    .enter()
                    .append('tr')
                    .attr('class', 'summary');

                summary.append('td').text(function (d) {
                    return d.cumulativeWebSocketPackets;
                });
                summary.append('td').text(function (d) {
                    return d.cumulativeWebSocketBytes / 1000;
                });
                summary.append('td').text(function (d) {
                    return d.intervalWebSocketPackets;
                });
                summary.append('td').text(function (d) {
                    return d.intervalWebSocketPacketsPerSecond + ' msg/s';
                });
                summary.append('td').text(function (d) {
                    return d.intervalMinPacketBytes;
                });
                summary.append('td').text(function (d) {
                    return d.intervalMaxPacketBytes;
                });
                summary.append('td').text(function (d) {
                    return d.intervalMedianPacketBytes;
                });
                summary.append('td').text(function (d) {
                    return d.intervalKiloBytesPerSecond + ' KB/s';
                });
            }
        },

        profile = function () {
            emitStats(processWebSocketPackets());
        },

        setProfileFrequencyMilliseconds = function (value) {
            profileFrequencyMilliseconds = value;
            if (profileIntervalID) { clearInterval(profileIntervalID); }
            profileIntervalID = setInterval(profile, profileFrequencyMilliseconds);
        },

        setStatsHandler = function (value) {
            statsHandler = value;
        },

        setTableDivID = function (value) {
            tableDivIDSelector = '#' + value;
        },

        start = function () {
            webSocket = webSocketFactory.wrappedWebSocket; // relies on the app having set this on the JmsConnectionFactory and this being called after connection established
            if (!isInitialised) {
                console.log('JMS WebSocket Profiler: Error! Profiler has not been initialised. Call initialise() before starting.');
                return -1;
            } else if (!webSocket) {
                console.log('JMS WebSocket Profiler: Error! Unable to start - no WebSocket available');
                return -2;
            } else {
                cumulativeWebSocketPackets = 0;
                cumulativeWebSocketBytes = 0;
                intervalWebSocketPackets = [];
                webSocket.addEventListener('message', jmsWebSocketMessageEventListener, false);
                profile();
                profileIntervalID = setInterval(profile, profileFrequencyMilliseconds);
                if (debug) { console.log('JMS WebSocket Profiler: profiling started'); }
                return 0;
            }
        },

        stop = function () {
            if (debug) { console.log('JMS WebSocket Profiler: profiling stopped'); }
            if (webSocket) { webSocket.removeEventListener('message', jmsWebSocketMessageEventListener, false); }
            if (profileIntervalID) { clearInterval(profileIntervalID); }
            if (tableDivIDSelector) {
                $(tableDivIDSelector).children().fadeOut(function () {
                    $(tableDivIDSelector).empty();
                });
            }
        };

    /****************************************************************
     *   intercept WebSocket creation so we can attach listeners
     ****************************************************************/
    webSocketFactory = new WebSocketFactory();
    interceptSocketCreation(webSocketFactory, function (ws) {
        webSocketFactory.wrappedWebSocket = ws;
    });

    /****************************************************************
     *   public interface
     ****************************************************************/
    return {
        initialise: initialise,
        setProfileFrequencyMilliseconds: setProfileFrequencyMilliseconds,
        setStatsHandler: setStatsHandler,
        setTableDivID: setTableDivID,
        start: start,
        stop: stop,
        webSocketFactory: webSocketFactory
    };
}());