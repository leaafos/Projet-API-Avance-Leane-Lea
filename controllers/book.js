const BookModel = require("../models/book.js");
const { Author, Category } = require("../models/associations");

module.exports = {
  cget: async (req, res, next) => {
    const books = await BookModel.findAll({
      include: [
        { model: Author, as: 'author' },
        { model: Category, as: 'category' }
      ]
    });
      res.render(books);
      const translatedBooks = books.map((book) => {
      const bookData = book.toJSON();
      bookData.name_translated = res.trad(bookData.name) || bookData.name;
      if (bookData.category) {
        bookData.category.name_translated = res.trad(bookData.category.name) || bookData.category.name;
      }
      return bookData;
    });
    res.json(translatedBooks);
  },
  post: async (req, res, next) => {
    const newData = req.body;
    const newBook = await BookModel.create(newData);
    res.render(newBook);
  },
  get: async (req, res, next) => {
    const book = await BookModel.findByPk(req.params.id, {
      include: [
        { model: Author, as: 'author' },
        { model: Category, as: 'category' }
      ]
    });
    
    if (book) {
      const bookData = book.toJSON();
      bookData.name_translated = res.trad(bookData.name) || bookData.name;
      if (bookData.category) {
        bookData.category.name_translated = res.trad(bookData.category.name) || bookData.category.name;
      }
      res.render(bookData);
    } else {
      res.sendStatus(404);
    }
  },
  patch: async (req, res, next) => {
    const [nbUpdated, [updatedBook]] = await BookModel.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });
    if (nbUpdated === 0) {
      res.sendStatus(404);
    } else {
      res.render(updatedBook);
    }
  },
  delete: async (req, res, next) => {
    const nbDeleted = await BookModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (nbDeleted === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
  activate: async (req, res, next) => {
    const nbUpdated = await BookModel.update(
      {
        activated: true,
      },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      }
    );
    if (nbUpdated === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  },
};