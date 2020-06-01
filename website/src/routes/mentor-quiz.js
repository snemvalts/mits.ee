const express = require("express");
const router = express.Router();

router.post("/calculate-result", (req, res, next) => {
    console.log('asd');
    res.json({
        name: 'Internal server error',
        image: 'error.jpg',
        description: 'Tegelt on päris vastuse arvutamine lihtsalt peidus! ;)'
    });
});

module.exports = router;
