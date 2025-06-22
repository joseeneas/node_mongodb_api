require('dotenv').config();
const mongoose = require('mongoose');
const faker    = require('faker');
MONGODB_URI    = 'mongodb://localhost:27017/mydatabase';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()   => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const User = mongoose.model('User', userSchema);

async function seedUsers() {
  await User.deleteMany({});
  const users = [];

  for (let i = 0; i < 50; i++) {
    users.push({
      name  : faker.name.findName(),
      email : faker.internet.email(),
      age   : Math.floor(Math.random() * 50) + 18 // age between 18 and 67
    });
  }
  await User.insertMany(users);
  console.log('Inserted 50 users');
  mongoose.connection.close();
}
seedUsers();