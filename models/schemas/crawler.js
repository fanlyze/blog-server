/**
 * crawler 表结构
 * */
import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    sitename:String,
    url:String,
    title:String,
    href:String,
    time:String,
    index:String
});
