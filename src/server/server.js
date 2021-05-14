// Simple Express server setup to serve the build output
require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const logger = require('pino')({ prettyPrint: { colorize: true } });
const pino = require('express-pino-logger');
const {
    createCase,
} = require('./api');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 4200;
const DIST_DIR = './dist';

const app = express();

app.use(pino({ logger }));

app.use(compression());
app.use(bodyParser.json());
app.use(express.static(DIST_DIR));
app.post('/api/case', createCase);

app.use('/', (_req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    return res.status(500).send(err.message);
});

app.listen(PORT, () =>
    logger.info(`✅  Server started: http://${HOST}:${PORT}`)
);
