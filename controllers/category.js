const CategoryModel = require("../models/category.js");
const getAskedVersion = require("../lib/versioning.js");

module.exports = {
  cget: async (req, res, next) => {
    const apiVersion = getAskedVersion(req);
    const categories = await CategoryModel.findAll();
    res.render(categories);
    const { pagination, filters } = res.getPagination();
    
    const { count, rows: categories } = await CategoryModel.findAndCountAll({
      where: filters,
      ...pagination,
    });
    
    res.setHateoas({ count });
    
    const translatedCategories = categories.map((category) => {
      const categoryData = category.toJSON();
      categoryData.name_translated = res.trad(categoryData.name) || categoryData.name;
      return categoryData;
    });
    res.json(translatedCategories);
  },
  post: async (req, res, next) => {
    const newData = req.body;
    const newCategory = await CategoryModel.create(newData);
    res.render(newCategory);
    res.status(201).json(newCategory);
  },
  get: async (req, res, next) => {
    const category = await CategoryModel.findByPk(req.params.id);
    if (category) {
      const categoryData = category.toJSON();
      categoryData.name_translated = res.trad(categoryData.name) || categoryData.name;
      res.render(categoryData);
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
      res.render(updatedCategory);
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