import paho.mqtt.client as mqtt
import time
import json
import random


def get_current_milli_time():
  return int(round(time.time() * 1000))


def get_fake_measurement(measurement: float):
  return measurement - random.random() if random.random() < 0.5 else measurement + random.random()


def build_json(measurement):
  return {
    'assetName': 'please-name',
    'assetId': '999',
    'warehouseId': 'fake',
    'timestamp': get_current_milli_time(),
    'values': [{
      'key': 'temp',
      'type': 'DOUBLE',
      'value': measurement
    }]
  }


def send_data():
  measurement = 27.8
  broker_address = "192.168.43.242"
  client = mqtt.Client("Hansi")  # create new instance
  client.connect(broker_address, 9803)  # connect to broker
  while True:
    measurement = get_fake_measurement(measurement)
    print('sending')
    print(json.dumps(build_json(measurement), separators=(',', ':')))
    client.publish("/sensors/fakeSensor", json.dumps(build_json(measurement), separators=(',', ':')))  # publish
    print('sent')
    time.sleep(1)


def main():
  send_data()


if __name__ == '__main__':
  main()
