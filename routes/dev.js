let mongoose = require('mongoose');
mongoose.connect('mongodb://arjunw7:13bcb0062@ds017155.mlab.com:17155/sasitravels');
let express = require('express')
var User = mongoose.model('User');
let router = express.Router();
router.route('/users')
    //gets all products
    .delete(function(req, res) {
        User.remove({}, function(err) {
            if (err)
                res.send(err);
            res.json("All users deleted");
        });
    });

module.exports = router;