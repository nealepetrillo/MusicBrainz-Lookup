<?php
// Suppress warnings and notices
error_reporting(1);

// Handle non-ASCII characters in band/album names
header('Content-type: text/html; charset=UTF-8') ;

// Set up a simple debug method.
if (isset($_GET['debug'])) {
    define('DEBUG', true);
} else {
    define('DEBUG', false);
}

// Run through our potential GET queries
if ($_GET['artistName']) {
    if (DEBUG) echo "<pre>";
    processArtistName(urlencode($_GET['artistName']));
    if (DEBUG) echo "</pre>";
} else if ($_GET['artistID']) {
    if (DEBUG) echo "<pre>";
    processReleases(urlencode($_GET['artistID']));
    if (DEBUG) echo "</pre>";
} else if ($_GET['releaseID']) {
    if (DEBUG) echo "<pre>";
    processTracks(urlencode($_GET['releaseID']));
    if (DEBUG) echo "</pre>";
}

// Display debug message
// Prints the debug message if the get debug parameter is set. 
function debug($msg) {
    if (DEBUG) {
        print "<pre>$msg</pre>";
    }
}

// Process artist name
// Process a request for artist name.
function processArtistName($artistName) {
    debug("getting artist information...");
    
	// Query for the artist name
    $xml = simplexml_load_file("http://musicbrainz.org/ws/1/artist/?type=xml&limit=5&name={$artistName}&inc=sa-Official");
	
    if (!$xml) {
        echo "none";
        return;
    }

    // Start going through the XML tree with the MusicBrainz namespace
    $xml->registerXPathNamespace('mb', 'http://musicbrainz.org/ns/mmd-1.0#');

    // Run an xpath query for the list of returned artists
    $artistArray = $xml->xpath("mb:artist-list/mb:artist");
    if (!$artistArray) {
        echo "none";
        return;
    }

    $outputArray = array();
    
	foreach($artistArray as $artist) {
        $artist->registerXPathNamespace('mb', 'http://musicbrainz.org/ns/mmd-1.0#');
        // For each artist returned, look for their sort-name
        $name = $artist->xpath("mb:sort-name");
        $name = (string) $name[0];

        // See if there is a disambiguation node...
        $disambiguation = $artist->xpath("mb:disambiguation");
        if ($disambiguation) {
            // If so, save it
            $disambiguation = (string) $disambiguation[0];
        } else {
            // Otherwise, return an empty string
            $disambiguation = "";
        }

        // Get the MusicBrainz ID of the artist
        $id = $artist->xpath("@id");
        $id = (string) $id[0];

        // And finally join all of the info for the artist
        $outputArray[] = join(array($id, $name, $disambiguation), "\t");
    }

    // And return everything in a nicely fomatted table    
    echo join($outputArray, "\n");
}

// Process release date
// Process a request for release information.
function processReleases($artistID) {
    debug("getting artist releases...");
	
    // Look for releases by this artist, only official ones
    $xml = simplexml_load_file("http://musicbrainz.org/ws/1/artist/{$artistID}?type=xml&limit=10&inc=sa-Official+discs+artist-rels");
	
    if (!$xml) {
        echo "problem connecting to music brainz server...";
        return;
    }
    $xml->registerXPathNamespace('mb', 'http://musicbrainz.org/ns/mmd-1.0#');

    // Find all of the releases    
    $releasesArray = $xml->xpath("//mb:release-list/mb:release");
    if (!$releasesArray) {
        echo "none";
        return;
    }

    $outputArray = array();
	
    foreach($releasesArray as $release) {
        $release->registerXPathNamespace('mb', 'http://musicbrainz.org/ns/mmd-1.0#');
        // Search for the title of the release
        $name = $release->xpath("mb:title");
        $name = (string) $name[0];

        // Get the release's ID
        $id = $release->xpath("@id");
        $id = (string) $id[0];

        // And join everything together
        $outputArray[] = join(array($id, $name), "\t");
    }

    echo join($outputArray, "\n");
}

// Process track request
// Process a request for artist track information 
function processTracks($releaseID) {
    debug("getting release tracks...");

    // Find all of the tracks for the given release
    $xml = simplexml_load_file("http://musicbrainz.org/ws/1/release/{$releaseID}?type=xml&inc=tracks");
    if (!$xml) {
        echo "problem connecting to music brainz server...";
        return;
    }
    $xml->registerXPathNamespace('mb', 'http://musicbrainz.org/ns/mmd-1.0#');
    
    // Now, go through the release and capture all of our tracks
    $outputAray = array();
    $tracksArray = $xml->xpath("//mb:track-list/mb:track");
    if (!$tracksArray) {
        echo "none";
        return;
    }

    foreach($tracksArray as $trackInfo) {
        $trackInfo->registerXPathNamespace('mb', 'http://musicbrainz.org/ns/mmd-1.0#');
        // Save the track title...
        $name = $trackInfo->xpath("mb:title");
        $name = (string) $name[0];

        // And the track ID
        $id = $trackInfo->xpath("@id");
        $id = (string) $id[0];

        // Join it all together
        $outputArray[] = join(array($id, $name), "\t");

    }

    // And return the array
    echo join($outputArray, "\n");
}
?>
