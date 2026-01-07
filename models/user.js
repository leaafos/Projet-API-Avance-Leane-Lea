const {Model, DataTypes} = require('sequelize');
const connection = require('./connection');

class User extends Model {}

User.init(
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "username cannot be empty"
                },
                len: {
                    args: [3, 30],
                    msg: "username must be between 3 and 30 characters"
                },
                isAlphanumeric: {
                    msg: "username must contain only letters and numbers"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "password cannot be empty"
                },
                len: {
                    args: [6, 100],
                    msg: "password must be at least 6 characters long"
                }
            }
        },
        activated: { 
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