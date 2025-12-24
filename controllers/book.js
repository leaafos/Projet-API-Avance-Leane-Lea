const BookModel = require("../models/book.js");

module.exports = {
  cget: async (req, res, next) => {
    res.json(await BookModel.findAll());
  },
  post: async (req, res, next) => {
    const newData = req.body;
    const newBook = await BookModel.create(newData);
    res.status(201).json(newBook);
  },
  get: async (req, res, next) => {
    const book = await BookModel.findByPk(req.params.id);
    if (book) {
      res.json(book);
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