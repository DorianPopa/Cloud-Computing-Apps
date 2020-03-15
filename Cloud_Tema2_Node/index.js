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

server.listen(process.env.PORT || 8000, () => {
    var port = server.address().port;
    console.log("App now running on port", port);
});
