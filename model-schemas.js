// models/News.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  coverImage: {
    type: String,
    required: [true, 'Please add a cover image']
  },
  excerpt: {
    type: String,
    required: [true, 'Please add an excerpt'],
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['News', 'Match Reports', 'Opinion', 'Analysis', 'Interviews', 'Fantasy Tips']
  },
  featured: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  teams: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Team'
  }],
  players: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Player'
  }],
  matches: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Match'
  }],
  tournaments: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Tournament'
  }],
  tags: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Tag'
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
NewsSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('News', NewsSchema);

// models/Match.js
const mongoose = require('mongoose');

const InningsScoreSchema = new mongoose.Schema({
  runs: Number,
  wickets: Number,
  overs: Number,
  declared: {
    type: Boolean,
    default: false
  }
});

const HighlightSchema = new mongoose.Schema({
  title: String,
  description: String,
  timestamp: String,
  videoUrl: String
});

const MatchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  tournament: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tournament',
    required: true
  },
  team1: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  team2: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  matchDate: {
    type: Date,
    required: [true, 'Please add a match date']
  },
  venue: {
    type: mongoose.Schema.ObjectId,
    ref: 'Venue',
    required: true
  },
  status: {
    type: String,
    required: [true, 'Please add a status'],
    enum: ['upcoming', 'live', 'completed', 'abandoned'],
    default: 'upcoming'
  },
  format: {
    type: String,
    required: [true, 'Please add a format'],
    enum: ['Test', 'ODI', 'T20I', 'T20', 'First Class', 'List A', 'Women']
  },
  team1Score: [InningsScoreSchema],
  team2Score: [InningsScoreSchema],
  tossWinner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team'
  },
  tossDecision: {
    type: String,
    enum: ['bat', 'field']
  },
  result: String,
  matchNotes: String,
  playerOfMatch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Player'
  },
  highlights: [HighlightSchema],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate news related to this match
MatchSchema.virtual('news', {
  ref: 'News',
  localField: '_id',
  foreignField: 'matches',
  justOne: false
});

// Continuing models/Match.js
MatchSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Match', MatchSchema);

// models/Player.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const BattingStatsSchema = new mongoose.Schema({
  matches: Number,
  innings: Number,
  runs: Number,
  notOuts: Number,
  highestScore: String,
  average: Number,
  strikeRate: Number,
  hundreds: Number,
  fifties: Number,
  fours: Number,
  sixes: Number
});

const BowlingStatsSchema = new mongoose.Schema({
  matches: Number,
  innings: Number,
  balls: Number,
  runs: Number,
  wickets: Number,
  bestBowling: String,
  average: Number,
  economy: Number,
  strikeRate: Number,
  fiveWickets: Number
});

const ICCRankingSchema = new mongoose.Schema({
  format: {
    type: String,
    enum: ['Test', 'ODI', 'T20I']
  },
  battingRank: Number,
  bowlingRank: Number,
  allRounderRank: Number,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  profileImage: String,
  dateOfBirth: Date,
  nationality: String,
  bio: String,
  battingStyle: String,
  bowlingStyle: String,
  role: {
    type: String,
    enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper', 'Wicket-keeper Batsman']
  },
  teams: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Team'
  }],
  testStats: BattingStatsSchema,
  odiStats: BattingStatsSchema,
  t20iStats: BattingStatsSchema,
  testBowlingStats: BowlingStatsSchema,
  odiBowlingStats: BowlingStatsSchema,
  t20iBowlingStats: BowlingStatsSchema,
  iccRankings: [ICCRankingSchema],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate news related to this player
PlayerSchema.virtual('news', {
  ref: 'News',
  localField: '_id',
  foreignField: 'players',
  justOne: false
});

// Create slug from name
PlayerSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('Player', PlayerSchema);

// models/Team.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  shortName: {
    type: String,
    required: [true, 'Please add a short name'],
    trim: true
  },
  logo: String,
  teamColor: String,
  country: String,
  teamType: {
    type: String,
    enum: ['International', 'Domestic', 'League', 'Women'],
    required: true
  },
  captain: {
    type: mongoose.Schema.ObjectId,
    ref: 'Player'
  },
  coach: String,
  ranking: {
    test: Number,
    odi: Number,
    t20i: Number,
    updatedAt: Date
  },
  description: String,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate players of this team
TeamSchema.virtual('players', {
  ref: 'Player',
  localField: '_id',
  foreignField: 'teams',
  justOne: false
});

// Virtual populate news related to this team
TeamSchema.virtual('news', {
  ref: 'News',
  localField: '_id',
  foreignField: 'teams',
  justOne: false
});

// Create slug from name
TeamSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('Team', TeamSchema);

// models/Tournament.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const TournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  logo: String,
  startDate: Date,
  endDate: Date,
  location: String,
  description: String,
  format: {
    type: String,
    enum: ['Test', 'ODI', 'T20I', 'T20', 'Mixed']
  },
  teams: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Team'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  winner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team'
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate matches in this tournament
TournamentSchema.virtual('matches', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'tournament',
  justOne: false
});

// Create slug from name
TournamentSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('Tournament', TournamentSchema);

// models/Venue.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  capacity: Number,
  description: String,
  image: String,
  established: Number,
  pitchType: String,
  dimensions: {
    length: Number,
    width: Number
  },
  records: [{
    title: String,
    description: String,
    player: {
      type: mongoose.Schema.ObjectId,
      ref: 'Player'
    }
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate matches at this venue
VenueSchema.virtual('matches', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'venue',
  justOne: false
});

// Create slug from name
VenueSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('Venue', VenueSchema);

// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'editor', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  profileImage: String,
  bio: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);

// models/Tag.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from name
TagSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('Tag', TagSchema);

// models/Newsletter.js
const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  active: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);