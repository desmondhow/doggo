import mongoose, { Schema } from 'mongoose';

export default mongoose.model('trainers', new Schema({

  name: {
    type: String,
    unique: true,
  }
}));