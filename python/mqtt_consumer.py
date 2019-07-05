import paho.mqtt.client as mqtt
import time


def on_message(client, userdata, message):
  print("message received ", str(message.payload.decode("utf-8")))
  print("message topic=", message.topic)
  # print("message qos=", message.qos)
  # print("message retain flag=", message.retain)


########################################
broker_address = "192.168.43.242"
print("creating new instance")
client = mqtt.Client("Otto")  # create new instance
client.on_message = on_message  # attach function to callback
print("connecting to broker")
client.connect(broker_address, 9803)  # connect to broker
client.loop_start()  # start the loop
print("Subscribing to topic", "#")
client.subscribe("#")
time.sleep(100)  # wait
client.loop_stop()  # stop the loop
