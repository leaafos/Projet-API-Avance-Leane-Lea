const UserModel = require("../models/user.js");
const getAskedVersion = require("../lib/versioning.js");

module.exports = {
  cget: async (req, res, next) => {
    const apiVersion = getAskedVersion(req);
    res.json(await UserModel.findAll());
    const { pagination, filters } = res.getPagination();
    
    const { count, rows: users } = await UserModel.findAndCountAll({
      where: filters,
      ...pagination,
    });
    
    // Configurer HATEOAS avec le nombre total d'éléments
    res.setHateoas({ count });
    
    res.json(users);
  },
  post: async (req, res, next) => {
    const newData = req.body;
    const newUser = await UserModel.create(newData);
    res.status(201).json(newUser);
  },
  get: async (req, res, next) => {
    const user = await UserModel.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  },
  patch: async (req, res, next) => {
    const [nbUpdated, [updatedUser]] = await UserModel.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });
    if (nbUpdated === 0) {
      res.sendStatus(404);
    } else {
      res.json(updatedUser);
    }
  },
  delete: async (req, res, next) => {
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
  },
  activate: async (req, res, next) => {
    const nbUpdated = await UserModel.update(
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