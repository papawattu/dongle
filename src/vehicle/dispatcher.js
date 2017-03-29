export default class Dispatcher {
	static outgoing(message) {
		return 'RECEIVED ' + message.toString('base64');
	}

	static incoming(message) {
		const cmd = message.toString().split(' ')[0];
		const data = message.toString().split(' ')[1] || '';
		
		if(cmd === 'SEND') {
			const decodedData = Buffer.from(data,'base64');
			console.log(`CMD ${cmd} DATA ${data} DEC ${decodedData.toString('hex')}`);
		
			return Buffer.from(data,'base64');
		} else {
			return '';
		}
		
	}
	static start(client) {
		client.send('CONNECTED');
	}
}