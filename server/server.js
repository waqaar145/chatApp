const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');


var redis = require('redis');
var socketIORedis = require('socket.io-redis');
var client1 = redis.createClient({ host: 'localhost', port: 6379 }); 

const PORT = process.env.PORT || 4001;

var app = express();

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}));

var http = require('http').Server(app);

app.get('/', (req, res) => {
  let user = {
    name: 'waqaar aslam',
    email: 'waqaar@gmail.com',
    location: 'mumbai'
  }
  client1.hmset('frameworks', user);
  res.send('ok');
});

app.get('/framework', async (req, res) => {
  client1.hgetall('frameworks', function(err, object) {
    console.log(object);
  });
  res.send('framework list');
});

app.get('/channel/:subject_slug', (req, res) => {
  const { subject_slug } = req.params;
  let redis_key = `channel:${subject_slug}`;
  client1.lrange(redis_key, 0, -1, (err, reply) => {
    if (err) return res.status(400).send('Error');
    console.log('ERROR - ', err)
    console.log('REPLY - ', reply)
    let data = []
    for (let d of reply) {
      data.push(JSON.parse(d))
    }
    return res.status(200).send(data)
  });
})

http.listen(PORT, () => {
  console.log('> Server is running on port ', PORT);
});

var io = require('socket.io')(http);
io.adapter(socketIORedis({ host: 'localhost', port: 6379 }));

// socket connection
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  socket.on('join-channel', (data) => {
    let redis_key = `channel:${data.channel}`;
    socket.join(data.channel, () => {
      socket.to(data.channel).emit('channel-joined', data.name);
    });
  });

  socket.on('send-message-to-channel', (data, callback) => {
    let redis_key = `channel:${data.subject_slug}`;
    let channel_name = data.subject_slug;

    client1.exists(redis_key, (err, reply) => {
      if (err) return res.status(400).send('Error');
      client1.lpush(redis_key, JSON.stringify(data), (err1, reply1) => {
        if (err1) return res.status(400).send('Error 1');
        io.in(channel_name).emit('sent-message', data);
        callback()
      })
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});


