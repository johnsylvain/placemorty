import mongoose from 'mongoose';

let analyticSchema = new mongoose.Schema({
  hits: { type: Number, default: 0 },
  created_at: Date
});

analyticSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc, callback) {
  const self = this;
  self.findOne(condition, (err, result) => {
    return result
      ? callback(err, result)
      : self.create(doc, (err, result) => {
        return callback(err, result);
      });
  });
};

export default mongoose.model('Analytic', analyticSchema);
