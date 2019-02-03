const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const requiresLogin = (req, res, next) => {
    if (req.session && req.session.userID) {
        return next();
    }
    res.redirect("/login");
};

router.all("/*", (req, res, next) => {
    req.app.locals.layout = "admin/layout.hbs";
    req.app.locals.user = req.session.user;
    next();
});

/* GET admin panel index */
router.get("/", requiresLogin, adminController.indexGet);

/* GET admin panel blog */
router.get("/blog", requiresLogin, adminController.blogGet);

/* GET admin panel blog new */
router.get("/blog/new", requiresLogin, adminController.blogArticleNewGet);

/* POST admin panel blog new */
router.post("/blog/new", requiresLogin, adminController.blogArticleNewPost);

/* GET admin panel blog article edit */
router.get("/blog/:id", requiresLogin, adminController.blogArticleEditGet);

/* POST admin panel blog article edit */
router.post("/blog/:id", requiresLogin, adminController.blogArticleEditPost);

/* GET admin panel blog article delete */
router.get("/blog/:id/delete", requiresLogin, adminController.blogArticleDeleteGet);

/* POST admin panel blog article delete */
router.post("/blog/:id/delete", requiresLogin, adminController.blogArticleDeletePost);

module.exports = router;