var map;

$(document).ready(function () {

    //setting up toggle button

    // close sidebar
    $('#toggle').click(function () {

        $('#when-open').hide();
        $('#toggle-open-area').show();
        $('#option-panel').css('width','25px');
        $('#map').css('left', 57);
        $('#map').css('width', 'calc(100% - 57px)');
        console.log('close sidebar');
        if($(window).width() <= 500){
            $('#map').show();
            console.log('close sidebar<500');
        }
        console.log('resize');
        resizeMap();
    });


    // open sidebar
    $('#toggle-open').click(function () {

        $('#option-panel').css('width','340px');
        $('#when-open').show();
        console.log('open sidebar');
        $('#toggle-open-area').hide();
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
        else {
            $('#toggle-open').click();
            resizeMap();
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
    try{
        console.log('resize map called');
        var currCenter = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(currCenter);
        console.log('resize map completed');
    }
    catch(err){
        console.log('unable to resize map' + err);
    }
}