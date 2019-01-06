/**
 * interact 表结构
 * */
import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    visitor:String,
    comment:String,
    parent:String,
    img:String,
    time:String,
    type:String,
    aId:String
});
