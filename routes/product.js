let mongoose = require('mongoose');
mongoose.connect('mongodb://arjunw7:13bcb0062@ds017155.mlab.com:17155/sasitravels');
let express = require('express')
let Product = mongoose.model('Product');
let router = express.Router();
router.route('/products')
    //gets all products
    .get(function(req, res) {
        Product.find(function(err, products) {
            if (err) {
                return res.send({status: 'failure', products:null, error:err});
            }
            return res.send({status: 'success', products:products, error:err});
        });
    })
    //adds a new product
    .post(function(req, res) {
        let newProduct = new Product();
        newProduct.name = req.body.name;
        newProduct.description = req.body.description;
        newProduct.price = req.body.price;
        newProduct.brand = req.body.brand;
        newProduct.color = req.body.color;
        newProduct.material = req.body.material;
        newProduct.size = req.body.size;
        newProduct.usage = req.body.usage;
        newProduct.minimumOrderQuantity = req.body.minimumOrderQuantity;
        newProduct.gender = req.body.gender;
        newProduct.deliveryTime = req.body.deliveryTime;
        newProduct.packagingDetails = req.body.packagingDetails;
        newProduct.availableToSellQty = req.body.availableToSellQty;
        newProduct.images = req.body.images;
        newProduct.reservedQty = req.body.reservedQty;
        newProduct.category = req.body.category;
        newProduct.subCategory = req.body.subCategory;
        newProduct.isActive = req.body.isActive;
        newProduct.status = req.body.status;
        newProduct.sellerId = req.body.sellerId;
        newProduct.sellerName = req.body.sellerName;
        newProduct.isTrending = req.body.isTrending;
        newProduct.createTs = req.body.createTs;
        newProduct.save(function(err, newProduct) {
            if (err) {
                return res.send({status: 'failure', products:null, error:err});
            }
            return res.send({status: 'success', products:newProduct, error:err});
        });
    })
    //delete all products
    .delete(function(req, res) {
        Product.remove({}, function(err) {
            if (err)
                res.send({status: 'failure', error:err});
            res.json("All products deleted");
        });
    });
router.route('/product/:id')
    //deletes a product
    .delete(function(req, res) {
        Product.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("Product deleted");
        });
    })
    .put(function(req, res){
        Product.findById(req.params.id, function(err, newProduct){
            if(err)
                res.send({status: 'failure', product:null, error:err});
            newProduct.name = req.body.name;
            newProduct.description = req.body.description;
            newProduct.price = req.body.price;
            newProduct.brand = req.body.brand;
            newProduct.color = req.body.color;
            newProduct.material = req.body.material;
            newProduct.size = req.body.size;
            newProduct.usage = req.body.usage;
            newProduct.minimumOrderQuantity = req.body.minimumOrderQuantity;
            newProduct.gender = req.body.gender;
            newProduct.deliveryTime = req.body.deliveryTime;
            newProduct.packagingDetails = req.body.packagingDetails;
            newProduct.availableToSellQty = req.body.availableToSellQty;
            newProduct.images = req.body.images;
            newProduct.reservedQty = req.body.reservedQty;
            newProduct.category = req.body.category;
            newProduct.subCategory = req.body.subCategory;
            newProduct.isActive = req.body.isActive;
            newProduct.status = req.body.status;
            newProduct.sellerId = req.body.sellerId;
            newProduct.sellerName = req.body.sellerName;
            newProduct.isTrending = req.body.isTrending;
            newProduct.createTs = req.body.createTs;

            newProduct.save(function(err, savedProduct){
                if(err)
                    res.send({status: 'failure', products:null, error:err});
                res.send({status: 'success', products:savedProduct, error:null});
            });
        });
    })
    //get a product by id
    .get(function(req, res) {
        Product.findById(req.params.id, function(err, product) {
            if (err) {
                return res.send({status: 'failure', products:null, error:err});
            }
            return res.send({status: 'success', products:product, error:err});
        });
    });

router.route('/products/category/:category')
    .get(function(req, res) {
        Product.find({category: req.params.category}, function(err, product) {
            if (err) {
                return res.send({status: 'failure', products:null, error:err});
            }
            return res.send({status: 'success', products:product, error:err});
        });
    });

router.route('/products/sellerId/:sellerId')
    .get(function(req, res) {
        Product.find({sellerId: req.params.sellerId}, function(err, product) {
            if (err) {
                return res.send({status: 'failure', products:null, error:err});
            }
            return res.send({status: 'success', products:product, error:err});
        });
    });

router.route('/products/trending')
    .get(function(req, res) {
        Product.find({isTrending: true}, function(err, product) {
            if (err) {
                return res.send({status: 'failure', products:null, error:err});
            }
            return res.send({status: 'success', products:product, error:err});
        });
    });

module.exports = router;