'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
let mongoose = require('mongoose');
const mongoose_1 = require("mongoose");
exports.MongooseModel = mongoose_1.Model;
const schemas = [];
function Model(config) {
    return function (decoratedClass) {
        const modelName = decoratedClass.name;
        const options = {};
        if (config && config.options) {
            Object.assign(options, config.options);
        }
        const schema = mongoose.Schema(getSchema(modelName).schemaDefinition, options);
        applyStaticMethods(decoratedClass, schema);
        applyInstanceMethods(decoratedClass, schema);
        if (config) {
            applyConfigIndexes(config.indexes, schema);
            applyConfigBeforeCreate(config.beforeCreate, schema);
        }
        return mongoose.model(modelName, schema);
    };
}
exports.Model = Model;
function Column(fieldDef) {
    return function (target, fieldName) {
        const modelName = target.constructor.name;
        let schemaHolder = getSchema(modelName);
        if (!schemaHolder.modelName) {
            schemaHolder = { modelName, schemaDefinition: {} };
            schemas.push(schemaHolder);
        }
        schemaHolder.schemaDefinition[fieldName] = fieldDef;
    };
}
exports.Column = Column;
var getSchema = (modelName) => schemas.find(sc => sc.modelName === modelName) || {};
function applyStaticMethods(decoratedClass, schema) {
    Object.getOwnPropertyNames(decoratedClass).forEach(p => {
        if (typeof decoratedClass[p] === 'function')
            schema.statics[p] = decoratedClass[p];
    });
}
function applyInstanceMethods(decoratedClass, schema) {
    Object.getOwnPropertyNames(decoratedClass.prototype).forEach(p => {
        if (p !== 'constructor')
            schema.methods[p] = decoratedClass.prototype[p];
    });
}
function applyConfigIndexes(indexes, schema) {
    if (!indexes)
        return;
    indexes.forEach(index => schema.index(index));
}
function applyConfigBeforeCreate(beforeCreate, schema) {
    if (!beforeCreate)
        return;
    beforeCreate(schema);
}
//# sourceMappingURL=mongoose-class.js.map