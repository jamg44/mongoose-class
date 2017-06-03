/// <reference types="mongoose" />
import { MongooseModel } from '../lib/mongoose-class';
export declare class User extends MongooseModel {
    name: string;
    age: number;
    static list(callback?: Function): Promise<any[]>;
    saluda(): string;
}
