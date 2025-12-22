const {Model, DataTypes} = require('sequelize');
const connection = require('./connection');

class User extends Model {}

User.init(
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activated: { // email activé
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        lastLogin: { 
            type: DataTypes.DATE,        
        },
    },
    {
        sequelize: connection,
    }
);


module.exports = User;