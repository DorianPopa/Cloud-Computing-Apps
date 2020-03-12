const catController = require('./controllers/CatController');

const routes = [
    // Specific Item routes
    {
        method: 'GET',
        path: /\/cat\/([0-9a-z]+)/,
        handler: catController.getItem.bind(catController)
    },
    {
        method: 'POST',
        path: /\/cat\/([0-9a-z]+)/,
        handler: catController.postItem.bind(catController)
    },
    {
        method: 'PUT',
        path: /\/cat\/([0-9a-z]+)/,
        handler: catController.putItem.bind(catController)
    },
    {
        method: 'PATCH',
        path: /\/cat\/([0-9a-z]+)/,
        handler: catController.patchItem.bind(catController)
    },
    {
        method: 'DELETE',
        path: /\/cat\/([0-9a-z]+)/,
        handler: catController.deleteItem.bind(catController)
    },
    
   
    // Collection routes
    {
        method: 'GET',
        path: '/cat',
        handler: catController.get.bind(catController)
    },
    {
        method: 'POST',
        path: '/cat',
        handler: catController.post.bind(catController)
    },
    {
        method: 'PUT',
        path: '/cat',
        handler: catController.put.bind(catController)
    },
    {
        method: 'PATCH',
        path: '/cat',
        handler: catController.patch.bind(catController)
    },
    {
        method: 'DELETE',
        path: '/cat',
        handler: catController.delete.bind(catController)
    }
];

module.exports = routes;