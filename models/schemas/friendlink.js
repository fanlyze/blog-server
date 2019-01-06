/**
 * interact 表结构
 * */
import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    sitename:String,
    link:String,
    describe:String,
    img:String
});
