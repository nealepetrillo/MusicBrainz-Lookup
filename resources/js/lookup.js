/**
 * Javascript functions to interact with muicBrainzQuery.php in an asynchronous manner.
 *
 * @author Neale Petrillo
 * @version 2.0.0
 */

/** Initialize Global Variables **/
var request; 		//The XMLHTTP request
var artistNode; 	//The list of currently returned artists
var releaseNode; 	//The list of a selected artists releases

/** Run Initialization Function **/
window.onload = initialize;

/**
 * Function called on page load to initialize variables.
 *
 * @version 1.0.0
 */
function initialize() {

	//initialize the XMLHTTP request
   request = null;
   createRequest();
   
   //find the result node
   artistNode = document.getElementById("artistResultsTable");

   //bind search function to button
   var searchButton=document.getElementById("searchButton");
   searchButton.onclick = artistLookup('artistName', 0);
}

/**
 * Function for sending request for getting artist data
 *
 * @version 1.0.0
 */
function artistLookup() {

	var url = "musicBrainzQuery.php?";
	var qury = null; 
	
	//select the serach box
	var searchNode = document.getElementById("artistName");
	
	//build the query
	if(requestType == "artistName") {
		qury = "artistName=" + escape(searchNode.value);
	}
	else if(requestType == "artistID") {
		qury = "artistID=" + id;
	} 
	else {
		qury =  "releaseID=" +id; 
	}
	
	request.open("GET", url + qury,true);
	request.onreadystatechange = function(){
			processArtists(requestType, id); 
		}
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
function processArtists(requstType, id) {
    
	var messageNode = document.getElementById("messageText");
	var returnText = new Array();
	
	//If the requst has finished process data
	if(request.readyState == 4) {
		
		//If there are restults
		if(request.returnText != 'none'){
			
			//Get rid of searching message
			messageNode.style.display ='none';
			
			//Put return text into two dimensional array
			returnText = request.responseText.split("\n");
			for(i=0; i<returnText.length; i++) {
				returnText[i] = returnText[i].split("\t");
			}
		
			//If we're processing an Artist List
			if(requstType == "artistName") {
				//remove results table
				var rows = artistNode.rows;
				while(rows.length) // length=0 -> stop 
       				 artistNode.deleteRow(rows.length-1);
				
				//add current results
				for(i=0; i<returnText.length; i++){
					var x = artistNode.insertRow(i);
					
					for(j=0; j<returnText[i].length; j++){
						var y = x.insertCell(j);
						y.innerHTML = returnText[i][j];
					}
				} 
			}
			else if(requestType == "artistID"){
				
			}
			else if(requestType == "releaseID"){
				
			}
		
		}
		//If there are no results
		else {
			//Setup message node
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
