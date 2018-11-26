// Variables
var itemsByTruck = {}
var itemsById = {}

// Functions
function buildGridItem(item) {

    var _item = "<div class=\"col-12 col-md-6 col-lg-4\">" +
                    "<div class=\"card\">" +
                        "<span class=\"overline\">Delivery #" + item.id + "</span>" +
                        "<span class=\"caption\">" + item.driver + " on " + item.truck + "</span>" +
                        "<span class=\"overline accent\">" + item.from + " → " + item.to + "</span>" +
                        "<h4>" + item.temperature + "°</h4>" +
                        "<span class=\"caption\">Min: " + item.min + " / Max: " + item.max + "</span>" +
                        "<div class=\"beer-type\">" +
                            "<i class=\"fas fa-beer\"></i>" +
                            "<span class=\"caption\"> " + item.beerType + "</span>" +
                        "</div>" +
                    "</div>" +
                "</div>"

    var component = jQuery.parseHTML(_item)[0];

    // Register it by Truck
    if (!(item.truck in itemsByTruck)) itemsByTruck[item.truck] = [];
    itemsByTruck[item.truck].push(component);

    // Register it by Id
    itemsById[item.id] = component;

    // Check alert
    if (item.alert) addAlert(item.id, false);

    return component;

}

// Main
var socket = io();

socket.on('itemAdd', function(msg){

    $('.empty').css('display', 'none');

    var component = buildGridItem(msg);
    $('#dynamic_information').prepend( component );

});

socket.on('temperatureChange', (details) => {

    var toChange = itemsByTruck[details.truck];
    if (!toChange) return;

    toChange.forEach((val) => { $(val).find('h4').text(details.temperature + '°'); });

});

function showNotification(id) {

    var notification = new Notification("Delivery #" + id + " is out of temperature!");

}
function addAlert(id, notify = true) {

    var item = itemsById[id];
    $(item).find('h4').css('color', 'red');

    if (notify) {

        if (!("Notification" in window)) return;
        
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") showNotification(id);
        
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") showNotification(id);
            });
        }
    }

}
function remAlert(id) {

    var item = itemsById[id];
    $(item).find('h4').css('color', 'black');

}

socket.on('on-alert', addAlert);
socket.on('off-alert', remAlert);

socket.emit('load');