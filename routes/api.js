var mongoose = require('mongoose');
mongoose.connect('mongodb://arjunw7:13bcb0062@ds017155.mlab.com:17155/sasitravels');
var express = require('express')
var Company = mongoose.model('Company');
var router = express.Router();
router.route('/company')
    //gets all users
    .get(function(req, res) {
        console.log(Company)
        Company.find(function(err, user) {
            if (err) {
                return res.writeHead(500, err);
            }
            return res.send(user);
        });
    })
    //adds a new item to menu
    .post(function(req, res) {
        var newCompany = new Company();
        newCompany.companyName = req.body.companyName;
        newCompany.salaryCut = req.body.salaryCut;
        newCompany.hiringStatus = req.body.hiringStatus;
        newCompany.industry = req.body.industry;
        newCompany.city = req.body.city;
        newCompany.workCulture = req.body.workCulture;
        newCompany.createTs = req.body.createTs;
        newCompany.website = req.body.website;
        newCompany.campusHiring = req.body.campusHiring;
        newCompany.hiringLink = req.body.hiringLink;
        newCompany.save(function(err, newCompany) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(JSON.stringify(newCompany));
        });
    })
    .delete(function(req, res) {
        Company.remove({}, function(err) {
            if (err)
                res.send(err);
            res.json("company deleted");
        });
    });

router.route('/company/:companyName')
    //deletes a user
    .delete(function(req, res) {
        Company.remove({
            companyName: req.params.companyName
        }, function(err) {
            if (err)
                res.send(err);
            res.json("Company deleted");
        });
    })
    .get(function(req, res) {
        Company.find({ companyName: req.params.companyName }, function(err, company) {
            if (err) {
                return res.writeHead(500, err);
            }
            return res.send(company);
        });
    });

module.exports = router;