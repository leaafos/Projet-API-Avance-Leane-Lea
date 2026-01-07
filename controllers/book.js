const BookModel = require("../models/book.js");
const { Author, Category } = require("../models/associations");
const getAskedVersion = require("../lib/versioning.js");

module.exports = {
  cgetV2: async (req, res, next) => {
    const apiVersion = getAskedVersion(req);
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

  cgetV1: async (req, res, next) => {
    const apiVersion = getAskedVersion(req);
    res.json(await BookModel.findAll());
  },

  cget: async (req, res, next) => {
<<<<<<< HEAD
    const apiVersion = getAskedVersion(req);
    const books = await BookModel.findAll({
=======
    const { pagination, filters } = res.getPagination();
    
    const { count, rows: books } = await BookModel.findAndCountAll({
      where: filters,
>>>>>>> 3e61c51004dbb488b3902d103ce5c820094b884c
      include: [
        { model: Author, as: 'author' },
        { model: Category, as: 'category' }
      ],
      ...pagination,
    });
    
    // Configurer HATEOAS avec le nombre total d'éléments
    res.setHateoas({ count });
    
    // Traduire les livres et catégories
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