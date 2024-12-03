const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

console.log('Environment:', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
    console.log('Database configuration:', {
        username: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    });
}

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        if (process.env.NODE_ENV === 'development') {
            return sequelize.sync({ alter: true });
        }
    })
    .then(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Models synchronized successfully.');
        }
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

