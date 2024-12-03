const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ProductOption extends Model {
        static associate(models) {
        }
    }

    ProductOption.init({
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shape: {
            type: DataTypes.ENUM('square', 'circle'),
            defaultValue: 'square',
        },
        radius: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        type: {
            type: DataTypes.ENUM('text', 'color'),
            defaultValue: 'text',
        },
        values: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'ProductOption',
    });

    return ProductOption;
};

