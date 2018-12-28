import mongoose, { Schema } from 'mongoose';
import Trainer from './trainer';

session = {
  createdBy: Trainer,
  dogs: {
    type: Array
  }
}

export default mongoose.model('UDC', new Schema({
  ...session,

}));

export default mongoose.model('Agility', new Schema({
  ...session,
}));