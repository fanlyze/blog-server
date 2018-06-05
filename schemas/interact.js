/**
 * interact 表结构
 * */
import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    visitor:String,
    comment:String,
    parent:String,
    time:String,
    type:String
});
