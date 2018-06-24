/**
 * timeline 表结构
 * */
import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    time:String,
    title:String,
    content:String,
    img:String
});
