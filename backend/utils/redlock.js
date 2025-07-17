import Redis from "ioredis";
import Redlock from "redlock";

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    lazyConnect: true, // only connect when you call redis.connect()
    enableOfflineQueue: false, //Throws key:value immediately if disconnected
    connectTimeout: 5000,
});


const redlock = new Redlock([redis])

const connectToRedis = async () => {
    try {
        if (redis.status === 'ready') {
            console.log("Redis already connected");
            return true;
        }
        await redis.connect();
        console.log("Connected to Redis");
        return true;
    } catch (err) {
        console.error("Redis connection failed:", err);
        throw err;
    }
};

export { redlock, redis, connectToRedis }