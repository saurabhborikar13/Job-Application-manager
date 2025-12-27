const User = require('../models/User');

// Register User
const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(201).json({ user: { name: user.name }, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ msg: 'Invalid Credentials' });
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ msg: 'Invalid Credentials' });
  }

  const token = user.createJWT();
  res.status(200).json({ user: { name: user.name }, token });
};

// Update User
const updateUser = async(req, res) => {
  const { name, email, customFields } = req.body;

  if (!email || !name) {
    return res.status(400).json({ msg: 'Please provide all values' });
  }

  const user = await User.findOne({_id: req.user.userId});

  user.name = name;
  user.email = email;
  user.customFields = customFields;

  await user.save();

  const token = user.createJWT();
  res.status(200).json({ user, token });
};

// Get User
const getUser = async(req, res) => {
  const user = await User.findOne({_id: req.user.userId}); 
  
  if (!user) {
    return res.status(401).json({ msg: "User not found" });
  }
  
  res.status(200).json({ 
    user: { 
      name: user.name, 
      email: user.email, 
      customFields: user.customFields 
    } 
  });
}

module.exports = { register, login, updateUser, getUser };