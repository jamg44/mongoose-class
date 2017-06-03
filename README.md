# mongoose-class

## Install

```
npm install mongoose-class --save
```

```
npm install @types/mongoose @types/mongodb --save-dev
```

## Create a model

./models/User.ts
```
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

  greet() {
    return 'Hello, my name is ' + this.name;
  }

}
```

## Use the model

./index.ts
```

import { User } from './models/User';

const user = new User({ name: 'Pepe', age: 34, nosale: 33});

User.find({}).exec((err, data) => {
    console.log('find', err, data);
});

User.list().then(users => {
    console.log('list', users);
});

console.log(user);
console.log(user.greet());
```