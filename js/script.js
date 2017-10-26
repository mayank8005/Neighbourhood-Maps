$(document).ready(function () {
    
    //setting up toggle button

    // close sidebar
    $('#toggle').click(function () {

        $('#option-panel').toggle();
        $('#toggle-open-area').toggle();
        $('#map').css('left', 0);

    });

    // open sidebar
    $('#toggle-open').click(function () {

        $('#option-panel').toggle();
        $('#toggle-open-area').toggle();
        $('#map').css('left', 380);
    });

});

function initMap() {

    var map = new google.maps.Map($('#map')[0], {
        // initializing map data
        center: initialMapCenter,
        zoom: 13,
        mapTypeControl: false
    });
}