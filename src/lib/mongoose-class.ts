'use strict';

let mongoose = require('mongoose');
import { Model as MongooseModel, Schema, Document } from 'mongoose';
//import 'reflect-metadata';

interface ISchema {
  modelName: string;
  schemaDefinition: any;
}

const schemas: ISchema[] = [];

// Export original Mongoose Model to allow extend user class
export { MongooseModel };

// Model decorator
export function Model(config?: any): Function { // decorator factory
  return function (decoratedClass): MongooseModel<Document> { // decorator
    const modelName: string = decoratedClass.name;
    const schema: Schema = mongoose.Schema(getSchema(modelName).schemaDefinition);
    applyStaticMethods(decoratedClass, schema);
    applyInstanceMethods(decoratedClass, schema);
    if (config) {
      applyConfigIndexes(config.indexes, schema);
    }
    return mongoose.model(modelName, schema);
  };
}

// Column decorator
export function Column(fieldDef: any) {
  //return Reflect.metadata(formatMetadataKey, formatString);
  return function (target: any, fieldName: string): void {
    //console.log('Column', target, target.constructor.name, fieldName, fieldDef);
    //var types = Reflect.getMetadata('design:properties', target, fieldName);
    //console.log(fieldName, 'type', (typeof target).name);
    const modelName: string = target.constructor.name;
    let schema: ISchema = getSchema(modelName);
    if (!schema.modelName) {
      schema = { modelName, schemaDefinition: {} };
      schemas.push(schema);
    }
    schema.schemaDefinition[fieldName] = fieldDef;
  };
}

var getSchema = (modelName: string): ISchema | any => 
  schemas.find(sc => sc.modelName === modelName) || {};

function applyStaticMethods(decoratedClass, schema: Schema): void {
  Object.getOwnPropertyNames(decoratedClass).forEach(p => {
    if (typeof decoratedClass[p] === 'function')
      schema.statics[p] = decoratedClass[p];
  });
}

function applyInstanceMethods(decoratedClass, schema: Schema): void {
  Object.getOwnPropertyNames(decoratedClass.prototype).forEach(p => {
    if (p !== 'constructor')
      schema.methods[p] = decoratedClass.prototype[p];
  });
}

function applyConfigIndexes(indexes, schema) {
  if (!indexes) return;
  indexes.forEach(index => schema.index(index));
}