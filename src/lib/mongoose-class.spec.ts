var rewire = require("rewire");
import * as chai from 'chai';
import { expect } from 'chai';
const spies = require('chai-spies');
// if you used the '@types/mocha' method to install mocha type definitions,
// uncomment the following line
// import 'mocha';

chai.use(spies);

const mongoose = require('mongoose');
const mongooseClass = rewire('../lib/mongoose-class');
const { Model, Column, MongooseModel } = mongooseClass;

describe('Model decorator', () => {

  beforeEach(() => {
    // https://github.com/jhnns/rewire
    //mongooseClass.__set__('mongoose', )

    // reset mongoose models http://stackoverflow.com/questions/19643126/how-do-you-remove-a-model-from-mongoose
    for (let model in mongoose.connection.models) {
      delete mongoose.connection.models[model];
    }
  });


  it('should not fail with empty models', () => {
    class TestClass {};
    const result = Model()(TestClass);
    expect(null).to.equal(null);
  });

  it('should return a model', () => {
    class TestClass {};
    const result = Model()(TestClass);
    expect(result).to.be.a('function');
    expect(result).to.have.property('hooks');
    expect(result).to.have.property('base');
    expect(result).to.have.property('modelName');
    expect(result).to.have.property('model');
    expect(result).to.have.property('db');
    expect(result).to.have.property('schema');
    expect(result).to.have.property('collection');
    expect(result).to.have.property('Query');
  });

  it('should read model name', () => {
    class TestClass {};
    const result = Model()(TestClass);
    expect(result.modelName).to.equal('TestClass');
  });

  it('should read model columns', () => {
    class TestClass {
      @Column({ type: String, index: true }) testName: string;
      @Column(Number) testAge: number;
    };
    const result = Model()(TestClass);
    expect(result.schema.paths).to.have.property('testName');
    expect(result.schema.paths).to.have.property('testAge');
    expect(result.schema.paths).to.have.property('_id');
    expect(result.schema.paths).to.have.property('__v');
    expect(result.schema.obj.testName.type).to.equal( String);
    expect(result.schema.obj.testName.index).to.equal( true );
    expect(result.schema.obj.testAge).to.equal(Number);
  });

  it('should have static methods', () => {
    let flag = 5;
    class TestClass {
      static change(value) { flag = value; }
      static get5() { return 5; }
    };
    const TestModel = Model()(TestClass);
    TestModel.change(6);
    expect(flag).to.equal(6);
    expect(TestModel.get5()).to.equal(5);
  });

  it('should have instance methods', () => {
    class TestClass {
      @Column({ type: String, index: true }) testName: string;
      changeName(value) { this.testName = value; }
      get5() { return 5; }
    };
    const TestModel = Model()(TestClass);
    const testObj = new TestModel();
    testObj.changeName('pepe');
    expect(testObj.testName).to.equal('pepe');
    expect(testObj.get5()).to.equal(5);
  });

  it('should set indexes', () => {
    class TestClass {
      @Column({ type: String }) testName: string;
      @Column({ type: Number }) testAge: number;
    };
    const TestModel = Model({
      indexes: [{ testName: 1, testAge: -1}]
    })(TestClass);
    const testObj = new TestModel();
    const indexes = TestModel.schema.indexes();
    expect(indexes[0][0]).to.deep.equal({ testName: 1, testAge: -1 });
  });

  it('should set options', () => {
    class TestClass {
      @Column({ type: String }) testName: string;
      @Column({ type: Number }) testAge: number;
    };
    const TestModel = Model({
      options: { collection: 'namechanged'}
    })(TestClass);
    expect(TestModel.collection.name).to.equal('namechanged');
  });

  it('should allow manipulate schema beforeCreate', () => {
    class TestClass {
      @Column({ type: String }) testName: string;
      @Column({ type: Number }) testAge: number;
    };
    const TestModel = Model({
      beforeCreate: schema => {
        schema.virtual('capitalizedName').get(function () {
          return this.name.toUpperCase();
        });
      }
    })(TestClass);
    expect(TestModel.schema.virtuals).to.have.property('capitalizedName');
  });
}); // Model decorator


describe('Model instance', () => {

  beforeEach(() => {
    // https://github.com/jhnns/rewire
    //mongooseClass.__set__('mongoose', )

    // reset mongoose models http://stackoverflow.com/questions/19643126/how-do-you-remove-a-model-from-mongoose
    for (let model in mongoose.connection.models) {
      delete mongoose.connection.models[model];
    }
  });

  it('should have values', () => {
    class TestClass {
      @Column({ type: String, index: true }) testName: string;
      changeName(value) { this.testName = value; }
    };
    const TestModel = Model()(TestClass);
    const testObj = new TestModel({ testName: 'lucas'});
    expect(testObj.testName).to.equal('lucas');
    testObj.changeName('pepe');
    expect(testObj.testName).to.equal('pepe');
  });

});