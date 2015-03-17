var
	subscribedSport,
	subscribedMarket,
	marketList = [],
	rowIndexes = [],
	suspendEventIndexes = [],
	revertEventIndexes = [],
	connection,
	session,
	marketSelected,
	priceConsumer;

var clientId = sessionStorage.getItem("clientId");


window.onload = function() {
	var url = "ws://localhost:8001/jms";
	document.getElementById("clientid").innerHTML = clientId;
	if (connection == null) {
		try {
        	var connectionFactory = new JmsConnectionFactory(url);
        	var jmsConnectionFactory = new JmsConnectionFactory(url);
			jmsConnectionFactory.setWebSocketFactory(Kaazing.jmsWebSocketProfiler.webSocketFactory);
            var connectionFuture = connectionFactory.createConnection(function () {
            	if (!connectionFuture.exception) {
            		try {
                		connection = connectionFuture.getValue();
                    	connection.setExceptionListener(handleException);
                   		session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
						connection.start(function () { /* Started */ });
						initialiseProfiler();
					} catch (e) {
                		handleException(e);
                	}
				} else {
            		handleException(connectionFuture.exception);
           		}
        	});
        } catch (e) {
       		handleException(e);
		}
	}
}

function initialiseProfiler() {
	Kaazing.jmsWebSocketProfiler.initialise({
    	profileFrequencyMilliseconds: 2000,
    	tableDivID: 'profileTable',
    	statsHandler: function (stats) {
        	console.log(stats); // for example
    	}
	});
}
            
function handleException(e) {
	alert("<span class='error'>EXCEPTION: " + e+"</span>");
}

function onMessage(message) {
	var topic = message.getString("Topic");
    var price = message.getString("Value");
    var status = message.getString("Status");
    var fields = topic.split('.');
    if (topic.indexOf('Delta') === -1) {
   		var sport = fields[1];
   		var market = fields[2];
    	var destination = fields[3];
    	var event = fields[4];
  		var selection = fields[5];	
  	} else {
  		var sport = fields[2];
   		var market = fields[3];
    	var destination = fields[4];
    	var event = fields[5];
  		var selection = fields[6];
  	}
   	var index = sport + "/" + market + "/" + event;
   	var marketRecord = {"index": index, "sport": sport, "market": market, "event": event, "topic": topic, "status": status};
        	
   	var indexNo = findIndexNo(marketList, index);
   	if (indexNo === -1) {
    	updateMarket(selection, marketRecord, price, status);
       	marketList.push(marketRecord);
       	marketList.sort(function (a, b) {
  			if (a.index > b.index) {
    			return 1;
  			}
  			if (a.index < b.index) {
    			return -1;
  			}
  			// a must be equal to b
  			return 0;
		});    	
	} else {
    	marketRecord = marketList[indexNo];
    	updateMarket(selection, marketRecord, price, status);
    	if (marketSelected == marketRecord.market) {
    		buildSuspendList(event);
    		buildRevertList(event);
    		buildSelectionList(marketRecord.market);
    	}
    }
}
  
// Update market record with price values          
function updateMarket(selection, marketRecord, price, status) {
	switch (selection) {
    	case "Home":
        	marketRecord["home"] = price;
        	break;
       	case "Draw":
        	marketRecord["draw"] = price;
            break;
        case "Away":
        	marketRecord["away"] = price;
            break;
	}
	marketRecord.status = status;
}
    
// If the event is complete, display in the main section table        
function displayRow(stockRow, marketRecord) {
	if (checkForFullRecord(marketRecord)) {
		stockRow.cells[0].innerHTML = marketRecord.event;
    	stockRow.cells[0].className = "adminevent";
    	stockRow.cells[1].innerHTML = marketRecord.home;
   		stockRow.cells[1].className = "adminhome";
   		stockRow.cells[2].innerHTML = marketRecord.draw;
   		stockRow.cells[2].className = "admindraw";
   		stockRow.cells[3].innerHTML = marketRecord.away;
   		stockRow.cells[3].className = "adminaway";
   		stockRow.style.backgroundColor = '#F47D31';
   		stockRow.style.display = '';
   		if (marketRecord.status == "Invalid") {
   			stockRow.style.backgroundColor = 'grey';
   		} 
   	} else {
   		stockRow.style.display = 'none';
   	}
}
   
// Does the market record already exist in the index list         
function findIndexNo(array, value) {
	for(var i = 0; i < array.length; i++) {
    	if (array[i].index === value) {
        	return i;
        } 
    }
    return -1
}

// This is the entry point from the UI. When they click on an market, the subscribe function is called

