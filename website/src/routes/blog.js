const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");

/* GET blog posts */
router.get("/", blogController.blogGet);

module.exports = router;
