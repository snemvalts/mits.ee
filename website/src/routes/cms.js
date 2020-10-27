import express from 'express';
import getValues from '../controllers/cmsController';

const router = express.Router();

/* GET blog posts */
router.get('/values', getValues);

module.exports = router;
