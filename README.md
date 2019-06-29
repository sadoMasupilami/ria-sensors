# RIA Sensor UI

## Overview

This application is a frontend for sensors that publish their measurements via 
MQTT messages. The main functionality is the display of sensor values in a table
and corresponding plots, that visualize the data in real-time.

**Sensor Table**

![Sensor Table](https://git-iit.fh-joanneum.at/podbrega19/ria-sensor-ui/raw/master/docs/img/ui-home-screenshot.png?inline=false "Sensor Table")

**Sensor Graph View**

![Sensor Graph View](https://git-iit.fh-joanneum.at/podbrega19/ria-sensor-ui/raw/master/docs/img/ui-live-screenshot.png?inline=false "Sensor Graph View")

**Recording View**

![Sensor Recording View](https://git-iit.fh-joanneum.at/podbrega19/ria-sensor-ui/raw/master/docs/img/ui-recordings-screenshot.png?inline=false "Sensor Recording View")

### Protocol

To run the application an MQTT Broker like RabbitMQ or Mosquitto is required.
Sensors have to publish their data to a topic `/sensors/<name of sensor>` in the
following format:

```
{
  assetName: string,
  timestamp: number,
  assetId?: string,
  warehouseId?: string,
  [values: number]: {
    key: string,
    value: number
  }
}
``` 

| Value        | Description                                                           |
| ------------ | --------------------------------------------------------------------- |
| assetName    | The name of the sensor                                                |
| timestamp    | The time of the measurement in unix epoch format in milliseconds      |
| assetId      | An additional sensor ID                                               |
| warehouseId  | The location ID of the sensor                                         |
| values       | The actual measurements by type (A sensor can have multiple readouts) |
| values.key   | The key of the sensor readout                                         |
| values.value | The numerical value of the sensor readout                             |

## Architecture

The application is built with Angular 8. Application state is managed using the Redux Pattern.
That means that all application state is held in a central store. State manipulation happens
via action that are dispatch to the store and handled by a reducer function that creates a new
version of the application state. The state itself is immutable.

The major benefits of this model are the increased decoupling of the application from the
presentation logic and the increased testability. A reducer is a pure function and can therefore
be tested in complete isolation.

The communication with the sensor backend happens via Websockets using the MQTT protocol. Any
changes in measurements are pushed to the UI in real-time.

For the visual design of the application *Material Design* was used as a CSS framework. 

## Installation

### Docker setup

The repository contains a docker-compose configuration that includes the app and a RabbitMQ broker.
To build and start the app with a complete setup run the following command in the project root 
folder:

```
docker-compose build
docker-compose up

```

This builds the docker image and starts the containers. 

*WARNING: The first docker build may take a significant amount of time since the angular app is 
build in 'prod' mode. Think first make run of a huge C++ project in the late 90s.*

To stop the containers run the following command again in the project root folder:
```
docker-compose down

```

To start a test sensor run `npm run sensor <n>` where `<n>` is an integer. 

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically 
reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use 
the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

