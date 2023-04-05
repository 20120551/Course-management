const amqplib = require('amqplib');

async function connectRabbitMQ() {
    try {   
        const conn = await amqplib.connect('amqp://localhost');
        console.log('connect to rabbitMQ server successfully!');
        return conn;
    } catch(err) {
        console.log('err when connect to rabbit MQ!');
    }
}

module.exports = connectRabbitMQ;