function subscribe(sport, market) {
	var topicName;
	var deltaChecked = document.getElementById('delta').checked;
	subscribedSport = sport;
	subscribedMarket = market;
	
	// Clear the tables
	clearTables();
	
	// Unsubscribe to previously subscribed topics
	if (priceConsumer) {
		priceConsumer.close(function() {});
		marketList = [];
	}
	if (!deltaChecked) {
		topicName = "/topic/SportsBook."+sport+"."+market+".>";
		var topic = session.createTopic(topicName);
    	priceConsumer = session.createConsumer(topic);	
		priceConsumer.setMessageListener(onMessage);
	} else {
		topicName = "/topic/SportsBook.Delta."+sport+"."+market+".>";
		var topic = session.createTopic(topicName);
    	priceConsumer = session.createConsumer(topic);	
		priceConsumer.setMessageListener(onMessage);
	}

	selectSport(market);
	
	// Stop the profiler
	Kaazing.jmsWebSocketProfiler.stop();
	
	// Start the profiler
	Kaazing.jmsWebSocketProfiler.start();
}
	
// Select the market user has subscribed too		
function selectSport(value) {
	if (value != marketSelected) {
		clearTables();
   	}
   	marketSelected = value;
}

function clearTables() {
	clearTable("sportTable");
	clearTable("suspendTable");
	clearTable("revertTable");
	rowIndexes = [];
	suspendEventIndexes = [];
	revertEventIndexes = [];
}

// Display prices in the main section table
function displayPrices() {
  	for(var i = 0; i < rowIndexes.length; i++) {
		var displayPrice = rowIndexes[i];
       	if (displayPrice != null) {
       		var rowIndex = rowIndexes.indexOf(displayPrice);
	        var stockRow = sportTable.rows[rowIndex + 1];
			if (stockRow === undefined) {
	        	var sportTableIndex = sportTable.rows.length;
	            stockRow = sportTable.insertRow(sportTableIndex);
	            for (var cell=0; cell < 4; cell++) {
	            	stockRow.insertCell(cell);
               	}
	    	}
	    	displayRow(stockRow, displayPrice);
	    }
	}
}

function buildSelectionList(value) {
	rowIndexes = [];
	for (var i = 0; i < marketList.length; i++) {
    	if (marketList[i].market === value) {
			var displayPrice = marketList[i];
           	if (displayPrice != null) {
	        	var rowIndex = rowIndexes[displayPrice];
				if (rowIndex === undefined) {
	           		rowIndexes.push(displayPrice);
	           		rowIndexes.sort(function (a, b) {
  					if (a.index > b.index) {
    					return 1;
  					}
  					if (a.index < b.index) {
    					return -1;
  					}
  					// a must be equal to b
  					return 0;
					});
					
				}
	        }
	    }
	}
	displayPrices();
}

function checkForFullRecord(displayPrice) {
	if (displayPrice.home === undefined || displayPrice.home === null) {
		return false;
   	} else if (displayPrice.draw === undefined || displayPrice.draw === null) {
    	return false;
   	} else if (displayPrice.away === undefined || displayPrice.away === null) {
   		return false;
   	}
   	// All prices have been populated
   	return true;
}

function checkForSuspendRecord(displayPrice) {
	if (displayPrice.home != "Suspended") {
		return false;
   	} else if (displayPrice.draw != "Suspended") {
    	return false;
   	} else if (displayPrice.away != "Suspended") {
   		return false;
   	}
   	// All prices have been suspended
   	return true;
}

function createDestination(name, session) {
    if (name.indexOf("/topic/") == 0) {
        return session.createTopic(name);
    }
    else if (name.indexOf("/queue/") == 0) {
        return session.createQueue(name);
    }
    else {
        throw new Error("Destination must start with /topic/ or /queue/");
    }
}

function buildSuspendList(event) {
	for (var i = 0; i < marketList.length; i++) {
    	if (marketList[i].event === event) {
			var suspendEvent = marketList[i];
           	if ((suspendEvent != null) && (suspendEvent.status == "Valid")) {
				var suspendIndex = suspendEventIndexes.indexOf(event);
				if (suspendIndex == -1) {
					suspendEventIndexes.push(event);
	    			suspendEventIndexes.sort(function (a, b) {
  						if (a.index > b.index) {
    						return 1;
  						}
  						if (a.index < b.index) {
    						return -1;
  						}
  						// a must be equal to b
  						return 0;
					});
				}
			}
		}
		loadSuspendEvents();
	}
}

function buildRevertList(event) {
	for (var i = 0; i < marketList.length; i++) {
    	if (marketList[i].event === event) {
			var revertEvent = marketList[i];
           	if ((revertEvent != null) && (revertEvent.status == "Invalid")) {
				var revertIndex = revertEventIndexes.indexOf(event);
				if (revertIndex == -1) {
					revertEventIndexes.push(event);
	    			revertEventIndexes.sort(function (a, b) {
  						if (a.index > b.index) {
    						return 1;
  						}
  						if (a.index < b.index) {
    						return -1;
  						}
  						// a must be equal to b
  						return 0;
					});
				}
			}
		}
		loadRevertEvents();
	}
}

