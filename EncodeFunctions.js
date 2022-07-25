import Zlib from 'react-zlib-js';

function ConnectSocket(mode, ip, port) {
	const objSocket = new WebSocket(mode + '://' + ip + ':' + port);
	objSocket.binaryType = 'arraybuffer';
}

export const socketOnOpen = function () {
	const sUsedId = 'TEST';
	const sLoginRequest =
		'63=FT3.0|64=101|65=74|66=14:59:22|67=TEST|68=YOUR_API_KEY|4=|400=0|401=2|396=HO|51=4|395=127.0.0.1';
	SendMessageOnSocket(sLoginRequest);
};

function SendMessageOnSocket(msg) {
	try {
		fragmentData(msg);
	} catch (ex) {
		console.log('SendMessageOnSocket Exception: ', ex);
	}
}

function fragmentData(_requestPacket) {
	console.log('fragmentData');
	try {
		// var _strHead = (_strHead = String.fromCharCode('5')); //5 comprression char
		const strHead = String.fromCharCode('5');

		// var i;
		let i;

		// var _data = new ArrayBuffer(_strHead.length);
		let data = new ArrayBuffer(strHead.length);

		// var _headerBytes = new Uint8Array(_data);
		let headerBytes = new Uint8Array(data);

		// for (i = 0; i < _strHead.length; i += 1) {
		//   _headerBytes[i] = _strHead.charCodeAt(i);
		// }
		for (i = 0; i < strHead.length; i += 1) {
			headerBytes = strHead.charCodeAt(i);
		}

		// var _baRequest;
		let baRequest;

		// _baRequest = HandleCompressedData(_requestPacket);
		baRequest = HandleCompressedData(_requestPacket);

		// var _length = _baRequest.length + 4;
		let length = baRequest.length + 4;

		// var _lenLength = _length.toString().length;
		let lenLength = length.toString().length;
		// var _lengthString = '';
		let lengthString = '';

		// for (i = 0; i < 5 - _lenLength; i++) {
		//   _lengthString += '0';
		// }
		for (i = 0; i < 5 - lenLength; i++) {
			lengthString += '0';
		}

		// _lengthString += _length.toString();
		lengthString += length.toString();

		// _data = new ArrayBuffer(_lengthString.length);
		data = new ArrayBuffer(lengthString.length);
		// var _lenBytes = new Uint8Array(_data);
		let lenBytes = new Uint8Array(data);

		// for (i = 0; i < _lengthString.length; i += 1) {
		//   _lenBytes[i] = _lengthString.charCodeAt(i);
		// }

		for (i = 0; i < lengthString.length; i += 1) {
			lenBytes[i] = lengthString.charCodeAt(i);
		}

		let baActualSend = new Uint8Array(5 + length);
		baActualSend.set(lenBytes);
		baActualSend.set(baRequest, 5);
		
		let outputStream = new Uint8Array(headerBytes.length + baActualSend.length);
		console.log("headerBytes",headerBytes)
		console.log("baActualSend",baActualSend)
		outputStream.set(headerBytes);
		outputStream.set(baActualSend, 1);
	
		return outputStream.buffer;
	} catch (e) {
		console.log('Exception fragmentData :', e);
	}
}

function HandleCompressedData(_rawData) {
	console.log('HandleCompressedData');
	try {
		// var _data = new ArrayBuffer(_rawData.length);
		let data = new ArrayBuffer(_rawData.length);

		// var _uint8buf = new Uint8Array(_data);
		let uint8buf = new Uint8Array(data);

		// for (var i = 0; i < _rawData.length; i += 1) {
		//   _uint8buf[i] = _rawData.charCodeAt(i) & 0xff;
		// }

		for (let i = 0; i < _rawData.length; i += 1) {
			uint8buf[i] = _rawData.charCodeAt(i) & 0xff;
		}
		
		// var _compData = Zlib.compress(new Uint8Array(_data), 6);
		let compressedData = '';
		Zlib.deflate(new Uint8Array(data), { level: 6 }, (er, cb) => {
			if (!er) {
				// console.log("cb.toString('base64')", cb.toString('base64'));
				compressedData = cb;
			} else {
				console.log('Error:', er);
			}
		});
		console.log('HandleCompressedData', compressedData);
		return compressedData;
	} catch (e) {
		console.log('HandleCompressedData Exception', e);
	}
}
