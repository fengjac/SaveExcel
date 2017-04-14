import Express from 'express';
import Busboy from 'busboy';
import { log4js_logger } from '../../app.js';
import '../../App_Code/stringExt.js';
import { oneExcelToJson } from '../../App_Code/excelToJson.js';
import { readAllExcelAsync } from '../../App_Code/readExcel.js';
import { saveAllExcel } from '../../App_Code/saveExcelsToDB.js';

let router = Express();

router.use('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	next();
});

router.get('/', (req, res, next) => {
	let logger = log4js_logger('api/excel');
	logger.info('api get success')
	res.render('index', { title: 'Upload' });
});

router.post('/', (req, res, next) => {
	let busboy = new Busboy({ headers: req.headers });
	let filesData = [];
	let nameField = '', customerField = '', brandField = '', yearField = '', seasonField = '';

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		let chunks = [];

		file.on('data', (chunk) => {
			chunks.push(chunk);
		});

		file.on('end', (chunk) => {
			let fileData = {
				filename: filename,
				data: Buffer.concat(chunks)
			};

			filesData.push(fileData);
		});
	});

	busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
		console.log('fieldname:' + fieldname + ', ' + 'value:' + val);
		switch(fieldname) {
			case 'nameField':
				nameField = val;
			case 'customerField':
				customerField = val;
			case 'brandField':
				brandField = val;
			case 'yearField':
				yearField = val;
			case 'seasonField':
				seasonField = val;
			default:
				break;
		}
	});

	busboy.on('partsLimit', () => { });

	busboy.on('filesLimit', () => { });

	busboy.on('fieldsLimit', () => { });

	busboy.on('finish', () => {
		let opts = { type: 'buffer' };

		readAllExcelAsync(filesData, opts)
			.then((values) => {
				return values.map((value, index) => oneExcelToJson(filesData[index].filename, value));
			})
			.then((datas) => {
				return saveAllExcel(datas);
			})
			.then(() => {
				// logger1.info('upload success!!');
				res.end('success');
			})
			.catch((error) => {
				res.writeHead(500, { 'Connection': 'close' });
				res.end("Upload failed!");
			});
	});

	busboy.on('error', () => {
		res.writeHead(500, { 'Connection': 'close' });
		res.end("Upload failed!");
	});

	req.pipe(busboy);
});

export { router as excelRouter };