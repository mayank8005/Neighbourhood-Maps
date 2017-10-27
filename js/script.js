var map;
var markers =[];
// check's if map init or not
var map_init = false;

$(document).ready(function () {

    // view model
    var viewModel = function(){

        var that = this;

        // obs array of all locations
        this.locations = ko.observableArray(initialLocation);

        // stores text enter in filter text box
        this.filter = ko.observable();


        //this filters location as per input given by user and hide/show location list and markers
        this.filter.subscribe(function (filterText) {
            if(!filterText){
                showMarkersbyLocations(initialLocation);
                adjustBounds();
                that.locations(initialLocation);
                return;
            }
            hideAllMarkers();

            var filteredLocations = ko.utils.arrayFilter(initialLocation, function (item) {
                var itemToCheck = String(item.title.toLowerCase());
                return itemToCheck.startsWith(filterText.toLowerCase());
            });

            showMarkersbyLocations(filteredLocations);
            adjustBounds();
            that.locations(filteredLocations);
        });


        // closes sidebar
        this.closeSidebar = function() {
            $('#when-open').hide();
            $('#toggle-open-area').show();
            $('#option-panel').css('width','25px');
            $('#map').css('left', 57);
            $('#map').css('width', 'calc(100% - 57px)');
            if($(window).width() <= 500){
                $('#map').show();
            }
            resizeMap();
        };



        //open sidebar
        this.openSidebar = function () {
                $('#option-panel').css('width','340px');
                $('#when-open').show();
                $('#toggle-open-area').hide();
                $('#map').css('left', 380);
                $('#map').css('width', 'calc(100% - 380px)');
                if($(window).width() <= 500){
                    $('#map').hide();
                }
                resizeMap();
        };

        //function which act when item in list is mouse hovered
        this.listMouseHover = function (location) {
            if(!map_init)
                return;
            var marker = getMarkerByLocation(location).marker;
            // green color icon
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            marker.setAnimation(google.maps.Animation.BOUNCE);

        };

        // function to handle when mouse leaves list item
        this.listMouseNotHover =function (location) {
            if(!map_init)
                return;
            var marker = getMarkerByLocation(location).marker;
            // red color icon
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
            marker.setAnimation(null);
        };

        // trigger when location list item is clicked
        this.listItemClicked = function (location) {
            if(!map_init)
                return;
            marker = getMarkerByLocation(location);
            new  google.maps.event.trigger(marker, 'click');
        };
    };

    // binding view Model and view
    ko.applyBindings(new viewModel());

    // event listener for window size change
    $(window).on('resize', function(){
        if($(window).width() > 500){
            $('#map').show();
        }
        else {
            $('#toggle-open').click();
            resizeMap();
        }
    });

});

// init google maps
function initMap() {

    var infoWindow = new google.maps.InfoWindow();
    map = new google.maps.Map($('#map')[0], {
        // initializing map data
        center: initialMapCenter,
        zoom: 13,
        mapTypeControl: false
    });

    //  loading all markers
    for(var i=0;i<initialLocation.length;i++){

        // location to be loaded
        var locationToLoad = initialLocation[i];

        var marker = new google.maps.Marker({
            position: locationToLoad.location,
            map: map,
            title: locationToLoad.title,
            animation: google.maps.Animation.DROP
        });

        // pushing marker to markers array
        markers.push({marker: marker, id: locationToLoad.id});

        marker.addListener('click', function (marker) {
            return function () {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    marker.setAnimation(null);
                }, 1500);
                populateInfoWindow(marker, infoWindow);
            }
        }(marker));

    }

    // populate info window with content
    function populateInfoWindow(marker, info) {
        if(info.marker!=marker){
            info.marker = marker;
            info.setContent(getInfoContent(marker.title));
            info.open(map, marker);
            getWikiLinks(marker.title);

            info.addListener('closeclick', function () {
                info.setMap(null);
            });
        }
    }

    //adjust map
    adjustBounds();

    // setting event listener for resizing map
    $(window).on('resize', function () {
        resizeMap();
    });

    map_init = true;


}

// function which resize maps
function resizeMap(){
    try{
        var currCenter = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(currCenter);
    }
    catch(err){
        console.log('unable to resize map' + err);
    }
}

// adjust map bounds acc to markers
function adjustBounds(){

    var bounds =new  google.maps.LatLngBounds();
    for(var i=0;i<markers.length;i++){
        bounds.extend(markers[i].marker.position);
    }
    map.fitBounds(bounds);
}

//returns marker using location
function getMarkerByLocation(location){

    return markers.find(function (marker) {
       return marker.id == location.id;
    });
}

//hide all the markers on the map
function hideAllMarkers(){
    for(var i=0;i<markers.length;i++){
        var marker = markers[i].marker;
        marker.setMap(null);
    }
}

// show markers on the map as per the locations array given as a parameter
function showMarkersbyLocations(locations) {
    if(!map_init)
        return;
    for(var i=0;i<locations.length;i++){
        var marker =getMarkerByLocation(locations[i]).marker;
        marker.setMap(map);
    }
}

// gives default content of info Window
function getInfoContent(title){
    // adding title to content
    var content = "<h1 id='map-marker-title'>" + title + "</h1>";

    //adding wikipedia link area to content
    content += '<div id="map-marker-wiki"><h2>relevant Wikipedia links </h2>' +
        '<ul id="map-marker-wiki-list">loading</ul></div>';

    return content;
}


// gives top 3 wikipedia links
function getWikiLinks(search) {

    var $wikiElem = $('#map-marker-wiki-list');

    var wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search='+search;

    // for handling error
    var wikiTimeout = setTimeout(function () {
        $wikiElem.text('Failed to load wiki resources');
    },8000);

    $.ajax({
        url: wikiURL,
        dataType: 'jsonp',
        success: function (data) {

            $wikiElem.text('');
            var wikiArticleList = data[1];
            if(wikiArticleList.length==0){
                $wikiElem.text('no article found')
            }
            for(var i=0;i<wikiArticleList.length&&i<3;i++){
                var articleURL = 'https://en.wikipedia.org/wiki/' + wikiArticleList[i];
                $wikiElem.append(`<li><a href="${articleURL}">${wikiArticleList[i]}</a></li>`);
            }
            // clearing error timeout as no error detected
            clearTimeout(wikiTimeout);
        }
    });
}
