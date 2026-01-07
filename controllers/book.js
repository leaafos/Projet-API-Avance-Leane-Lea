const BookModel = require("../models/book.js");
const { Author, Category } = require("../models/associations");
const getAskedVersion = require("../lib/versioning.js");

module.exports = {
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
      const translatedBooks = books.map((book) => {
        const bookData = book.toJSON();
        bookData.name_translated = res.trad(bookData.name) || bookData.name;
        if (bookData.category) {
          bookData.category.name_translated = res.trad(bookData.category.name) || bookData.category.name;
        }
        return bookData;
      });
      
      res.render(translatedBooks);
    } catch (error) {
      next(error);
    }
  },

  post: async (req, res, next) => {
    try {
      const newData = req.body;
      const newBook = await BookModel.create(newData);
      
      // Inclure les relations pour la réponse
      const bookWithRelations = await BookModel.findByPk(newBook.id, {
        include: [
          { model: Author, as: 'author' },
          { model: Category, as: 'category' }
        ]
      });
      
      res.status(201).render(bookWithRelations);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  patch: async (req, res, next) => {
    try {
      const [nbUpdated, [updatedBook]] = await BookModel.update(req.body, {
        where: {
          id: req.params.id,
        },
        returning: true,
      });
      
      if (nbUpdated === 0) {
        res.sendStatus(404);
      } else {
        // Inclure les relations pour la réponse
        const bookWithRelations = await BookModel.findByPk(updatedBook.id, {
          include: [
            { model: Author, as: 'author' },
            { model: Category, as: 'category' }
          ]
        });
        res.render(bookWithRelations);
      }
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  activate: async (req, res, next) => {
    try {
      const [nbUpdated] = await BookModel.update(
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
    } catch (error) {
      next(error);
    }
  },
};