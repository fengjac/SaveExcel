import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import log4js from 'log4js';

log4js.configure({
	appenders: [
		{ type: 'console' },
		{
			type: 'file',
			filename: 'logs/access.log',
			maxLogSize: 1024,
			backups: 3,
			category: 'normal'
		}
	],
	replaceConsole: true
});

const log4js_logger = (name) => {
	let logger = log4js.getLogger(name);
	logger.setLevel('INFO');
	return logger;
};

import { excelRouter } from './routes/api/excel';

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(log4js.connectLogger(log4js_logger('normal'), { level: 'auto', format: ':method :url' }));

app.use('/api/excel', excelRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

export { app, log4js_logger };