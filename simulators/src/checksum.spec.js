import chai from 'chai';
import sinon from 'sinon';
import * as log from 'winston';

import checksum from './checksum';

const assert = chai.assert;



describe('Checksum', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(checksum);
	});
    it('Should return a correct ping checksum', () => {
        const result = checksum([0xf9,0x04,0x00,0x5f,0x00]);
        assert.equal(result,0x5c, 'Should equal 0x5c is ' + result.toString(16));
	});
    it('Should return a correct checksum for lights on', () => {
        const result = checksum([0xf6,0x04,0x00,0x0a,0x01]);
        assert.equal(result,0x05, 'Should equal 0x05 is ' + result.toString(16));
	});
});