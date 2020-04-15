const server = require('./server');

const port = process.env.PORT || 3021;

server.listen(port, function() {
  console.log('Server is listening on port', port);
});
