const server = require('./server');

const port = process.env.PORT || 3021;

server.listen(port, '0.0.0.0', function() {
  console.log('Server is listening on port', port);
});
