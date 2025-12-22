const {Model, DataTypes} = require('sequelize');
const connection = require('./connection');

class Category extends Model {}

Category.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize: connection,
    }
);


module.exports = User;