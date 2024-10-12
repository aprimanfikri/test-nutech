require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('../routes');
const errorHandler = require('../middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../doc/swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

app.use(errorHandler);

module.exports = app;
