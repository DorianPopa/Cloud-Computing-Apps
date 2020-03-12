var http = require('http');

const routes = require('./routes');
const router = require('./router');

process.on('uncaughtException', function(err) {
    console.log('uncaughtException');
    console.error(err.stack);
    console.log(err);
});

var server = http.createServer(async (request, response) => {
    await router(request, response, routes);
});

server.listen(8000, () => {
    console.log('Server is listening on port 8000');
});