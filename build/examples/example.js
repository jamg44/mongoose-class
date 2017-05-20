'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
main().catch(console.log);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        require('./connectMongoose');
        const user = new User_1.User({ name: 'sadfasa', age: 50 });
        yield user.save();
        const pepe = new User_1.User({ name: 'Pepe', age: 34, nosale: 33 });
        yield pepe.save();
        console.log(pepe.name);
        console.log(pepe.capitalizedName);
        console.log(pepe.saluda());
        const lista = yield User_1.User.find({});
        console.log('find', lista.map(el => el.name).join(', '));
        const users = yield User_1.User.list();
        console.log('list', users.map(el => el.name).join(', '));
    });
}
//# sourceMappingURL=example.js.map