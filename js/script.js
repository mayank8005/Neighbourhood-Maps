var map;

$(document).ready(function () {

    // view model
    var viewModel = function(){

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
    };

    // binding view Model and view
    ko.applyBindings(new viewModel());


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
        var currCenter = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(currCenter);
    }
    catch(err){
        console.log('unable to resize map' + err);
    }
}