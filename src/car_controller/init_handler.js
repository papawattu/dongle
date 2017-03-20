export default class InitHandler {
	constructor({ 
	 	writeCallback,
		readyCallback,
		errorCallback,
	}) {
		this.readyCallback = readyCallback;
		this.writeCallback = writeCallback;
		this.errorCallback = errorCallback;
		this.state = 'INITIAL';
		this.buffer = Buffer.from([]);
		this.serialNum = serialNum;

	}
}