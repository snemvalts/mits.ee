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
router.get("/blogi", requiresLogin, adminController.blogGet);

/* GET admin panel blog new */
router.get("/blogi/uus", requiresLogin, adminController.blogArticleNewGet);

/* POST admin panel blog new */
router.post("/blogi/uus", requiresLogin, adminController.blogArticleNewPost);

/* GET admin panel blog article edit */
router.get("/blogi/:id", requiresLogin, adminController.blogArticleEditGet);

/* POST admin panel blog article edit */
router.post("/blogi/:id", requiresLogin, adminController.blogArticleEditPost);

/* GET admin panel blog article delete */
router.get("/blogi/:id/kustuta", requiresLogin, adminController.blogArticleDeleteGet);

/* POST admin panel blog article delete */
router.post("/blogi/:id/kustuta", requiresLogin, adminController.blogArticleDeletePost);


/* GET admin panel semesters */
router.get("/semestrid", requiresLogin, adminController.semestersGet);

/* POST admin panel new semester */
router.post("/semestrid", requiresLogin, adminController.semestersPost);

/* GET admin panel semester delete */
router.get("/semestrid/:id/kustuta", requiresLogin, adminController.semesterDeleteGet);

/* POST admin panel semester delete */
router.post("/semestrid/:id/kustuta", requiresLogin, adminController.semesterDeletePost);

module.exports = router;