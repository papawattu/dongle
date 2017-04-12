export default class Dispatcher {
	static outgoing(message) {
		
		const encodedData = message.toString('base64');

		console.log(`RECEIVED ${encodedData.toString()} as hex ${message.toString('hex')}`);
		
		return 'RECEIVED ' + encodedData;
	}

	static incoming(message) {
		const cmd = message.toString().split(' ')[0];
		const data = message.toString().split(' ')[1] || '';
		
		switch(cmd) {
			case 'SEND': {
				const decodedData = Buffer.from(data, 'base64');
				console.log(`CMD ${cmd} DATA ${data}DEC ${decodedData.toString('hex')}`);

				return Buffer.from(data, 'base64');
			}
			case 'PING': {
				const sequence = data;
				console.log(`CMD ${cmd} DATA ${data}`);
				return Buffer.from(data, 'base64');
			}
			default: {
				return null;
			}
		}
	}
	static start(client) {
		client.send('CONNECTED');
	}
}