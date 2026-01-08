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
    try {
      const { pagination, filters } = res.getPagination();

      const { count, rows: books } = await BookModel.findAndCountAll({
        where: filters,
        include: [
          { model: Author, as: "author" },
          { model: Category, as: "category" },
        ],
        ...pagination,
      });

      // HATEOAS avec le nombre total d'éléments
      res.setHateoas({ count });

      // Traduction livres + catégories
      const translatedBooks = books.map((book) => {
        const bookData = book.toJSON();

        bookData.name_translated = res.trad(bookData.name) || bookData.name;

        if (bookData.category) {
          bookData.category.name_translated =
            res.trad(bookData.category.name) || bookData.category.name;
        }

        return bookData;
      });

      return res.json(translatedBooks);
    } catch (error) {
      return next(error);
    }
  },

  post: async (req, res, next) => {
    try {
      const newData = req.body;
      const newBook = await BookModel.create(newData);
      return res.status(201).json(newBook);
    } catch (error) {
      return next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const book = await BookModel.findByPk(req.params.id, {
        include: [
          { model: Author, as: "author" },
          { model: Category, as: "category" },
        ],
      });

      if (!book) return res.sendStatus(404);

      const bookData = book.toJSON();
      bookData.name_translated = res.trad(bookData.name) || bookData.name;

      if (bookData.category) {
        bookData.category.name_translated =
          res.trad(bookData.category.name) || bookData.category.name;
      }

      return res.json(bookData);
    } catch (error) {
      return next(error);
    }
  },

  patch: async (req, res, next) => {
    try {
      const [nbUpdated, [updatedBook]] = await BookModel.update(req.body, {
        where: { id: req.params.id },
        returning: true,
      });

      if (nbUpdated === 0) return res.sendStatus(404);
      return res.json(updatedBook);
    } catch (error) {
      return next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const nbDeleted = await BookModel.destroy({
        where: { id: req.params.id },
      });

      if (nbDeleted === 0) return res.sendStatus(404);
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  },

  activate: async (req, res, next) => {
    try {
      const [nbUpdated] = await BookModel.update(
        { activated: true },
        { where: { id: req.params.id } }
      );

      if (nbUpdated === 0) return res.sendStatus(404);
      return res.sendStatus(200);
    } catch (error) {
      return next(error);
    }
  },
};
