let mongoose = require('mongoose');
mongoose.connect('mongodb://arjunw7:13bcb0062@ds017155.mlab.com:17155/sasitravels');
let express = require('express')
let Seller = mongoose.model('Seller');
let router = express.Router();
router.route('/sellers')
    //gets all sellers
    .get(function(req, res) {
        Seller.find( function(err, sellers) {
            if (err) {
                return res.send({status: 'failure', sellers:null, error:err});
            }
            return res.send({status: 'success', sellers:sellers, error:err});
        });
    })
    //adds a new seller
    .post(function(req, res) {
        let newSeller = new Seller();
        newSeller.name = req.body.name;
        newSeller.about = req.body.about;
        newSeller.address = req.body.address;
        newSeller.addressCity = req.body.addressCity;
        newSeller.addressState = req.body.addressState;
        newSeller.isActive = req.body.isActive;
        newSeller.email = req.body.email;
        newSeller.contact = req.body.contact;
        newSeller.paymentModes = req.body.paymentModes;
        newSeller.status = req.body.status;
        newSeller.gstNumber = req.body.gstNumber;
        newSeller.gstFile = req.body.gstFile;
        newSeller.createdBy = req.body.createdBy;

        newSeller.save(function(err, seller) {
            if (err) {
                return res.send({status: 'failure', seller:null, error:err});
            }
            return res.send({status: 'success', seller:seller, error:err});
        });
    })
    //delete all sellers
    .delete(function(req, res) {
        Seller.remove({}, function(err) {
            if (err)
                res.send({status: 'failure', error:err});
            res.json("All sellers deleted");
        });
    });

router.route('/sellers/:id')
    //deletes a seller
    .delete(function(req, res) {
        Seller.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("Sellers deleted");
        });
    })
    .put(function(req, res){
        Seller.findById(req.params.id, function(err, newSeller){
            if(err)
                res.send({status: 'failure', seller:null, error:err});
            newSeller.name = req.body.name;
            newSeller.about = req.body.about;
            newSeller.address = req.body.address;
            newSeller.addressCity = req.body.addressCity;
            newSeller.addressState = req.body.addressState;
            newSeller.isActive = req.body.isActive;
            newSeller.email = req.body.email;
            newSeller.contact = req.body.contact;
            newSeller.paymentModes = req.body.paymentModes;
            newSeller.status = req.body.status;
            newSeller.gstNumber = req.body.gstNumber;
            newSeller.gstFile = req.body.gstFile;
            newSeller.createdBy = req.body.createdBy;
            newSeller.save(function(err, seller){
                if(err)
                    res.send({status: 'failure', seller:null, error:err});
                res.send({status: 'success', seller:seller, error:null});
            });
        });
    })
    //get a seller by id
    .get(function(req, res) {
        Seller.findById(req.params.id, function(err, seller) {
            if (err) {
                return res.send({status: 'failure', seller:null, error:err});
            }
            return res.send({status: 'success', seller:seller, error:err});
        });
    });

router.route('/sellers/email/:email')
    .get(function(req, res) {
        Seller.find({email: req.params.email}, function(err, sellers) {
            if (err) {
                return res.send({status: 'failure', sellers:null, error:err});
            }
            return res.send({status: 'success', sellers:sellers, error:err});
        });
    });

router.route('/sellers/referer/:id')
    .get(function(req, res) {
        Seller.find({createdBy: req.params.id}, function(err, sellers) {
            if (err) {
                return res.send({status: 'failure', sellers:null, error:err});
            }
            return res.send({status: 'success', sellers:sellers, error:err});
        });
    });


module.exports = router;