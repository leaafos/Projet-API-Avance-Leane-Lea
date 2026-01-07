const { Router } = require("express");
const BookController = require("../controllers/book.js");
const apiVersioning = require("../middlewares/versioningMiddleware.js");

const router = new Router();

// Collection GET
router.get("/books",
    apiVersioning({
        v1: BookController.cgetV1,
        v2: BookController.cgetV2,
        default: BookController.cget
    })
);

// Collection POST
router.post("/books", BookController.post);

// Item GET => read
router.get("/books/:id", BookController.get);

// Item PATCH => partial update
router.patch("/books/:id", BookController.patch);

// Item DELETE => delete
router.delete("/books/:id", BookController.delete);

// Item action
router.post("/books/:id/activate", BookController.activate);
module.exports = router;