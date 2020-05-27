let mongoose = require('mongoose');
mongoose.connect('mongodb://arjunw7:13bcb0062@ds017155.mlab.com:17155/sasitravels');
let express = require('express')
let User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
let router = express.Router();
router.route('/customers')
    //gets all customers
    .get(function(req, res) {
        User.find({role: "CUSTOMER"}, function(err, users) {
            if (err) {
                return res.send({status: 'failure', customers:null, error:err});
            }
            return res.send({status: 'success', customers:users, error:null});
        });
    })
    .post(function (req, res) {
        let user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.contact = req.body.contact;
        user.username = req.body.username;
        user.password = createHash(req.body.password);
        user.tinNumber = req.body.tinNumber;
        user.gstFileUrl = req.body.gstFileUrl;
        user.gstFileStatus = req.body.gstFileStatus;
        user.isActive = req.body.isActive;
        user.eligibleToSell = req.body.eligibleToSell;
        user.status = req.body.status;
        user.role = req.body.role;

        user.save(function(err, savedUser){
            if(err)
                res.send({status: 'failure', customers:null, error:err});
            res.send({status: 'success', customer:savedUser, error:null});
        });
    })

router.route('/customer/:id')
    .put(function(req, res){
        User.findById(req.params.id, function(err, user){
            if(err)
                res.send({status: 'failure', customers:null, error:err});
            user.name = req.body.name;
            user.email = req.body.email;
            user.contact = req.body.contact;
            user.username = req.body.username;
            user.tinNumber = req.body.tinNumber;
            user.gstFileUrl = req.body.gstFileUrl;
            user.gstFileStatus = req.body.gstFileStatus;
            user.isActive = req.body.isActive;
            user.eligibleToSell = req.body.eligibleToSell;
            user.status = req.body.status;
            user.role = req.body.role;

            user.save(function(err, savedUser){
                if(err)
                    res.send({status: 'failure', customers:null, error:err});
                res.send({status: 'success', customer:savedUser, error:null});
            });
        });
    })
    //deletes a customer
    .delete(function(req, res) {
        User.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send({status: 'failure', error:err});
            res.send({status: 'success', message:"Customer deleted"});
        });
    })
    //get a customer by id
    .get(function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if (err) {
                res.send({status: 'failure', customer:null, error:err});
            }
            res.send({status: 'success', customer:user, error:null});
        });
    });

router.route('/customers/pendingSellers')
    //get pending seller
    .get(function(req, res) {
        User.find({"status": "SELLER_PENDING"}, function(err, user) {
            if (err) {
                res.send({status: 'failure', pendingSellers:null, error:err});
            }
            res.send({status: 'success', pendingSellers:user, error:null});
        });
    });

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = router;