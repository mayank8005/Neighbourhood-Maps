var map;

$(document).ready(function () {
    
    //setting up toggle button

    // close sidebar
    $('#toggle').click(function () {

        $('#option-panel').toggle();
        $('#toggle-open-area').toggle();
        $('#map').css('left', 0);
        $('#map').css('width', '100%');
        if($(window).width() <= 500){
            $('#map').show();
        }
        resizeMap();
    });


    // open sidebar
    $('#toggle-open').click(function () {

        $('#option-panel').toggle();
        $('#toggle-open-area').toggle();
        $('#map').css('left', 380);
        $('#map').css('width', 'calc(100% - 380px)');
        if($(window).width() <= 500){
            $('#map').hide();
        }
        resizeMap();
    });

    $(window).on('resize', function(){
        if($(window).width() > 500){
            $('#map').show();
        }
    });

});

function initMap() {

    map = new google.maps.Map($('#map')[0], {
        // initializing map data
        center: initialMapCenter,
        zoom: 13,
        mapTypeControl: false
    });

    // setting event listener for resizing map
    $(window).on('resize', function () {
        resizeMap();
    });


}

// function which resize maps
function resizeMap(){
    try{var currCenter = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(currCenter);
    }
    catch(err){
        console.log('unable to resize map' + err);
    }
}