import mongoose from 'mongoose'
import friendlinkSchema from '../schemas/friendlink'

module.exports =  mongoose.model('friendlink',friendlinkSchema);
