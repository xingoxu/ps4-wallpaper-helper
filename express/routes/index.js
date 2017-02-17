var router = require('express').Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    req.header('user-agent').indexOf('PlayStation 4') >= 0 ?
    res.render('index-ps4'):
    res.render('index');
});

module.exports = router;
