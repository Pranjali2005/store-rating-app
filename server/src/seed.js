require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Store = require('./models/Store');
const Rating = require('./models/Rating');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Store.deleteMany(), Rating.deleteMany()]);

  const password = await bcrypt.hash('Test@1234', 10);

  const users = await User.insertMany([
    { name: 'Rahul Sharma Test User', email: 'user1@example.com', address: '12 MG Road, Kolhapur', password, role: 'USER' },
    { name: 'Priya Patil Demo Customer', email: 'user2@example.com', address: '45 Rajarampuri, Kolhapur', password, role: 'USER' },
    { name: 'Amit Deshmukh Demo Customer', email: 'user3@example.com', address: '8 Shahupuri, Kolhapur', password, role: 'USER' },
  ]);

  const owners = await User.insertMany([
    { name: 'Cafe Owner Demo Account One', email: 'owner1@example.com', address: '3 Station Road, Kolhapur', password, role: 'STORE_OWNER' },
    { name: 'Book Store Owner Demo Account', email: 'owner2@example.com', address: '77 Tarabai Park, Kolhapur', password, role: 'STORE_OWNER' },
    { name: 'Gadget Hub Owner Demo Account', email: 'owner3@example.com', address: '21 Mahadwar Road, Kolhapur', password, role: 'STORE_OWNER' },
  ]);

  const stores = await Store.insertMany([
    { name: 'Brew & Bean Cafe', address: owners[0].address, owner: owners[0]._id },
    { name: 'Page Turner Books', address: owners[1].address, owner: owners[1]._id },
    { name: 'Gadget Hub Electronics', address: owners[2].address, owner: owners[2]._id },
  ]);

  await Rating.insertMany([
    { user: users[0]._id, store: stores[0]._id, value: 5 },
    { user: users[1]._id, store: stores[0]._id, value: 4 },
    { user: users[2]._id, store: stores[0]._id, value: 4 },
    { user: users[0]._id, store: stores[1]._id, value: 3 },
    { user: users[1]._id, store: stores[1]._id, value: 5 },
  ]);

  console.log('Seed complete. All accounts use password: Test@1234');
  await mongoose.disconnect();
})();