const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/user');
const Exercise = require('./models/exercise');

const app = express();

// Enable CORS
app.use(cors({ optionsSuccessStatus: 200 }));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Index route
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Create a new user
app.post("/api/users", async (req, res) => {
  const username = req.body.username;
  const user = new User({ username });
  try {
    await user.save();
    res.json({ username: user.username, _id: user._id });
  } catch (err) {
    res.status(500).json('Server Error');
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json('Server Error');
  }
});

// Add exercise
app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const exerciseDate = date ? new Date(date) : new Date();
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json('Unknown userId');
    }

    const exercise = new Exercise({
      userId: _id,
      description,
      duration,
      date: exerciseDate
    });

    await exercise.save();
    res.json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
      _id: user._id
    });
  } catch (err) {
    res.status(500).json('Server Error');
  }
});

// Get exercise log
app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json('Unknown userId');
    }

    let dateFilter = {};
    if (from) dateFilter['$gte'] = new Date(from);
    if (to) dateFilter['$lte'] = new Date(to);

    let filter = { userId: _id };
    if (from || to) filter.date = dateFilter;

    const exercises = await Exercise.find(filter).limit(+limit || 500);

    res.json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log: exercises.map(e => ({
        description: e.description,
        duration: e.duration,
        date: e.date.toDateString()
      }))
    });
  } catch (err) {
    res.status(500).json('Server Error');
  }
});

// Listen for requests
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
