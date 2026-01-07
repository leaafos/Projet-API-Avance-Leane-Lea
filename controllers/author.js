const AuthorModel = require("../models/author.js");
const getAskedVersion = require("../lib/versioning.js");

module.exports = {
  cget: async (req, res, next) => {
    const apiVersion = getAskedVersion(req);
    res.json(await AuthorModel.findAll());
  },
  post: async (req, res, next) => {
    const newData = req.body;
    const newAuthor = await AuthorModel.create(newData);
    res.status(201).json(newAuthor);
  },
  get: async (req, res, next) => {
    const author = await AuthorModel.findByPk(req.params.id);
    if (author) {
      res.json(author);
    } else {
      res.sendStatus(404);
    }
  },
  patch: async (req, res, next) => {
    const [nbUpdated, [updatedAuthor]] = await AuthorModel.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });
    if (nbUpdated === 0) {
      res.sendStatus(404);
    } else {
      res.json(updatedAuthor);
    }
  },
  delete: async (req, res, next) => {
    const nbDeleted = await AuthorModel.destroy({
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
    const nbUpdated = await AuthorModel.update(
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
