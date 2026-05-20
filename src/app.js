const env = require('./config/env');
const sequelize = require('./config/database');
const { initModels } = require('./models');
const buildSwaggerSpec = require('./docs/swagger');

initModels();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const swaggerSpec = buildSwaggerSpec(env.swagger.serverUrl);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.cors.origins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origem nao permitida por CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', async (_req, res, next) => {
  try {
    await sequelize.authenticate();

    return res.status(200).json({
      success: true,
      message: 'API operacional.',
      data: {
        uptime: process.uptime(),
        database: 'connected',
      },
    });
  } catch (error) {
    return next(error);
  }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
