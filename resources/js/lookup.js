/**
 * Javascript functions to interact with muicBrainzQuery.php in an asynchronous manner.
 * This version of lookup utalizes JQuery to handle its AJAX calls
 *
 * @author Neale Petrillo
 * @version 2.0.0
 */

$(document).ready(function() {
	initialize();
	

/**
 * Function called on page load to initialize variables.
 *
 * @version 2.0.0
 */
function initialize() {

	//initialize the XMLHTTP request
   request = null;
 
   //bind search function to button
   $('#searchButton').click({param1: "artistName", param2: 0},artistLookup);
}

/**
 * Function for sending request for getting artist data
 *
 * @version 2.0.0
 */
function artistLookup(event) {

	var url = "musicBrainzQuery.php?";
	var qury = null; 

	//build the query
	if(event.data.param1 == "artistName") {
		qury = "artistName=" + $("#artistName").text();
	}
	else if(event.data.param1 == "artistID") {
		qury = "artistID=" + event.data.param2;
	} 
	else {
		qury =  "releaseID=" + event.data.param2; 
	}
	
	//send query
	$("#messageText").text("Searching...");
	$.ajax({	url:"musicBrainzQuery.php?" + qury, 
				success: function(result) {
					processArtists(result, event.data.param1, event.data.param2);
					},
				error: ajaxFailure
				});
				
}


/**
 * Function to process returned artist information
 *
 * @version 2.0.0
 */
function processArtists(requstData, requestType, requestId) {

	//If there are restults
	if(requestData == 'none'){
		
		//Get rid of searching message
		$("#messageText").hide()
		
		//Put return text into two dimensional array
		returnText = requestData.split("\n");
		for(i=0; i<returnText.length; i++) {
			returnText[i] = returnText[i].split("\t");
		}
	
		//If we're processing an Artist List
		if(requstType == "artistName") {
			//remove results table
			$("#artistResultsTable").empty();
			
			//add current results
			for(i=0; i<returnText.length; i++){
				$("#artistResultsTable").append("<tr>");
				
				for(j=0; j<returnText[i].length; j++){
					$("#artistResultsTable tr:last").append("<td>" + returnText[i][j] + "</td>");
				}
			} 
		}
		else if(requestType == "artistID"){
			
		}
		else if(requestType == "releaseID"){
			
		}
	
	}
	else {
		$("#messageText").text("No results found.");
	}
}

function ajaxFailure() {
	$("#messageText").text("Failed to communicate with server.");
}

});