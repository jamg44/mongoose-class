'use strict';

/**
 * User model
 * @module User
 */

import { Model as MongooseModel } from 'mongoose';
import { Model, Column } from '../lib/mongoose-class';

@Model({
  indexes: [ { name: 1, age: -1} ],
  options: { collection: 'user'},
  beforeCreate: schema => {
    schema.virtual('capitalizedName').get(function () {
      return this.name.toUpperCase();
    });
  }
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

