import mongoose from 'mongoose'
import timelineSchema from '../schemas/timeline'

module.exports =  mongoose.model('timeline',timelineSchema);
