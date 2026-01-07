const AuthorModel = require("../models/author.js");

const Papa = require("papaparse");

module.exports = {
  cget: async (req, res, next) => {
    const authors = await AuthorModel.findAll();
    res.render(authors);
const getAskedVersion = require("../lib/versioning.js");

module.exports = {
  cget: async (req, res, next) => {

    const apiVersion = getAskedVersion(req);
    res.json(await AuthorModel.findAll());
    const { pagination, filters } = res.getPagination();
    
    const { count, rows: authors } = await AuthorModel.findAndCountAll({
      where: filters,
      ...pagination,
    });
    
    // Configurer HATEOAS avec le nombre total d'éléments
    res.setHateoas({ count });
    
    res.json(authors);

  },
  post: async (req, res, next) => {
    console.log('req.body:', req.body);
    const newData = req.body;
    const newAuthor = await AuthorModel.create(newData);
    res.render(newAuthor);
  },

  get: async (req, res, next) => {
    const author = await AuthorModel.findByPk(req.params.id);
    if (author) {
      res.render(author);
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
      res.render(updatedAuthor);
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
