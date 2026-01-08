const { Router } = require("express");
const UserController = require("../controllers/user.js");
const apiVersioning = require("../middlewares/versioningMiddleware.js");

const router = new Router();

// Collection GET
router.get(
  "/users",
  apiVersioning({
    v1: UserController.cgetV1,
    v2: UserController.cgetV2,
    default: UserController.cget,
  })
);

// Collection POST
router.post("/users", UserController.post);

// Item GET => read
router.get("/users/:id", UserController.get);

// Item PATCH => partial update
router.patch("/users/:id", UserController.patch);

// Item DELETE => delete
router.delete("/users/:id", UserController.delete);

// Item action
router.post("/users/:id/activate", UserController.activate);
module.exports = router;