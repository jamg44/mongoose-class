"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var rewire = require("rewire");
const chai = require("chai");
const chai_1 = require("chai");
const spies = require('chai-spies');
chai.use(spies);
const mongoose = require('mongoose');
const mongooseClass = rewire('../lib/mongoose-class');
const { Model, Column, MongooseModel } = mongooseClass;
describe('Model decorator', () => {
    beforeEach(() => {
        for (let model in mongoose.connection.models) {
            delete mongoose.connection.models[model];
        }
    });
    it('should not fail with empty models', () => {
        class TestClass {
        }
        ;
        const result = Model()(TestClass);
        chai_1.expect(null).to.equal(null);
    });
    it('should return a model', () => {
        class TestClass {
        }
        ;
        const result = Model()(TestClass);
        chai_1.expect(result).to.be.a('function');
        chai_1.expect(result).to.have.property('hooks');
        chai_1.expect(result).to.have.property('base');
        chai_1.expect(result).to.have.property('modelName');
        chai_1.expect(result).to.have.property('model');
        chai_1.expect(result).to.have.property('db');
        chai_1.expect(result).to.have.property('schema');
        chai_1.expect(result).to.have.property('collection');
        chai_1.expect(result).to.have.property('Query');
    });
    it('should read model name', () => {
        class TestClass {
        }
        ;
        const result = Model()(TestClass);
        chai_1.expect(result.modelName).to.equal('TestClass');
    });
    it('should read model columns', () => {
        class TestClass {
        }
        __decorate([
            Column({ type: String, index: true }),
            __metadata("design:type", String)
        ], TestClass.prototype, "testName", void 0);
        __decorate([
            Column(Number),
            __metadata("design:type", Number)
        ], TestClass.prototype, "testAge", void 0);
        ;
        const result = Model()(TestClass);
        chai_1.expect(result.schema.paths).to.have.property('testName');
        chai_1.expect(result.schema.paths).to.have.property('testAge');
        chai_1.expect(result.schema.paths).to.have.property('_id');
        chai_1.expect(result.schema.paths).to.have.property('__v');
        chai_1.expect(result.schema.obj.testName.type).to.equal(String);
        chai_1.expect(result.schema.obj.testName.index).to.equal(true);
        chai_1.expect(result.schema.obj.testAge).to.equal(Number);
    });
    it('should have static methods', () => {
        let flag = 5;
        class TestClass {
            static change(value) { flag = value; }
            static get5() { return 5; }
        }
        ;
        const TestModel = Model()(TestClass);
        TestModel.change(6);
        chai_1.expect(flag).to.equal(6);
        chai_1.expect(TestModel.get5()).to.equal(5);
    });
    it('should have instance methods', () => {
        class TestClass {
            changeName(value) { this.testName = value; }
            get5() { return 5; }
        }
        __decorate([
            Column({ type: String, index: true }),
            __metadata("design:type", String)
        ], TestClass.prototype, "testName", void 0);
        ;
        const TestModel = Model()(TestClass);
        const testObj = new TestModel();
        testObj.changeName('pepe');
        chai_1.expect(testObj.testName).to.equal('pepe');
        chai_1.expect(testObj.get5()).to.equal(5);
    });
    it('should set indexes', () => {
        class TestClass {
        }
        __decorate([
            Column({ type: String }),
            __metadata("design:type", String)
        ], TestClass.prototype, "testName", void 0);
        __decorate([
            Column({ type: Number }),
            __metadata("design:type", Number)
        ], TestClass.prototype, "testAge", void 0);
        ;
        const TestModel = Model({
            indexes: [{ testName: 1, testAge: -1 }]
        })(TestClass);
        const testObj = new TestModel();
        const indexes = TestModel.schema.indexes();
        chai_1.expect(indexes[0][0]).to.deep.equal({ testName: 1, testAge: -1 });
    });
    it('should set options', () => {
        class TestClass {
        }
        __decorate([
            Column({ type: String }),
            __metadata("design:type", String)
        ], TestClass.prototype, "testName", void 0);
        __decorate([
            Column({ type: Number }),
            __metadata("design:type", Number)
        ], TestClass.prototype, "testAge", void 0);
        ;
        const TestModel = Model({
            options: { collection: 'namechanged' }
        })(TestClass);
        chai_1.expect(TestModel.collection.name).to.equal('namechanged');
    });
    it('should allow manipulate schema beforeCreate', () => {
        class TestClass {
        }
        __decorate([
            Column({ type: String }),
            __metadata("design:type", String)
        ], TestClass.prototype, "testName", void 0);
        __decorate([
            Column({ type: Number }),
            __metadata("design:type", Number)
        ], TestClass.prototype, "testAge", void 0);
        ;
        const TestModel = Model({
            beforeCreate: schema => {
                schema.virtual('capitalizedName').get(function () {
                    return this.name.toUpperCase();
                });
            }
        })(TestClass);
        chai_1.expect(TestModel.schema.virtuals).to.have.property('capitalizedName');
    });
});
describe('Model instance', () => {
    beforeEach(() => {
        for (let model in mongoose.connection.models) {
            delete mongoose.connection.models[model];
        }
    });
    it('should have values', () => {
        class TestClass {
            changeName(value) { this.testName = value; }
        }
        __decorate([
            Column({ type: String, index: true }),
            __metadata("design:type", String)
        ], TestClass.prototype, "testName", void 0);
        ;
        const TestModel = Model()(TestClass);
        const testObj = new TestModel({ testName: 'lucas' });
        chai_1.expect(testObj.testName).to.equal('lucas');
        testObj.changeName('pepe');
        chai_1.expect(testObj.testName).to.equal('pepe');
    });
});
//# sourceMappingURL=mongoose-class.spec.js.map