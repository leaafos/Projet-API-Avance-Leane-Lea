const AuthorModel = require("../models/author.js");
const getAskedVersion = require("../lib/versioning.js");

module.exports = {
  cget: async (req, res, next) => {
    try {
      const { pagination, filters } = res.getPagination();
      
      const { count, rows: authors } = await AuthorModel.findAndCountAll({
        where: filters,
        ...pagination,
      });
      
      res.setHateoas({ count });
      
      res.render(authors);
    } catch (error) {
      next(error);
    }
  },
  
  post: async (req, res, next) => {
    try {
      const newData = req.body;
      const newAuthor = await AuthorModel.create(newData);
      res.status(201).render(newAuthor);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const author = await AuthorModel.findByPk(req.params.id);
      if (author) {
        res.json(author);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  },
  
  patch: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },
  
  delete: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },
  
  activate: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },
};
