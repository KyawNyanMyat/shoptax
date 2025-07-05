import Redis from "ioredis";
import Redlock from "redlock";

const redis = new Redis({
    host: '127.0.0.1',
    port: 6379
});

const redlock = new Redlock([redis])

const connectToRedis = ()=>{
    return new Promise((resolve, reject)=>{
        redis.on("ready",()=>{
            console.log("Connected to Redis")
            resolve()
        })

        redis.on("error",(err)=>{
            console.log("Redis connection error", err.message)
            reject()
        })
    })
}

export { redlock, redis, connectToRedis }