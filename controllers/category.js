const CategoryModel = require("../models/category.js");

module.exports = {
  cget: async (req, res, next) => {
    res.json(await CategoryModel.findAll());
  },
  post: async (req, res, next) => {
    const newData = req.body;
    const newCategory = await CategoryModel.create(newData);
    res.status(201).json(newCategory);
  },
  get: async (req, res, next) => {
    const category = await CategoryModel.findByPk(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.sendStatus(404);
    }
  },
  patch: async (req, res, next) => {
    const [nbUpdated, [updatedCategory]] = await CategoryModel.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });
    if (nbUpdated === 0) {
      res.sendStatus(404);
    } else {
      res.json(updatedCategory);
    }
  },
  delete: async (req, res, next) => {
    const nbDeleted = await CategoryModel.destroy({
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
    const nbUpdated = await CategoryModel.update(
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