import { Model as MongooseModel } from 'mongoose';
export { MongooseModel };
export declare function Model(config?: any): Function;
export declare function Column(fieldDef: any): (target: any, fieldName: string) => void;
