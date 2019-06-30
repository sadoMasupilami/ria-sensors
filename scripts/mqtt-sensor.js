"use strict";
exports.__esModule = true;
var mqtt = require("mqtt");
var _ = require("lodash");
var moment = require("moment");


var sensorNumber = process.argv[2] || '1';

var host = process.argv[3] || 'localhost:1883';

var sensorName = "sensor-" + sensorNumber;
console.log("Start Sensor " + sensorName);
var topicName = "/sensors/" + sensorName;
var intervalHandle;
var options = {
    clientId: sensorName
};
var client = mqtt.connect('mqtt://' + host, options);
client.on('connect', function () {
    //
    intervalHandle = setInterval(function () {
        client.publish(topicName, JSON.stringify(createFakeSensorEvent()));
    }, 1000);
});
process.on('SIGTERM', function () {
    console.info('SIGTERM signal received.');
    clearInterval(intervalHandle);
    client.end();
});
var value;
var createFakeSensorEvent = function () {
    var currentValue = value || _.random(0, 27);
    value = currentValue + _.random(-0.01, 0.01);
    return {
        assetName: sensorName,
        assetId: "" + sensorNumber,
        warehouseId: "w-" + sensorNumber,
        timestamp: moment().valueOf(),
        values: [
            {
                key: 'temp',
                type: 'DOUBLE',
                value: value
            },
        ]
    };
};
