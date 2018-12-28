import mongoose, { Schema } from 'mongoose';

export default mongoose.model('dogs', new Schema({
  name: String
}));