const mongoose = require('../../server/node_modules/mongoose');

export default mongoose.model('dogs', new Schema({
  name: String
}));