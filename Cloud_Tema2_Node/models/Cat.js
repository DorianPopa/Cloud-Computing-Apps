const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const context = require('./context');

const catSchema = new Schema({
    name:{
        type: String,
        required: true
    },

    breed:{
        type: String,
        required: true
    },

    age:{
        type: Number,
        required: true
    }
})

catSchema.method('toClient', function () {
    const cat = this.toObject();
    return cat;
});

const catModel = context.model('cats', catSchema);

class Cat {
    static create(data){
        let newCat = catModel(data);

        return new Promise((resolve, reject) => {
            let error = newCat.validateSync();
            if(error){
                reject(error);
            }

            newCat.save((err, obj) => {
                if(obj){
                    resolve(obj);
                }
                else{
                    reject(err);
                }
            });
        });
    }

    static getAll (conditions, selectParams) {
        return new Promise((resolve, reject) => {
            const query = catModel.find(conditions);

            if (selectParams) {
                query.select(selectParams);
            }

            query.lean().exec((err, docs) => {
                if (docs) {
                    resolve(docs);
                }
                else {
                    reject(err);
                }
            });
        });
    }

    static get (conditions, selectParams) {
        return new Promise((resolve, reject) => {
            const query = catModel.findOne(conditions);

            if (selectParams) {
                query.select(selectParams);
            }

            query.lean().exec((err, docs) => {
                if (docs) {
                    resolve(docs);
                }
                else {
                    reject(err);
                }
            });
        });
    }

    static remove (conditions) {
        return new Promise((resolve, reject) => {
            catModel.remove(conditions, (err, docs) => {
                if (docs) {
                    resolve(docs);
                }
                else {
                    reject(err);
                }
            });
        });
    }

    static findOneAndUpdate (conditions, updateData, options) {
        return new Promise((resolve, reject) => {
            catModel.findOneAndUpdate(conditions, updateData, options, (err, docs) => {
                if (docs) {
                    resolve(docs);
                }
                else {
                    reject(err);
                }
            });
        });
    }

    static update (conditions, updateData, options) {
        return new Promise((resolve, reject) => {
            catModel.update(conditions, updateData, options, (err, docs) => {
                if (docs) {
                    resolve(docs);
                }
                else {
                    reject(err);
                }
            });
        });
    }
}

module.exports = Cat;