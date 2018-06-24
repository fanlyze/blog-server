import mongoose from 'mongoose'
import crawlerSchema from '../schemas/crawler'
module.exports =  mongoose.model('crawler',crawlerSchema);
