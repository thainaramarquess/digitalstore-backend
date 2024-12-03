const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Digital Store API',
            version: '1.0.0',
            description: 'API para gerenciamento de uma loja digital - Geração Tech',
        },
        servers: [
            {
                url: 'http://localhost:3000/v1',
                description: 'Servidor de desenvolvimento',
            },
        ],
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(specs),
};

