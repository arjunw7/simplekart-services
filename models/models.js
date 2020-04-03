var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var companySchema = new mongoose.Schema({
    companyName: String,
    salaryCut: String,
    hiringStatus: String,
    industry: String,
    city: String,
    workCulture: String,
    createTs: String,
    website: String,
    campusHiring: String,
    hiringLink: String
});


mongoose.model('Company', companySchema);