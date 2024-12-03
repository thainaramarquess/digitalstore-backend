const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ProductImage extends Model {
        static associate(models) {
        }
    }

    ProductImage.init({
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'ProductImage',
    });

    return ProductImage;
};

