const express = require('express');
const app  = express();
const http = require('http').Server(app);
const io   = require('socket.io')(http);

const dataManager = require("./data_manager")
require("./static_routes")(app)

// Variables
const port = 3000;

// Change temperature loop (Mock)
sockets = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function changeTemperature() {

    while (true) {

        var trucks = dataManager.listTrucks();
        var truck = trucks[Math.floor(Math.random() * trucks.length)];
        var temperature = dataManager.getTruckTemp(truck) +  Math.floor(Math.random() * 5) - 2;

        if (temperature < -10) temperature = -10;
        if (temperature > 10) temperature = 10;

        dataManager.setTruckTemp(truck, temperature);
        dataManager.checkAlerts(sockets);

        sockets.forEach((socket) => {
            socket.emit('temperatureChange', { truck : truck, temperature : temperature });
        });

        await sleep(2000);

    }
}

// Initialize socket.io
io.on('connection', function(socket){

    sockets.push(socket);

    socket.on('load', () => {
        dataManager.listItems().forEach((val) => {
            socket.emit('itemAdd', val);
        });
    });

    socket.on('temperature-req', (beerType) => {

        var beer = dataManager.getBeer(beerType);
        socket.emit('temperature-resp', beer);

    });

    socket.on('disconnect', () => {
        sockets = sockets.filter(el => el !== socket);
    });

});

// Load the pages
app.get('/add_delivery/send', (req, res) => {

    dataManager.addItem(req.query);
    io.emit('itemAdd', req.query);
    res.redirect("/");

});

http.listen(port, () => { console.log("Pragma Brewery running on port 3000"); });
changeTemperature();