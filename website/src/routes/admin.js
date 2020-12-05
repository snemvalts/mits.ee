const express = require('express');

const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { folder } = req.body;
    return cb(null, `./src/public/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const { folder } = req.body;
    if (fs.existsSync(path.join(`./src/public/${folder}`, file.originalname))) {
      if (req.fileValidationError) {
        req.fileValidationError = `${req.fileValidationError}, "${folder}/${file.originalname}"`;
      } else {
        req.fileValidationError = `"${folder}/${file.originalname}"`;
      }
      return cb(null, false, req.fileValidationError);
    }
    return cb(null, true);
  },
});

const adminController = require('../controllers/adminController');

// eslint-disable-next-line consistent-return
const requiresLogin = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  if (req.session && req.session.userID) {
    return next();
  }
  return res.redirect('/login');
};

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin/layout.hbs';
  next();
});

/* GET admin panel index */
router.get('/', requiresLogin, adminController.indexGet);

/* GET admin panel CMS */
router.get('/cms', requiresLogin, adminController.cmsGet);

/* GET admin panel CMS */
router.get('/cms/field/:id', requiresLogin, adminController.cmsFieldGet);

/* GET admin panel CMS */
router.post('/cms/update-field/:id', requiresLogin, adminController.cmsUpdateFieldPost);



/* GET admin panel events add */
router.get('/events/', requiresLogin, adminController.eventsGet);

/* GET admin panel events add */
router.get('/events/add/', requiresLogin, adminController.eventsAddGet);

/* POST admin panel events add */
router.post('/events/add/', requiresLogin, adminController.eventsAddPost);

/* GET admin panel event */
router.get('/events/:id', requiresLogin, adminController.eventGet);

/* POST admin panel events edit */
router.post('/events/:id/edit/', requiresLogin, adminController.eventEditPost);

/* POST admin panel events delete */
router.post('/events/:id/delete/', requiresLogin, adminController.eventDeletePost);

/* GET admin panel CMS */
router.post('/upload', requiresLogin, upload.array('uploadedImages'), adminController.cmsUploadImages);

/* GET admin panel blog */
router.get('/blogi', requiresLogin, adminController.blogGet);

/* GET admin panel blog new */
router.get('/blogi/uus', requiresLogin, adminController.blogArticleNewGet);

/* POST admin panel blog new */
router.post('/blogi/uus', requiresLogin, adminController.blogArticleNewPost);

/* GET admin panel blog article edit */
router.get('/blogi/:id', requiresLogin, adminController.blogArticleEditGet);

/* POST admin panel blog article edit */
router.post('/blogi/:id', requiresLogin, adminController.blogArticleEditPost);

/* GET admin panel blog article delete */
router.get('/blogi/:id/kustuta', requiresLogin, adminController.blogArticleDeleteGet);

/* POST admin panel blog article delete */
router.post('/blogi/:id/kustuta', requiresLogin, adminController.blogArticleDeletePost);

/* GET admin panel semesters */
router.get('/semestrid', requiresLogin, adminController.semestersGet);

/* POST admin panel new semester */
router.post('/semestrid', requiresLogin, adminController.semestersPost);

/* POST admin panel multiple semesters */
router.post('/semestrid/mitu', requiresLogin, adminController.semestersMultiplePost);

/* GET admin panel semester delete */
router.get('/semestrid/:id/kustuta', requiresLogin, adminController.semesterDeleteGet);

/* POST admin panel semester delete */
router.post('/semestrid/:id/kustuta', requiresLogin, adminController.semesterDeletePost);

/* GET admin panel members */
router.get('/liikmed', requiresLogin, adminController.membersGet);

/* POST admin panel members */
router.post('/liikmed', requiresLogin, adminController.membersPost);

/* POST admin panel multiple members */
router.post('/liikmed/mitu', requiresLogin, adminController.membersMultiplePost);

/* GET admin panel member delete */
router.get('/liikmed/:id/kustuta', requiresLogin, adminController.memberDeleteGet);

/* POST admin panel member delete */
router.post('/liikmed/:id/kustuta', requiresLogin, adminController.memberDeletePost);

/* GET admin panel member edit */
router.get('/liikmed/:id', requiresLogin, adminController.memberEditGet);

/* POST admin panel member edit */
router.post('/liikmed/:id', requiresLogin, adminController.memberEditPost);

/* POST admin panel member photo upload */
router.post('/liikmed/:id/pilt', requiresLogin, upload.single('photo'), adminController.memberPhotoUploadPost);

/* GET admin panel teams */
router.get('/tiimid', requiresLogin, adminController.teamsGet);

/* POST admin panel teams */
router.post('/tiimid', requiresLogin, adminController.teamsPost);

/* POST admin panel multiple teams */
router.post('/tiimid/mitu', requiresLogin, adminController.teamsMultiplePost);

/* GET admin panel team delete */
router.get('/tiimid/:id/kustuta', requiresLogin, adminController.teamDeleteGet);

/* POST admin panel team delete */
router.post('/tiimid/:id/kustuta', requiresLogin, adminController.teamDeletePost);

/* GET admin panel team edit */
router.get('/tiimid/:id', requiresLogin, adminController.teamEditGet);

/* POST admin panel team edit */
router.post('/tiimid/:id', requiresLogin, adminController.teamEditPost);

/* GET admin panel memberships */
router.get('/kuulumised', requiresLogin, adminController.membershipsGet);

/* POST admin panel memberships */
router.post('/kuulumised', requiresLogin, adminController.membershipsPost);

/* POST admin panel multiple memberships */
router.post('/kuulumised/mitu', requiresLogin, adminController.membershipsMultiplePost);

/* GET admin panel memberships delete */
router.get('/kuulumised/:id/kustuta', requiresLogin, adminController.membershipDeleteGet);

/* POST admin panel memberships delete */
router.post('/kuulumised/:id/kustuta', requiresLogin, adminController.membershipDeletePost);

module.exports = router;
