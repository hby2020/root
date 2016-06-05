'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  archive = require('./archive.js');


var ProjectSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },
  title: {
    type: String
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
  discussion: {
    type: Schema.ObjectId,
    ref: 'Discussion'
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  manager: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  signature: {
    circles: {},
    codes: {}
  },
  color: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'canceled', 'completed', 'archived'],
    default: 'new'
  },
  description: {
    type: String
  },
  //should we maybe have finer grain control on this
  watchers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  groups: {
    type: Array
  },
  comp: {
    type: Array
  },
  room: {
    type: String
  }
});

var starVirtual = ProjectSchema.virtual('star');
starVirtual.get(function() {
  return this._star;
});
starVirtual.set(function(value) {
  this._star = value;
});
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });

/**
 * Validations
 */
ProjectSchema.path('color').validate(function (color) {
  return /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(color);
}, 'Invalid HEX color.');

/**
 * Statics
 */
ProjectSchema.statics.load = function (id, cb) {
  this.findOne({
    _id: id
  }).populate('creator', 'name username').exec(cb);
};

/**
 * middleware
 */
var elasticsearch = require('../controllers/elasticsearch');

ProjectSchema.post('save', function (req, next) {
  elasticsearch.save(this, 'project', this.room);
  next();
});

ProjectSchema.pre('remove', function (next) {
  elasticsearch.delete(this, 'project', this.room, next);
  next();
});

var buildConditions = function(conditions) {
  var ObjectId = mongoose.Types.ObjectId;
  var userId = new ObjectId(conditions.currentUser._id);
  var groups = conditions.currentUser.circles.groups ? conditions.currentUser.circles.groups : [];
  var comp = conditions.currentUser.circles.comp ? conditions.currentUser.circles.comp : [];

  conditions['$or'] = [{
    'creator': userId
  }, {
    'manager': userId
  }, {
    'watchers': userId
  }, {
    $and: [{
      'groups': {
        $in: groups
      }
    }, {
      'comp': {
        $in: comp
      }
    }]
  }];
  delete conditions.currentUser;
  return (conditions);
};

ProjectSchema.pre('find', function(next) {
  if (this._conditions.currentUser) {
    this._conditions = buildConditions(this._conditions)
  }
  console.log('--------------------------------------------Project----------------------------------------------------------')
  console.log(JSON.stringify(this._conditions))
  next();
});	

ProjectSchema.pre('count', function (next) {
	if (this._conditions.currentUser) {
    this._conditions = buildConditions(this._conditions)
  }
	console.log('--------------------------------------------Count-Project---------------------------------------------------------')
	console.log(JSON.stringify(this._conditions))
	next();
});


ProjectSchema.plugin(archive, 'project');

module.exports = mongoose.model('Project', ProjectSchema);
