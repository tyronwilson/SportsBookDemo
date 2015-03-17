var marketList = [],
 	betSlipIndexes = [],
	rowIndexes = [],
	betConfirmationIndexes = [],
	connection,
	session,
	marketSelected,
	priceConsumer,
	betConsumer;
	
var clientId = sessionStorage.getItem("clientId");

window.onload = function() {
	var url = "ws://localhost:8001/jms";
	document.getElementById("clientid").innerHTML = clientId;
	if (connection == null) {
		try {
        	var connectionFactory = new JmsConnectionFactory(url);
            var connectionFuture = connectionFactory.createConnection(function () {
            	if (!connectionFuture.exception) {
            		try {
                		connection = connectionFuture.getValue();
                    	connection.setExceptionListener(handleException);
                   		session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
						connection.start(function () { /* Started */ });
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
           
function handleException(e) {
	alert("<span class='error'>EXCEPTION: " + e+"</span>");
}

function onMessage(message) {
	var topic = message.getString("Topic");
	if (topic.indexOf('confirmbet') !== -1) {
		displayBetConfirmation(message);
	} else {
    	var price = message.getString("Value");
    	var status = message.getString("Status");
   		var fields = topic.split('.');
    	var sport = fields[1];
   		var market = fields[2];
    	var destination = fields[3];
    	var event = fields[4];
    	var selection = fields[5];
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
    			buildSelectionList(marketRecord.market);
    			updateBetSlip(marketRecord);
    		}
    	}
    }
}

function displayBetConfirmation(message) {
	var topic = message.getString("Topic");
    var value = message.getString("Value").replace(/\n/g, '<br />');;
    var accumulator = message.getString("Accumulator");
    var totalWin = message.getString("TotalWin");
    var betConfirmIndex = betConfirmationIndexes.indexOf(value);
	if (betConfirmIndex === -1) {
		betConfirmationIndexes.push(value);
	}
	var confirmIndex = betConfirmationIndexes.indexOf(value);
	var confirmRow = betHistoryTable.rows[confirmIndex + 1];
	if (confirmRow === undefined) {
		var confirmIndex = betHistoryTable.rows.length;
	    confirmRow = betHistoryTable.insertRow(confirmIndex);
	    for (var cell = 0; cell < 3; cell++) {
	    	confirmRow.insertCell(cell);
	    }
	    confirmRow.cells[0].innerHTML = value;
   		confirmRow.cells[1].innerHTML = accumulator;
   		confirmRow.cells[2].innerHTML = totalWin;
   		confirmRow.style.color = "#58595C";
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
    	stockRow.cells[0].className = "event";
    	stockRow.cells[1].innerHTML = marketRecord.home;
   		stockRow.cells[1].className = "home";
   		stockRow.cells[1].onclick = function () { createBet(this.innerHTML, marketRecord.event, "Home"); }
   		stockRow.cells[2].innerHTML = marketRecord.draw;
   		stockRow.cells[2].className = "draw";
   		stockRow.cells[2].onclick = function () { createBet(this.innerHTML, marketRecord.event, "Draw"); }
   		stockRow.cells[3].innerHTML = marketRecord.away;
   		stockRow.cells[3].className = "away";
   		stockRow.cells[3].onclick = function () { createBet(this.innerHTML, marketRecord.event, "Away"); }
   		stockRow.style.backgroundColor = '#F47D31';
   		stockRow.style.display = '';
   		if (marketRecord.status == "Invalid") {
   			stockRow.cells[1].onclick = '';
   			stockRow.cells[2].onclick = '';
   			stockRow.cells[3].onclick = '';
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
	// Unsubscribe to previously subscribed topics
	if (priceConsumer) {
		priceConsumer.close(function() {});
		marketList = [];
	}
	
	// Subscribe to new selected topics
	var topicName = "/topic/SportsBook."+sport+"."+market+".>";
	var topic = session.createTopic(topicName);
    priceConsumer = session.createConsumer(topic);	
	priceConsumer.setMessageListener(onMessage);
	
	var betTopicName = "/topic/confirmbet/" + clientId;
	var betTopic = session.createTopic(betTopicName);
    betConsumer = session.createConsumer(betTopic);	
	betConsumer.setMessageListener(onMessage);
	
	selectSport(market);
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
	rowIndexes = [];
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

// Create a bet slip record
function createBet(price, event, selection) {
	var eventIndex = betSlipIndexes.indexOf(event);
	if (eventIndex === -1) {
		betSlipIndexes.push(event);
	}
	var betSlipIndex = betSlipIndexes.indexOf(event);
	var betSlipRow = betSlipTable.rows[betSlipIndex + 1];
	if (betSlipRow === undefined) {
		var betSlipIndex = betSlipTable.rows.length;
	    betSlipRow = betSlipTable.insertRow(betSlipIndex);
	    betSlipRow.setAttribute("id","betrecord");
	    for (var cell=0; cell < 5; cell++) {
	    	betSlipRow.insertCell(cell);
	    }
	    betSlipRow.cells[0].innerHTML = event;
   		betSlipRow.cells[1].innerHTML = selection
        betSlipRow.cells[2].innerHTML = price;
        betSlipRow.cells[2].className = "betprice";
        betSlipRow.cells[3].innerHTML = "<input type='text' class='stakeamount'  name='Stake' id='"+ event +"-Price' value='£0.00'>";
        betSlipRow.cells[3].onchange = function () { calculateWinEstimate(price, event); }
       	betSlipRow.cells[4].innerHTML = "<input type='text' class='winestimate' name='WinEstimate' id='"+ event +"-WinEstimate' value='£0.00' disabled>";
//       	betSlipRow.cells[5].innerHTML = "<button type='button' class='deletebet'>"
//       	betSlipRow.cells[5].onclick = function () { deleteBet(this, event); }
		
	} else {
		betSlipRow.cells[1].innerHTML = selection
       	betSlipRow.cells[2].innerHTML = price;
       	betSlipRow.cells[3].innerHTML = "<input type='text' class='stakeamount'  name='Stake' id='"+ event +"-Price' value='£0.00' >";
        betSlipRow.cells[3].onchange = function () { calculateWinEstimate(price, event); }
       	betSlipRow.cells[4].innerHTML = "<input type='text' class='winestimate' name='WinEstimate' id='"+ event +"-WinEstimate' value='£0.00' disabled>";
       	betSlipRow.style.backgroundColor = '#F47D31';
       	calculateAccumulator();
	}
}

function updateBetSlip(marketRecord) {
	var betSlipIndex = betSlipIndexes.indexOf(marketRecord.event);
	if (betSlipIndex != -1) {
		var betSlipRow = betSlipTable.rows[betSlipIndex + 1];
		if ((betSlipRow != null) && (marketRecord.status == "Invalid")) {
			betSlipRow.cells[2].innerHTML = 'Suspended';
        	betSlipRow.cells[3].innerHTML = "<input type='text' class='stakeamount' value='£0.00' disabled>";
        	betSlipRow.cells[3].onchange = function () { calculateWinEstimate(price, event); }
       		betSlipRow.cells[4].innerHTML = "<input type='text' class='winestimate' value='£0.00' disabled>";
       		betSlipRow.style.backgroundColor = 'grey';
       		calculateAccumulator();
       	}
	}
}

// Function to calculate the estimated win
function calculateWinEstimate(price, event) {
	var stake = parseFloat(checkForPoundSign(document.getElementById(event +"-Price").value));
	var i = price.indexOf('/');
	var numerator = parseInt(price.slice(0, i).trim());
	var denominator = parseInt(price.slice(i + 1, price.length).trim());
	var winEstimate = ((stake * (numerator / denominator)) + stake);
	document.getElementById(event +"-Price").value = "£" + stake.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '£&,');
	document.getElementById(event +"-WinEstimate").value = "£" + winEstimate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '£&,');
	calculateTotalWinEstimate();
}

// Delete the bet record from the bet slip			
function deleteBet(el, index) {
	var node = el.parentNode;
  	while (node && node.tagName.toLowerCase() != 'tr') {
   		node = node.parentNode;
  	}
  	if (node) node.parentNode.removeChild(node);
  	
  	// Remove index from betSlipArray
  	var i = betSlipIndexes.indexOf(index);
	if (i != -1) {
		betSlipIndexes.splice(i, 1);
	}
	calculateTotalWinEstimate();
}

// Calculate the total estimated win
function calculateTotalWinEstimate() {
	var total = 0;
	var elems = document.getElementsByClassName('winestimate');
	for (var i = 0, len = elems.length; i < len; i++) {
		var price = parseFloat(checkForPoundSign(elems[i].value.slice(1)));
		if (price != "Suspended") {
   			total = total + price;
   		} 
	}
	document.getElementById('estimatedwin').value = "£" + total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '£&,');
}

function checkBetFields() {
	var stakes = document.getElementsByClassName('stakeamount');
	var winEstimates = document.getElementsByClassName('winestimate');
	if (document.getElementById('accumulator').checked) {
		for (var i = 0, len = stakes.length; i < len; i++) {
			stakes[i].value = '£0.00';
			stakes[i].disabled = true;
		}
		for (var i = 0, len = winEstimates.length; i < len; i++) {
			winEstimates[i].value = '£0.00';
		}
		document.getElementById('estimatedwin').value = '£0.00';
		document.getElementById('accumulatoramount').disabled = false;
		calculateAccumulator();
	} else {
		for (var i = 0, len = stakes.length; i < len; i++) {
			stakes[i].value = '£0.00';
			stakes[i].disabled = false;
		}
		document.getElementById('estimatedwin').value = '£0.00';
		document.getElementById('accumulatoramount').value = '£0.00';
		document.getElementById('accumulatoramount').disabled = true;
	}
}

function calculateAccumulator() {
	var stake = parseFloat(checkForPoundSign(document.getElementById('accumulatoramount').value));
	if ((document.getElementById('accumulator').checked) && (stake > 0)) {
		var accumulatorTotal = 0;
		var winEstimate = 0;
		var prices = document.getElementsByClassName('betprice');
		for (var i = 0, len = prices.length; i < len; i++) {
			var price = prices[i].innerHTML;
			if (price != "Suspended") {
				var x = prices[i].innerHTML;
				var y = x.indexOf('/');
				var numerator = parseInt(x.slice(0, y).trim());
				var denominator = parseInt(x.slice(y + 1, x.length).trim());
				if (accumulatorTotal == 0) {
					winEstimate = ((stake * (numerator / denominator)) + stake);
				} else {
					winEstimate = (accumulatorTotal * (numerator / denominator));
				}
				accumulatorTotal = accumulatorTotal + winEstimate;
			}
		}
		document.getElementById('accumulatoramount').value = "£" + stake.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '£&,');
		document.getElementById('estimatedwin').value = "£" + accumulatorTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '£&,');
	}
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

function clearTable(tableId) {
	var table = document.getElementById(tableId);
	for (var j = 1; j < table.rows.length;) {   
   		table.deleteRow(j);
   	}
}

// Submit the bet slip (to be enhanced)
function submitBet() {
	//Create bet slip message body
	var completeBetSlip = false;
	var messageBody = "";
	var accumulator = "";
	var totalWin = "";
	var betRows = betSlipTable.rows;
	
	for(var i = 1; i < betRows.length; i++) {
		var topic = betRows[i].cells[0].innerHTML;
		var price = betRows[i].cells[2].innerHTML;
		if (price != "Suspended") {
			messageBody = messageBody + topic + ": " + price + "\n";
			completeBetSlip = true;
		}
	}
	var stake = parseFloat(checkForPoundSign(document.getElementById('accumulatoramount').value));
	if ((document.getElementById('accumulator').checked) && (stake > 0)) {
		accumulator = document.getElementById('accumulatoramount').value;
	}
	if (completeBetSlip) {
		totalWin = document.getElementById('estimatedwin').value;
	}
	var i = betRows.length;
	while (--i) {
    	betRows[i].parentNode.removeChild(betRows[i]);
    }
    betSlipIndexes.splice(0, betSlipIndexes.length)
    calculateTotalWinEstimate();
    document.getElementById('accumulator').checked = false;
    document.getElementById('accumulatoramount').value = '£0.00';
	document.getElementById('accumulatoramount').disabled = true;
	document.getElementById('estimatedwin').value = '£0.00';
	commitBetSlip(messageBody, accumulator, totalWin);
}

function commitBetSlip(messageBody, accumulator, totalWin) {
	var dest = createDestination("/topic/commitbet", session);
    var producer = session.createProducer(dest);
    var mapMessage = session.createMapMessage();
    mapMessage.setString("Topic", "commitbet");
    mapMessage.setString("Value", messageBody);
    mapMessage.setString("ClientId", clientId);
    mapMessage.setString("Accumulator", accumulator);
    mapMessage.setString("TotalWin", totalWin);
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

function checkForPoundSign(value) {
	if (value.substring(0, 1) == '£') { 
  		value = value.substring(1);
  	}
  	return value;
}