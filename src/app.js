const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const swagger = require('../swagger');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/v1', routes);
app.use('/api-docs', swagger.serve, swagger.setup);

module.exports = app;

