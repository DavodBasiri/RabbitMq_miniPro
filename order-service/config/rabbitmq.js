const amqp = require('amqplib');
const { OrderModel } = require('../model/order');
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
    console.log('order returnChannel')
    if (!channel) {
        channel = await connectTochannel();
    }
    return channel
}
const pushToQueueOrder = async (queueName, data) => {
    try {
        console.log('order pushToQueueOrder')
        await channel.assertQueue(queueName);
        return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))
    } catch (error) {
        console.log(error.message, ' pushToQueueOrder Error')
    }
}
const createQueue = async (queueName) => {
    console.log('order createQueue')
    const channel = await returnChannel();
    await channel.assertQueue(queueName);
    return channel
}
const createOrderWithQueue = async (queueName) => {
    console.log('order createOrderWithQueue')
    await createQueue(queueName);
    channel.consume(queueName, async msg => {
        if (msg.connect) {
            const { products, userEmail } = JSON.parse(msg.connect.toString());
            const newOrder = new OrderModel({
                products,
                userEmail,
                totalPrice: (products.map(p => +p.price)).reduce((prev, curr) => prev + curr, 0)
            });
            await newOrder.save();
            console.log(products, newOrder)
            channel.akc(msg);
            pushToQueueOrder("PORODUCT", newOrder)
        }
    })
}
module.exports = {
    returnChannel, pushToQueueOrder, connectTochannel, createOrderWithQueue, createQueue
}