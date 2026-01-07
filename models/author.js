const {Model, DataTypes} = require('sequelize');
const connection = require('./connection');

class Author extends Model {}

Author.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "firstName cannot be empty"
                },
                len: {
                    args: [2, 50],
                    msg: "firstName must be between 2 and 50 characters"
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "lastName cannot be empty"
                },
                len: {
                    args: [2, 50],
                    msg: "lastName must be between 2 and 50 characters"
                }
            }
        },
        bio: {
            type: DataTypes.TEXT,
            validate: {
                len: {
                    args: [10, 1000],
                    msg: "bio must be between 10 and 1000 characters"
                }
            }
        },
        birthDate: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: "birthDate must be a valid date"
                },
                isBefore: {
                    args: new Date().toISOString().split('T')[0], //-> aujourd'hui
                    msg: "birthDate cannot be in the future"
                }
            }
        },
        nationality: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [2, 50],
                    msg: "nationality must be between 2 and 50 characters"
                }
            }
        },
    },
    {
        sequelize: connection,
    }
);


module.exports = Author;