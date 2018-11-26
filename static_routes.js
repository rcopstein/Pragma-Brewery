const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const express = require('express');
const path = require('path');
const fs = require('fs');

const dataManager = require("./data_manager")

module.exports = (app) => {

    // Add BodyParser
    app.use(bodyParser.urlencoded({ extended: true }));

    // Serve public files
    app.use('/static', express.static(path.join(__dirname, 'public')))

    // Get main page
    app.get('/', (req, res) => {

        fs.readFile(__dirname + "/public/index.html", (err, content) => {

            var template = handlebars.compile(content.toString());
            var items = dataManager.listItems();
            res.send(template(items));

        });
    
    });
    
    // Get add delivery page
    app.get('/add_delivery', (req, res) => {

        fs.readFile(__dirname + "/public/add_delivery.html", (err, content) => {

            var template = handlebars.compile(content.toString());

            var drivers = dataManager.listDrivers();
            var trucks = dataManager.listTrucks();
            var beers = dataManager.listBeers();

            var items = { trucks : trucks, beers : beers, drivers : drivers };
            res.send(template(items));

        });
    
    });

}