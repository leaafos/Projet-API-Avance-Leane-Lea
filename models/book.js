const {Model, DataTypes} = require('sequelize');
const connection = require('./connection');

class Book extends Model {}

Book.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "name cannot be empty"
                },
                len: {
                    args: [2, 200],
                    msg: "name must be between 2 and 200 characters"
                }
            }
        },
        date_of_publication: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    msg: "date_of_publication must be a valid date"
                },
                isBefore: {
                    args: new Date().toISOString().split('T')[0],
                    msg: "date_of_publication cannot be in the future"
                }
            }
        },
        synopsis: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [10, 2000],
                    msg: "synopsis must be between 10 and 2000 characters"
                }
            }
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Authors',
                key: 'id'
            },
            validate: {
                isInt: {
                    msg: "author_id must be a valid integer"
                },
                min: {
                    args: 1,
                    msg: "author_id must be greater than 0"
                }
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            },
            validate: {
                isInt: {
                    msg: "category_id must be a valid integer"
                },
                min: {
                    args: 1,
                    msg: "category_id must be greater than 0"
                }
            }
        }
    },
    {
        sequelize: connection,
        modelName: 'Book'
    }
);

// Déclaration des champs traduisibles
Book.translatableFields = ['name'];

module.exports = Book;