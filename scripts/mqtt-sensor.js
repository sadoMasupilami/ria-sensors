"use strict";
exports.__esModule = true;
var mqtt = require("mqtt");
var _ = require("lodash");
var moment = require("moment");
var sensorNumber = process.argv[2] || '1';
var sensorName = "sensor-" + sensorNumber;
console.log("Start Sensor " + sensorName);
var topicName = "/sensors/" + sensorName;
var intervalHandle;
var options = {
    clientId: sensorName,
    username: 'rabbitmq',
    password: 'rabbitmq'
};
var client = mqtt.connect('mqtt://localhost:1883', options);
client.on('connect', function () {
    client.subscribe('/#', function (err) {
        if (!err) {
            client.publish(topicName, JSON.stringify(createFakeSensorEvent()));
        }
    });
    intervalHandle = setInterval(function () {
        client.publish(topicName, JSON.stringify(createFakeSensorEvent()));
    }, 10);
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