function clearTable(tableId) {
	var table = document.getElementById(tableId);
	for (var j = 1; j < table.rows.length;) {   
   		table.deleteRow(j);
   	}
}

function loadSuspendEvents() {
	for(var i = 0; i < suspendEventIndexes.length; i++) {
		var event = suspendEventIndexes[i];
       	if (event != null) {
       		var suspendIndex = suspendEventIndexes.indexOf(event);
	        var suspendRow = suspendTable.rows[suspendIndex + 1];
			if (suspendRow === undefined) {
	        	var suspendTableIndex = suspendTable.rows.length;
	            suspendRow = suspendTable.insertRow(suspendTableIndex);
	            for (var cell=0; cell < 1; cell++) {
	            	suspendRow.insertCell(cell);
               	}
	    	}
	    	displaySuspendRow(suspendRow, event);
	    }
	}
}

function loadRevertEvents() {
	for(var i = 0; i < revertEventIndexes.length; i++) {
		var event = revertEventIndexes[i];
       	if (event != null) {
       		var revertIndex = revertEventIndexes.indexOf(event);
	        var revertRow = revertTable.rows[revertIndex + 1];
			if (revertRow === undefined) {
	        	var revertTableIndex = revertTable.rows.length;
	            revertRow = revertTable.insertRow(revertTableIndex);
	            for (var cell=0; cell < 1; cell++) {
	            	revertRow.insertCell(cell);
               	}
	    	}
	    	displayRevertRow(revertRow, event);
	    }
	}
}

function displaySuspendRow(suspendRow, event) {
	suspendRow.cells[0].innerHTML = event;
   	suspendRow.cells[0].className = "suspendevent";
   	suspendRow.cells[0].onclick = function () { suspendEvent(this, event); }  		
	suspendRow.style.display = '';
}

function displayRevertRow(revertRow, event) {
	revertRow.cells[0].innerHTML = event;
    revertRow.cells[0].className = "revertevent";
    revertRow.cells[0].onclick = function () { revertEvent(this, event); }  		
	revertRow.style.display = '';
}
   
function suspendEvent(el, event) {
	suspendPrice(el, event);
    var dest = createDestination("/topic/suspend", session);
    var producer = session.createProducer(dest);
    var mapMessage = session.createMapMessage();
    mapMessage.setString("Topic", event);
    mapMessage.setString("Status", "Invalid");
	try {
    	var future = producer.send(mapMessage, function() {
        	if (future.exception) {
        		handleException(future.exception);
        	}
     	});
	} catch (e) {
    	handleException(e);
    }
}

function revertEvent(el, event) {
	revertPrice(el, event);
    var dest = createDestination("/topic/revert", session);
    var producer = session.createProducer(dest);
    var mapMessage = session.createMapMessage();
    mapMessage.setString("Topic", event);
    mapMessage.setString("Status", "Valid");
	try {
    	var future = producer.send(mapMessage, function() {
        	if (future.exception) {
        		handleException(future.exception);
        	}
     	});
	} catch (e) {
    	handleException(e);
    }
}

function revertPrice(el, event) {
	var node = el.parentNode;
  	while (node && node.tagName.toLowerCase() != 'tr') {
   		node = node.parentNode;
  	}
  	if (node) node.parentNode.removeChild(node);
  	
	// Remove index from revertEventIndexes array
  	var i = revertEventIndexes.indexOf(event);
	if (i != -1) {
		revertEventIndexes.splice(i, 1);
	}
	loadRevertEvents();
}

function suspendPrice(el, event) {
	var node = el.parentNode;
  	while (node && node.tagName.toLowerCase() != 'tr') {
   		node = node.parentNode;
  	}
  	if (node) node.parentNode.removeChild(node);
  	
  	// Remove index from suspendEventIndexes array
  	var i = suspendEventIndexes.indexOf(event);
	if (i != -1) {
		suspendEventIndexes.splice(i, 1);
	}
	loadSuspendEvents();
}

function changeFrequency() {
	var obj = document.getElementById("rateSelect");
	var frequency = obj.options[obj.selectedIndex].text;
	var dest = createDestination("/topic/frequencychange", session);
    var producer = session.createProducer(dest);
    var mapMessage = session.createMapMessage();
    mapMessage.setString("Topic", "frequencychange");
    mapMessage.setString("Frequency", frequency);
	try {
    	var future = producer.send(mapMessage, function() {
        	if (future.exception) {
        		handleException(future.exception);
        	}
     	});
	} catch (e) {
    	handleException(e);
    }
}

function deltaMessages() {
	subscribe(subscribedSport, subscribedMarket);
}