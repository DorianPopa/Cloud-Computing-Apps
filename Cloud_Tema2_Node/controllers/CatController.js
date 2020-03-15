const mongoose = require('mongoose');
const Cat = require('./../models/Cat');
const errorHandlers = require('./../util/errorHandlers');

class CatController {
    // GET /cat
    async get (req, res) {
        try {
            const selectParams = {
                _id: 1,
                name: 1,
                breed: 1,
                age: 1
            };

            let cats = await Cat.getAll({}, selectParams);

            return errorHandlers.success(res, cats);
        }
        catch (error) {
            return errorHandlers.error(res, error);
        }
    }

    // POST /cat
    async post (request, response, param, postData){
        postData = JSON.parse(postData);
        let { name, breed, age } = postData;

        try {
            const cat = await Cat.create({name, breed, age});
            return errorHandlers.created(response, cat.toClient());
        }
        catch(error) {
            return errorHandlers.error(response);
        }
    }

    // PUT /cat/
    async put (request, response, param, postData){
        return errorHandlers.error(response, 'Method Not Allowed', 405);
    }

    // PATCH /cat
    async patch (request, response, param, postData){
        return errorHandlers.error(response, 'Method Not Allowed', 405);
    }

    // DELETE /cat
    async delete (request, response, param, postData){
        return errorHandlers.error(response, 'Method Not Allowed', 405);
    }

    // GET /cat/{id}
    async getItem (request, response, param, postData){
        const selectParams = {
            _id: 1,
            name: 1,
            breed: 1,
            age: 1
        };

        let cat;
        try {
            cat = await Cat.get({_id : param}, selectParams);
            return errorHandlers.success(response, cat);
        }
        catch(e) {
            console.log(e);
        }
        if(!cat) {
            return errorHandlers.error(response, 'Not Found', 404);
        }
    }

    // POST /cat/{id}
    async postItem (request, response, param, postData){
        postData = JSON.parse(postData);
        let cat;
        try {
            cat = await Cat.get({ _id: param }, { _id: 1 });
        }
        catch(e) {
            console.log(e);
        }
        if(cat) {
            return errorHandlers.error(response, 'Conflict - A Cat with the same _id already exists', 409);
        }
        else {
            let { name, breed, age } = postData;
            try {
                cat = await Cat.create({"_id" : param, name, breed, age});
                return errorHandlers.created(response, cat.toClient());
            }
            catch(error) {
                return errorHandlers.error(response);
            }
        }
    }

    // PUT /cat/{id}
    async putItem (request, response, param, postData){
        let cat;
        try {
            cat = await Cat.get({ _id: param }, { _id: 1 });
        }
        catch(e) {
            console.log(e);
        }
        if(!cat) {
            return errorHandlers.error(response, 'Not Found - No resource with the given _id was found', 404);
        }

        postData = JSON.parse(postData);
        let updateData = { };
        if(postData.name){
            updateData.name = postData.name;
        }
        if(postData.breed){
            updateData.breed = postData.breed;
        }
        if(postData.age){
            updateData.age = postData.age;
        }
        if(updateData.name === null && updateData.breed === null && updateData.age === null){
            return errorHandlers.error(response, 'Bad Request - Empty Body', 400);
        }

        const updatedCat = await Cat.findOneAndUpdate({_id: param}, {$set: updateData}, {new: true});
        return errorHandlers.success(response, updatedCat.toClient());
    }

    // PATCH /cat/{id}
    async patchItem(request, response, param, postData){
        let cat;
        try {
            cat = await Cat.get({ _id: param }, { _id: 1 });
        }
        catch(e) {
            console.log(e);
        }
        if(!cat) {
            return errorHandlers.error(response, 'Not Found - No resource with the given _id was found', 404);
        }

        postData = JSON.parse(postData);
        let updateData = { };
        if(postData.name){
            updateData.name = postData.name;
        }
        if(postData.breed){
            updateData.breed = postData.breed;
        }
        if(postData.age){
            updateData.age = postData.age;
        }
        if(updateData.name === null && updateData.breed === null && updateData.age === null){
            return errorHandlers.error(response, 'Bad Request - Empty Body', 400);
        }

        const updatedCat = await Cat.findOneAndUpdate({_id: param}, {$set: updateData}, {new: true});
        return errorHandlers.success(response, updatedCat.toClient());
    }

    // DELETE /cat/{id}
    async deleteItem(request, response, param, postData){
        let cat;
        try {
            cat = await Cat.get({ _id: param }, { _id: 1 });
        }
        catch(e) {
            console.log(e);
        }
        if(!cat) {
            return errorHandlers.error(response, 'Not Found - No resource with the given _id was found', 404);
        }

        await Cat.remove({ _id: param });
        return errorHandlers.success(response);
    }
}

module.exports = new CatController();