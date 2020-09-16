const express = require('express');

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'public/media/liikmed/',
  filename: (req, file, callback) => {
    callback(null, `${req.params.id}.jpg`);
  },
  limits: {
    fieldSize: '10KB',
  },
});
const upload = multer({ storage });

const adminController = require('../controllers/adminController');

const requiresLogin = (req, res, next) => {
  if (req.session && req.session.userID) {
    return next();
  }
  res.redirect('/login');
};

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin/layout.hbs';
  req.app.locals.user = req.session.user;
  next();
});

/* GET admin panel index */
router.get('/', requiresLogin, adminController.indexGet);

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
