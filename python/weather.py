import configparser
import requests
import json
import pika
import time

host = 'rabbitmq'

def get_current_milli_time():
    return int(round(time.time() * 1000))


def get_api_key():
    config = configparser.ConfigParser()
    config.read('config.ini')
    return config['openweathermap']['apiKey']


def get_weather_by_city(api_key, city):
    url = "https://api.openweathermap.org/data/2.5/weather?q={}&units=metric&appid={}".format(city, api_key)
    r = requests.get(url)
    return r.json()


def parse_weather_data(data):
    temp: float = data['main']['temp']
    pressure: int = data['main']['pressure']
    humidity: int = data['main']['humidity']
    wind: int = data['wind']['speed']
    clouds: int = data['clouds']['all']
    return {
        'temp': temp,
        'pressure': pressure,
        'humidity': humidity,
        'wind': wind,
        'clouds': clouds
    }


def build_json(weatherData, measurement, aID):
    return {
        'assetName': 'owm-' + measurement,
        'assetId': str(aID),
        'warehouseId': 'owm',
        'timestamp': get_current_milli_time(),
        'values': [{
            'key': measurement,
            'type': 'DOUBLE',
            'value': weatherData[measurement]
        }]
    }


def send_data():
    city: str = "Kapfenberg"

    connection = pika.BlockingConnection(pika.ConnectionParameters(host))
    channel = connection.channel()

    while True:
        print('re-read data')
        api_key = get_api_key()
        weather = parse_weather_data(get_weather_by_city(api_key, city))
        for i in range(1, 20):
            channel.basic_publish(exchange='amq.topic',
                                  routing_key='.sensors.sensor-901',
                                  body=json.dumps(build_json(weather, 'temp', 901), separators=(',', ':')))
            time.sleep(0.2)
            channel.basic_publish(exchange='amq.topic',
                                  routing_key='.sensors.sensor-902',
                                  body=json.dumps(build_json(weather, 'pressure', 902), separators=(',', ':')))
            time.sleep(0.2)
            channel.basic_publish(exchange='amq.topic',
                                  routing_key='.sensors.sensor-903',
                                  body=json.dumps(build_json(weather, 'humidity', 903), separators=(',', ':')))
            time.sleep(0.2)
            channel.basic_publish(exchange='amq.topic',
                                  routing_key='.sensors.sensor-904',
                                  body=json.dumps(build_json(weather, 'wind', 904), separators=(',', ':')))
            time.sleep(0.2)
            channel.basic_publish(exchange='amq.topic',
                                  routing_key='.sensors.sensor-905',
                                  body=json.dumps(build_json(weather, 'clouds', 905), separators=(',', ':')))
            time.sleep(1.2)


def main():
    time.sleep(15)
    try:
        send_data()
    except:
        print('closig due to error')
        time.sleep(1)
        print('reconnect to server...')
        send_data()


if __name__ == '__main__':
    main()
