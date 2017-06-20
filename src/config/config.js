import redis from 'redis'

export const port = process.env.PORT || 1337;
export const appName = 'PlaceMorty';
export const client = redis.createClient({ return_buffers: true });
