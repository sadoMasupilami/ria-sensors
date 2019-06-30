#!/usr/bin/env python3
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel: pika.adapters.blocking_connection.BlockingChannel = connection.channel()

# channel.exchange_declare(exchange='amq.topic')

result = channel.queue_declare(
    queue='',
    exclusive=True,
)
queue_name = result.method.queue

channel.queue_bind(
    exchange='amq.topic',
    queue=queue_name,
    routing_key='#'
)


def callback(ch, method, properties, body: bytes):
    print(method.routing_key + ' --> ' + body.decode('utf-8'))


channel.basic_consume(
    queue=queue_name,
    auto_ack=True,
    on_message_callback=callback
)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()

connection.close()
