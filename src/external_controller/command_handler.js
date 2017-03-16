export default class CommandHandler {
	constructor({ 
	 	writeCallback,
		sendCommand,
	}) {
		this.writeCallback = writeCallback;
		this.sendCommand = sendCommand;
	}
	stripCommand(data) {
		return data.substr(0, data.indexOf('\r'));
	}
	handle(data) {
		const command = Buffer.from(this.stripCommand(data.toString()).split(' ')[1],'base64');

		this.sendCommand(command,(response) => {
			this.writeCallback(response);
		});
		
	}
}