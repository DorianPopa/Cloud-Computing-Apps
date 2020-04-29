const errorHandlers = require('./util/errorHandlers');


module.exports = async (request, response, routes) => {
    let route = routes.find((route) => {
        let foundMethod = false;
        if(route.method === request.method){
            foundMethod = true;
        }
        let pathIsMatching = false;
        if(typeof route.path === 'object'){
            pathIsMatching = request.url.match(route.path);
        }
        else{
            if(route.path === request.url)
                pathIsMatching = true;
        }

        if(pathIsMatching && foundMethod == true)
            return true;
    });

    // get the id parameter from the request link
    let id = null;
    if(route && typeof route.path === 'object'){
        id = request.url.match(route.path)[1];
    }

    if(route){
        let body = null;
        if(request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH' ){
            body = await getPostData(request);
        }
        return route.handler(request, response, id, body);
    }
    else{
        return errorHandlers.error(response, 'Endpoint not found', 404);
    }
};


function getPostData(request){
    return new Promise((resolve, reject) => {
        try{
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                resolve(body);
            });
        }
        catch (e) {
            reject(e);
        }
    });
}