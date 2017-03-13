import chai from 'chai';
import sinon from 'sinon';
import * as log from 'winston';
import Parser from './parser';

const assert = chai.assert;
const handler = sinon.spy();

const sut = new Parser(handler);

describe('Parser', () => {
    beforeEach(() => {
        handler.reset();
    });
    it('Should not be null', () => {
        assert.isNotNull(sut);
    });
    it('Should add buffers', () => {
        const data1 = Uint8Array.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]);
        const data2 = Uint8Array.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]);
        const expected = Uint8Array.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]);
        const result = sut.appendBuffer(data1, data2);
        assert.deepEqual(result, expected);
    });
    it('Should allow command', () => {
        const result = sut.allowedCommand(0xf2);

        assert.isTrue(result);
    });
    it('Should not allow command', () => {
        const result = sut.allowedCommand(0x00);

        assert.isFalse(result);
    });

    it('Should find command', () => {
        const data = Uint8Array.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]);
        const expected = { cmd: 0xf2, dataLength: 10, length: 12 };
        const result = sut.findCommand(data);

        assert.deepEqual(result, expected);
    });
    it('Should not find command', () => {
        const data = Uint8Array.from([0xff, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]);
        const expected = { cmd: 0xf2, dataLength: 10, length: 12 };
        const result = sut.findCommand(data);

        assert.isNull(result);
    });
    it('Should not find incomplete command', () => {
        const data = Uint8Array.from([0xff, 0x0a, 0x00]);
        const result = sut.findCommand(data);

        assert.isNull(result);
    });
    it('Should move buffer to next command', () => {
        const data = Uint8Array.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xf6, 0x04, 0x00, 0xaa, 0x00, 0xa4]);
        const expected = Uint8Array.from([0xf6, 0x04, 0x00, 0xaa, 0x00, 0xa4]);
        const result = sut.nextCommand(data, data[1] + 2);

        assert.deepEqual(result, expected);
    });
    it('Should process command', () => {
        const data = Uint8Array.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]);
        sut.process(data);
        assert(handler.calledOnce);
        assert(handler.calledWith({
            cmd: 0xf2,
            data: Uint8Array.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
            length: 12,
            dataLength: 10,
            chksum: 0xff,
        }));
    });
    it('Should return from a start command', () => {
        const data = Uint8Array.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]);
        const expected = Uint8Array.from([0x2f, 0x04, 0x01, 0x01, 0x000, 0x35]);

        assert.deepEqual(sut.process(data), expected);
    });
    it('Should not parse incomplete command', () => {
        const data = Uint8Array.from([0xf2, 0x0a, 0x00]);
        sut.process(data);
        assert(handler.notCalled);
    });
    it('Should parse completed command', () => {
        const data = Uint8Array.from([0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]);
        sut.process(data);
        assert(handler.called);
    });
    it('Should fail with bad checksum command', () => {
        const data = Uint8Array.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xfe]);
        assert.throws(() => { sut.process(data); });
    });
});