const {Model, DataTypes} = require('sequelize');
const connection = require('./connection');

class Category extends Model {}

Category.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "name cannot be empty"
                },
                len: {
                    args: [2, 100],
                    msg: "name must be between 2 and 100 characters"
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            validate: {
                len: {
                    args: [10, 500],
                    msg: "description must be between 10 and 500 characters"
                }
            }
        },
    },
    {
        sequelize: connection,
    }
);

// Déclaration des champs traduisibles
Category.translatableFields = ['name'];

module.exports = Category;