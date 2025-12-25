const { Router } = require("express");
const CategoryController = require("../controllers/category.js");

const router = new Router();

// Collection GET
router.get("/categories", CategoryController.cget);

// Collection POST
router.post("/categories", CategoryController.post);

// Item GET => read
router.get("/categories/:id", CategoryController.get);

// Item PATCH => partial update
router.patch("/categories/:id", CategoryController.patch);

// Item DELETE => delete
router.delete("/categories/:id", CategoryController.delete);

// Item action
router.post("/categories/:id/activate", CategoryController.activate);
module.exports = router;