import mongoose from 'mongoose'
import interactSchema from './schemas/interact'

module.exports =  mongoose.model('interact',interactSchema);
