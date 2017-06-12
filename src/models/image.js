import mongoose from 'mongoose';

let imageSchema = mongoose.Schema({
  fileName: String
});

imageSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

export default mongoose.model('Image', imageSchema);
