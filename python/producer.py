#!/usr/bin/env python3
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('nas.mklug.at'))
channel = connection.channel()

for i in range(1, 10):
    channel.basic_publish(exchange='amq.topic',
                          routing_key='hello',
                          body='Message {}'.format(i))
connection.close()
