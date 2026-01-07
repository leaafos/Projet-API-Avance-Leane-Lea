const UserModel = require("../models/user.js");
const getAskedVersion = require("../lib/versioning.js");

module.exports = {
  cget: async (req, res, next) => {
    try {
      const { pagination, filters } = res.getPagination();
      
      const { count, rows: users } = await UserModel.findAndCountAll({
        where: filters,
        ...pagination,
      });
      
      // Configurer HATEOAS avec le nombre total d'éléments
      res.setHateoas({ count });
      
      res.render(users);
    } catch (error) {
      next(error);
    }
  },

  post: async (req, res, next) => {
    try {
      const newData = req.body;
      const newUser = await UserModel.create(newData);
      res.status(201).render(newUser);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const user = await UserModel.findByPk(req.params.id);
      if (user) {
        res.render(user);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  },

  patch: async (req, res, next) => {
    try {
      const user = await UserModel.findByPk(req.params.id);
      if (!user) {
        return res.sendStatus(404);
      }

      Object.assign(user, req.body);
      await user.save();

      res.render(user);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const nbDeleted = await UserModel.destroy({
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
      const [nbUpdated] = await UserModel.update(
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