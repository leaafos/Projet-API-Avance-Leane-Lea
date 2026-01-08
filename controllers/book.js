const BookModel = require("../models/book.js");
const { Author, Category } = require("../models/associations");

module.exports = {
  cgetV1: async (req, res, next) => {
  try {
    const books = await BookModel.findAll();
    return res.render(books);
  } catch (error) {
    return next(error);
  }
},

  cgetV2: async (req, res, next) => {
  return module.exports.cget(req, res, next);
},

  cget: async (req, res, next) => {
    const { pagination, filters } = res.getPagination();
    
    const { count, rows: books } = await BookModel.findAndCountAll({
      where: filters,
      include: [
        { model: Author, as: 'author' },
        { model: Category, as: 'category' }
      ],
      ...pagination,
    });
    
    res.setHateoas({ count });
    
    const translatedBooks = books.map((book) => {
      const bookData = book.toJSON();
      bookData.name_translated = res.trad(bookData.name) || bookData.name;
      if (bookData.category) {
        bookData.category.name_translated = res.trad(bookData.category.name) || bookData.category.name;
      }
      return bookData;
    });
    
    res.json(translatedBooks);
    try {
      const { pagination, filters } = res.getPagination();
      
      const { count, rows: books } = await BookModel.findAndCountAll({
        where: filters,
        include: [
          { model: Author, as: 'author' },
          { model: Category, as: 'category' }
        ],
        ...pagination,
      });
      
      // Configurer HATEOAS avec le nombre total d'éléments
      res.setHateoas({ count });
      
      // Traduire les livres et catégories
    const books = await BookModel.findAll({
      include: [
        { model: Author, as: 'author' },
        { model: Category, as: 'category' }
      ]
    });
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
    res.status(201).json(newBook);
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
      res.json(bookData);
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
      res.json(updatedBook);
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