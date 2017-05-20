'use strict';


import { User } from './User';

main().catch(console.log);

async function main() {

  require('./connectMongoose');

  //await User.remove({});

  const user = new User({name: 'sadfasa', age: 50});
  await user.save();
  
  const pepe = new User({ name: 'Pepe', age: 34, nosale: 33});
  await pepe.save();

  console.log(pepe.name);
  console.log(pepe.capitalizedName);
  console.log(pepe.saluda());

  const lista = await User.find({});
  console.log('find', lista.map(el => el.name).join(', '));

  const users = await User.list();
  console.log('list', users.map(el => el.name).join(', '));

  //console.log(User);
  //var User = mongoose.model('User', schema);

}
