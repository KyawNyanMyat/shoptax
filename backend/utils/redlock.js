import Redis from "ioredis";
import Redlock from "redlock";

const redis = new Redis({
    host: '127.0.0.1',
    port: 6379
});

const redlock = new Redlock([redis])

export default redlock