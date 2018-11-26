lastDelivery = 0
deliveries = {}
truckTemps = {}
drivers = []
beers = {}

// Beers
function getBeer(name) {

    return beers[name];

}
function addBeer(beer) {

    beers[beer.name] = beer;

}
function listBeers() {

    var result = []
    for (var key in beers) result.push(key);
    return result;

}

module.exports.getBeer = getBeer;
module.exports.listBeers = listBeers;

// Deliveries
function addItem(item) {

    item.id = ++lastDelivery;
    item.min = getBeer(item.beerType).min;
    item.max = getBeer(item.beerType).max;
    item.temperature = truckTemps[item.truck];

    deliveries[item.id] = item;

}
function getItem(id) {

    return deliveries[id];

}
function listItems() {

    var result = []
    for (var key in deliveries) result.push(deliveries[key]);
    // result.reverse();
    return result;

}
function checkAlerts(sockets) {

    for (var key in deliveries) {

        var item = deliveries[key];
        var beer = getBeer(item.beerType);

        if (item.temperature < beer.min || item.temperature > beer.max) { 
            if (!item.alert) {
                item.alert = true; 
                sockets.forEach((s) => s.emit('on-alert', item.id) );
            }
        }
        else { 
            if (item.alert) {
                item.alert = false; 
                sockets.forEach((s) => s.emit('off-alert', item.id) );
            }
        }
    }

}

module.exports.addItem = addItem;
module.exports.getItem = getItem;
module.exports.listItems = listItems;
module.exports.checkAlerts = checkAlerts;

// Trucks
function getTruckTemp(truck) {

    return truckTemps[truck];

}
function setTruckTemp(truck, temp) {

    truckTemps[truck] = temp;

    for (var key in deliveries) {

        var item = deliveries[key];
        if (item.truck != truck) continue;
        item.temperature = temp;

    }

}
function listTrucks() {

    var result = []
    for (var key in truckTemps) result.push(key);
    return result;

}
function addTruck(truck) {

    truckTemps[truck] = 0;

}

module.exports.getTruckTemp = getTruckTemp;
module.exports.setTruckTemp = setTruckTemp;
module.exports.listTrucks = listTrucks;

// Drivers
function addDriver(driver) {

    drivers.push(driver);

}
function listDrivers() {

    return drivers;

}

module.exports.listDrivers = listDrivers;

// Main
addBeer({ name : "Beer 1 (Pilsner)",    min : -4, max : 6 });
addBeer({ name : "Beer 2 (IPA)",        min : -5, max : 6 });
addBeer({ name : "Beer 3 (Lager)",      min : -4, max : 7 });
addBeer({ name : "Beer 4 (Stout)",      min : -6, max : 8 });
addBeer({ name : "Beer 5 (Wheat Beer)", min : -3, max : 5 });
addBeer({ name : "Beer 6 (Pale Ale)",   min : -4, max : 6 });

addTruck("Truck 1");
addTruck("Truck 2");
addTruck("Truck 3");

addDriver("Shane");
addDriver("Dave");
addDriver("Joffrey");
addDriver("Sharon");
addDriver("Peres");

// addItem({ beerType : "Beer 1 (Pilsner)", min : -4, max : 6, temperature : 0, driver : "Shane", truck : "Truck 1", from : "Castle Hill", to : "Bankstown" });