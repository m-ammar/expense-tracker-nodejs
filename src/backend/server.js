'use strict';
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import config from './../../webpack.config.dev'
import express from 'express';
import servicesRoutes from './routes/services';
import DatabaseInitializer from "./database/DatabaseInitializer";

const errorHandler = require('./ErrorHandler');

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

(new DatabaseInitializer()).initialize();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/', servicesRoutes);

app.all('/server.*', (request, response) => {
    response.status(403).send({
        message: 'Access Forbidden',
    });
});
app.use(express.static('dist'));

const AnyUrl = '*';
const path = require('path');

app.get(AnyUrl, (request, response) => {
    response.sendFile("index.html", { root: path.join('dist') })
});

// app.get('*', (request, response, next) => {
//     compiler.outputFileSystem.readFile(LANDIND_PAGE, (errorWhileServingLandingPage, result) => {
//     if (errorWhileServingLandingPage) {
//       return next(errorWhileServingLandingPage)
//     }
//     response.set('content-type', 'text/html')
//     response.send(result)
//     response.end()
//     })
//   })


app.use(errorHandler);

const apiServerPort = require("./config").apiServerPort;
app.listen(apiServerPort, () => console.log(`Expense tracker app listening on port ${apiServerPort}!`));
