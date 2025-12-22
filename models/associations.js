const Book = require('./book');
const Author = require('./author');
const Category = require('./category');

// Un auteur peut écrire plusieurs livres
Author.hasMany(Book, {
    foreignKey: 'author_id',
    as: 'books'
});

// Un livre appartient à un seul auteur
Book.belongsTo(Author, {
    foreignKey: 'author_id',
    as: 'author'
});

// Une catégorie peut avoir plusieurs livres
Category.hasMany(Book, {
    foreignKey: 'category_id',
    as: 'books'
});

// Un livre appartient à une seule catégorie
Book.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

module.exports = {
    Book,
    Author,
    Category
};
