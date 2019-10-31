const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a coure title']
  },
  description: {
    type: String,
    required: [true, 'Please add a coure description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tution: {
    type: Number
    // required: [true, 'Please add a tution cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: true
  }
});

// Static method to get avg of course tutuion
// Bootcamp-ში რომ გამოჩნდეს კონკრეტულ ID-ზე კურსთა საშუალო თანხა
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  // console.log('Calculating avg cost ...'.blue);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        // averageCost: {$avg: $tution}
        averageCost: { $avg: 100 }
      }
    }
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (error) {
    console.log(error);
  }
  console.log(obj);
};

// Call getAverageCost after save
CourseSchema.post('save', function() {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function() {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
