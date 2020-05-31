let mongoose = require('mongoose');
let productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    brand: String,
    color: String,
    material: String,
    size: String,
    usage: String,
    minimumOrderQuantity: String,
    gender:String,
    deliveryTime: String,
    packagingDetails:String,
    availableToSellQty: Number,
    images: [String],
    reservedQty: String,
    category: String,
    subCategory: String,
    isActive: Boolean,
    status:String,
    sellerId: String,
    sellerName: String,
    isTrending:Boolean,
    createTs: String
});

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: Number,
    username: String,
    password: String,
    isActive: Boolean,
    status:String,
    tinNumber:String,
    gstFileUrl:String,
    gstFileStatus:String,
    eligibleToSell:Boolean,
    role:String,
    token: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});
let sellerSchema = new mongoose.Schema({
    name: String,
    about: String,
    address: String,
    addressState: String,
    addressCity: String,
    isActive: Boolean,
    email:String,
    contact:String,
    paymentModes:[String],
    status:String,
    gstNumber:String,
    gstFile:String,
    createdBy: String,
    createdByUserName:String
});

let inquirySchema = new mongoose.Schema({
    email: String,
    contact:String,
    quantity: String,
    productId: String,
    productName:String,
    status:String
});

mongoose.model('User', userSchema);
mongoose.model('Product', productSchema);
mongoose.model('Seller', sellerSchema)
mongoose.model('Inquiry', inquirySchema)
