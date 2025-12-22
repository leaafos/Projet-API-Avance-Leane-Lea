const {Model, DataTypes} = require('sequelize');
const connection = require('./connection');

class Author extends Model {}

Author.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bio: {
            type: DataTypes.TEXT,
        },
        birthDate: {
            type: DataTypes.DATE,
        },
        nationality: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: connection,
    }
);


module.exports = User;