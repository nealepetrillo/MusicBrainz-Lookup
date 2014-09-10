/**
 * Javascript functions to interact with muicBrainzQuery.php in an asynchronous manner. 
 *
 * @author Neale Petrillo
 * @version 1.0.0
 */
window.onload = initialize;

/** Initialize Global Variables **/
var request; 		//The XMLHTTP request
var artistNode; 	//The list of currently returned artists


/**
 * Function called on page load to initialize variables.
 *
 * @version 1.0.0
 */
function initialize() {

   request = null;
   createRequest();
   
   artistNode = document.getElementById("artistResultsTable");

}

/**
 * Function for sending request for getting artist data
 *
 * @version 1.0.0
 */
function artistLookup() {

	//Initialize query parameters
	var url = "musicBrainzQuery.php?";
	var qury = null; 
	
	//Locate the search box
	var searchNode = document.getElementById("artistName");
	qury = "artistName=" + escape(searchNode.value);

	//Send query
	request.open("GET", url + qury,true);
	request.onreadystatechange = processArtists();
	request.send(null); 
}

/**
 * Function for sending request for CD information
 *
 * @version 1.0.0
 */
function albumLookup(artistID) {

	//Initialize query parameters
	var url = "musicBrainzQuery.php?artistID=" + artistID;
	
	//Build GET request
	request.open("GET", url,true);
	request.onreadystatechange = function(){
			addCDInfo(artistID);
		}
		
	//Send request
	request.send(null); 
}

/**
 * Function for sending request for release information
 *
 * @version 1.0.0
 */
function requestLookup(releaseID){

	//Initialize query parameters
	var url = "musicBrainzQuery.php?releaseID=" + releaseID;
	
	//Build get request
	request.open("GET", url,true);
	request.onreadystatechange = function(){
			addReleaseInfo(releaseID);
		}
		
	//Send request
	request.send(null); 
}

/**
 * Function to process returned artist information
 *
 * @version 1.0.0
 */
function processArtists() {
    
	//Set status message
	var messageNode = document.getElementById("messageText");
	var returnText = new Array();
	
	//If the request has finished, process data
	if(request.readyState == 4) {
		
		//If there are results
		if(request.returnText != 'none'){
			
			//Get rid of searching message
			messageNode.style.display ='none';
			
			//Put return text into two dimensional array
			returnText = request.responseText.split("\n");
			for(i=0; i<returnText.length; i++) {
				returnText[i] = returnText[i].split("\t");
			}
				//Remove results table
				var rows = artistNode.rows;
				while(rows.length) // length=0 -> stop 
       				 artistNode.deleteRow(rows.length-1);
				
				//Add current results
				for(i=0; i<returnText.length; i++){
					var x = artistNode.insertRow(i);
					x.id=returnText[i][0];
					var y = x.insertCell(0);
					y.innerHTML = "<a href =\"\" onclick=\"albumLookup(\'" + returnText[i][0] + "\');>" + returnText[i][1] + "</a>";
					y = x.insertCell(1);
					y.innerHTML = returnText[i][2]
				} 
		
		}
		//If there are no results
		else {
			//Set status message 
			messageNode.style.display = 'block';
			messageNode.innerHTML = "No Results Found";
			
		}
		
	}
	//If the request hasn't finished then display the searching message
	else {
		messageNode.style.display = 'block';
		messageNode.innerHTML = "Searching...";
	}
}

/**
 * Function to process returned CD information
 *
 * @version 1.0.0
 */
function addCDInfo(artistID) {
	
	//Set status message
	var messageNode = document.getElementById("messageText");
	var returnText = new Array();
	
	//If the request has finished process data
	if(request.readyState == 4) {
		
		//If there are results
		if(request.returnText != 'none'){
			
			//Get rid of searching message
			messageNode.style.display ='none';
			
			//Put return text into two dimensional array
			returnText = request.responseText.split("\n");
			for(i=0; i<returnText.length; i++) {
				returnText[i] = returnText[i].split("\t");
			}
				
			//Add current results
			var parentRow = document.getElementById(artistID);
			for(i=0; i<returnText.length; i++){
					var x = artistNode.insertRow(parentRow.rowIndex + i + 1);
					x.id=returnText[i][0];
					var y = x.insertCell(0);
					y.innerHTML = "<a href =\"\" onclick=\"addReleaseInfo(\'" + returnText[i][0] + "\');>" + returnText[i][1] + "</a>";
					y = x.insertCell(1);
					y.innerHTML = returnText[i][2]
			} 
		
		}
		//If there are no results
		else {
			//Set status message
			messageNode.style.display = 'block';
			messageNode.innerHTML = "No Results Found";
			
		}
		
	}
	//If the request hasn't finished then display the searching message
	else {
		messageNode.style.display = 'block';
		messageNode.innerHTML = "Searching...";
	}
	
}

/**
 * Function for processing returned release information
 *
 * @version 1.0.0
 */
function addReleaseInfo(releaseID) {

	//Set status message
	var messageNode = document.getElementById("messageText");
	var returnText = new Array();
	
	//If the request has finished process data
	if(request.readyState == 4) {
		
		//If there are results
		if(request.returnText != 'none'){
			
			//Get rid of searching message
			messageNode.style.display ='none';
			
			//Put return text into two dimensional array
			returnText = request.responseText.split("\n");
			for(i=0; i<returnText.length; i++) {
				returnText[i] = returnText[i].split("\t");
			}
				
			//Add current results
			var parentRow = document.getElementById(releaseID);
			for(i=0; i<returnText.length; i++){
					var x = artistNode.insertRow(parentRow.rowIndex + i + 1);
					x.id=returnText[i][0];
					var y = x.insertCell(0);
					y.innerHTML = returnText[i][1] ;
					y = x.insertCell(1);
					y.innerHTML = returnText[i][2]
			} 
		
		}
		//If there are no results
		else {
			//Set status message
			messageNode.style.display = 'block';
			messageNode.innerHTML = "No Results Found";
			
		}
		
	}
	//If the request hasn't finished then display the seraching message
	else {
		messageNode.style.display = 'block';
		messageNode.innerHTML = "Searching...";
	}
}
/**
 * Function to create an AJAX call. Modelled from "Head Rush AJAX" by Brett McLaughlin.
 *
 * @version 1.0.0
 */
function createRequest() {
	try {
		request = new XMLHttpRequest();
	} catch (trymicrosoft) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (othermicrosoft) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				request = null;
			}
		}
	}
	
	if (request == null) {
		alert("Error creating request object!");
	}

}

// Empty function for no results
function doNothing() {return false;}
