'use strict';

/**
 * Product model
 * @module Product
 */

import { Model, Column, MongooseModel } from '../lib/mongoose-class';

@Model({
  indexes: [ { name: 1, age: -1} ]
})
export class User extends MongooseModel {

  @Column({ type: String, index: true })
  name: string;

  @Column(Number)
  age: number;

  static list(callback?: Function) {
    return this.find().exec(callback);
  }

  saluda() {
    return 'Hello, my name is ' + this.name;
  }

}

