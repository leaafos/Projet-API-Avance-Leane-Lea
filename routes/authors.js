const { Router } = require("express");
const AuthorController = require("../controllers/author.js");
const apiVersioning = require("../middlewares/versioningMiddleware.js");

const router = new Router();

// Collection GET
router.get(
  "/authors",
  apiVersioning({
    v1: AuthorController.cgetV1,
    v2: AuthorController.cgetV2,
    default: AuthorController.cget,
  })
);

// Collection POST
router.post("/authors", AuthorController.post);

// Item GET => read
router.get("/authors/:id", AuthorController.get);

// Item PATCH => partial update
router.patch("/authors/:id", AuthorController.patch);

// Item DELETE => delete
router.delete("/authors/:id", AuthorController.delete);

// Item action
router.post("/authors/:id/activate", AuthorController.activate);
module.exports = router;