const CategoryModel = require("../models/category.js");
const getAskedVersion = require("../lib/versioning.js");

module.exports = {
  cgetV1: async (req, res, next) => {
  try {
    const apiVersion = getAskedVersion(req);
    const categories = await CategoryModel.findAll();
    return res.render(categories);
  } catch (error) {
    return next(error);
  }
},

  cgetV2: async (req, res, next) => {
  const apiVersion = getAskedVersion(req);
  return module.exports.cget(req, res, next); // v2 = ta version complète actuelle
},

  cget: async (req, res, next) => {
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
    try {
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
      
      res.render(translatedCategories);
    } catch (error) {
      next(error);
    }
  },

  post: async (req, res, next) => {
    try {
      const newData = req.body;
      const newCategory = await CategoryModel.create(newData);
      res.status(201).render(newCategory);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const category = await CategoryModel.findByPk(req.params.id);
      if (category) {
        const categoryData = category.toJSON();
        categoryData.name_translated = res.trad(categoryData.name) || categoryData.name;
        res.render(categoryData);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  },

  patch: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  activate: async (req, res, next) => {
    try {
      const [nbUpdated] = await CategoryModel.update(
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