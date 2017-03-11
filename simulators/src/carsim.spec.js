import chai from 'chai';
import sinon from 'sinon';
import * as log from 'winston';
import CarSim from './carsim';

import checksum from './checksum';

const assert = chai.assert;

const sut = new CarSim();

describe('Carsim', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(sut);
	});
    it('Should create a server', (done) => {
		sut.start((err) => {
            assert.ifError(err);
            done();
        });
	});
    it.skip('Should create a server', (done) => {
	//	sut.start((err) => {
      //      assert.ifError(err);
        //    done();
    //    });
	});    
});