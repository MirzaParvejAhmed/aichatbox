import redis from 'ioredis';

const redisClient = new redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,
});
redisClient.on('connect',()=>{
    console.log('REDIS CONNECTED');
})
export default redisClient;