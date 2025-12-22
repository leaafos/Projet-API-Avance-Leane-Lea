const {Model, DataTypes} = require('sequelize');
const connection = require('./connection');

class Book extends Model {}

Book.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_of_publication: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        synopsis: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Authors',
                key: 'id'
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            }
        }
    },
    {
        sequelize: connection,
        modelName: 'Book'
    }
);

module.exports = Book;