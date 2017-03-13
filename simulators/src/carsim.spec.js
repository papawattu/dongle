import chai from 'chai';
import sinon from 'sinon';
import * as log from 'winston';
import CarSim from './carsim';

const assert = chai.assert;

const sut = new CarSim();

describe('Carsim', () => {
	beforeEach(() => {
			
    });
    after(() => {
		//sut.stop();	
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
    it('Should create a server', (done) => {
	    sut.stop((err) => {
            assert.ifError(err);
            done();
        });
	});    
});