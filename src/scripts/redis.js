
import redis from 'async-redis';
//redis.debug_mode = true;

const client = redis.createClient();

client.on('connect', function() {
  console.log('Redis client connected');
});

client.on('error', function(error) {
  console.error(error);
});

export default client;