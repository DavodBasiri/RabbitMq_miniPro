const amqp=require('amqplib');
const { json } = require('body-parser');
let channel;
const connectTochannel = async ()=>{
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        return (await connection.createChannel());
    } catch (error) {
        console.log('can not connect to rabbitMq : ',error.message)
    }
}
const returnChannel = async()=>{
    if(!channel){
        channel= await connectTochannel();
    }
    return channel
}
const pushToQueue=async(queueName,data)=>{
    try {
        await channel.assertQueue(queueName);
        return channel.sentToQueue(queueName,Buffer,from(JSON.stringify(data)))
    } catch (error) {
        console.log(error.message,' pushToQueue Error')
    }
}
module.exports={
    returnChannel,pushToQueue,connectTochannel
}