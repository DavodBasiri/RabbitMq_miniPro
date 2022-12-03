const amqp = require('amqplib');

let channel;
const connectTochannel = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        return (await connection.createChannel());
    } catch (error) {
        console.log('can not connect to rabbitMq : ', error.message)
    }
}
const returnChannel = async () => {
    if (!channel) {
        channel = await connectTochannel();
    }
    return channel
}
const pushToQueue = async (queueName, data) => {
    try {
        await returnChannel();
        await channel.assertQueue(queueName);
        return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))
    } catch (error) {
        console.log(error.message, ' pushToQueue Error')
    }
}
const createQueue = async (queueName) => {
    //console.log('product createQueue')
    const channel = await returnChannel();
    await channel.assertQueue(queueName);
    return channel
}
module.exports = {
    returnChannel, pushToQueue, connectTochannel, createQueue
}