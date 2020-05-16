let mongoose = require('mongoose');
mongoose.connect('mongodb://arjunw7:13bcb0062@ds017155.mlab.com:17155/sasitravels');
let express = require('express')
let Inquiry = mongoose.model('Inquiry');
let router = express.Router();
router.route('/inquiries')
    //gets all inquiries
    .get(function(req, res) {
        Inquiry.find(function(err, inquiries) {
            if (err) {
                return res.send({status: 'failure', inquiries:null, error:err});
            }
            return res.send({status: 'success', inquiries:inquiries, error:err});
        });
    })
    //adds a new inquiry
    .post(function(req, res) {
        let newInquiry = new Inquiry();
        newInquiry.email = req.body.email;
        newInquiry.contact = req.body.contact;
        newInquiry.quantity = req.body.quantity;
        newInquiry.productId = req.body.productId;
        newInquiry.productName = req.body.productName;
        newInquiry.status = req.body.status;
        newInquiry.save(function(err, inquiry) {
            if (err) {
                return res.send({status: 'failure', inquiry:null, error:err});
            }
            return res.send({status: 'success', inquiry:inquiry, error:err});
        });
    })
    //delete all inquiry
    .delete(function(req, res) {
        Inquiry.remove({}, function(err) {
            if (err)
                res.send({status: 'failure', error:err});
            res.json("All inquiries deleted");
        });
    });
router.route('/inquiry/:id')
    //deletes a product
    .delete(function(req, res) {
        Inquiry.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("Inquiry deleted");
        });
    })
    .put(function(req, res){
        Inquiry.findById(req.params.id, function(err, newInquiry){
            if(err)
                res.send({status: 'failure', inquiry:null, error:err});
            newInquiry.email = req.body.email;
            newInquiry.contact = req.body.contact;
            newInquiry.quantity = req.body.quantity;
            newInquiry.productId = req.body.productId;
            newInquiry.status = req.body.status;
            newInquiry.productName = req.body.productName;
            newInquiry.save(function(err, inquiry){
                if(err)
                    res.send({status: 'failure', inquiry:null, error:err});
                res.send({status: 'success', inquiry:inquiry, error:null});
            });
        });
    })
    //get a product by id
    .get(function(req, res) {
        Inquiry.findById(req.params.id, function(err, inquiry) {
            if (err) {
                return res.send({status: 'failure', inquiry:null, error:err});
            }
            return res.send({status: 'success', inquiry:inquiry, error:err});
        });
    });

router.route('/inquiry/user/:contact')
    .get(function(req, res) {
        Inquiry.find({contact: req.params.email}, function(err, inquiries) {
            if (err) {
                return res.send({status: 'failure', inquiries:null, error:err});
            }
            return res.send({status: 'success', inquiries:inquiries, error:err});
        });
    });


module.exports = router;