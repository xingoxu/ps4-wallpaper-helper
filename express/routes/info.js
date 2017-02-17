/**
 * Created by xingo on 2017/02/17.
 */
var router = require('express').Router();

/* GET home page. */
router.post('/', function (req, res, next) {
    console.log(req.header('user-agent'))
    console.log(req.body);
    res.json({});
});

module.exports = router;