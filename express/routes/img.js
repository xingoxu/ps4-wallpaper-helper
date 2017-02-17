let router = require('express').Router(),
    imageController = require('../imageController');

/* GET users listing. */
router.get('/', function (req, res, next) {
    imageController.getImageUrl()
        .then(url => {
            res.sendFile(url);
        })

});
router.post('/', function (req, res, next) {
    imageController.setImageUrl(req.body.path)
        .then(() => {
            res.json({});
        })
        .catch(() => {
            res.status(400).json({
                message: "Image not exists!"
            })
        });
});

module.exports = router;
