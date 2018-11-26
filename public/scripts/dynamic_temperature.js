var socket = io();
var beer_selection = $('#beerType');
var beer_details = $('#beer-details');

socket.on("temperature-resp", (val) => {
    if (val.beerType == beer_selection.value) {
        beer_details.text("This beer must be transported between " + val.min + "° and " + val.max + "°.");
    }
});

function loadBeerDetails() {

    beer_details.text(" ");
    socket.emit("temperature-req", beer_selection.val());

}
beer_selection.change(loadBeerDetails);

loadBeerDetails();