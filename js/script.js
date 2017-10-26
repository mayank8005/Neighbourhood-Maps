$(document).ready(function () {
    
    //setting up toggle button

    // close sidebar
    $('#toggle').click(function () {

        $('#option-panel').toggle();
        $('#toggle-open-area').toggle();

    });

    // open sidebar
    $('#toggle-open').click(function () {

        $('#option-panel').toggle();
        $('#toggle-open-area').toggle();

    });

});