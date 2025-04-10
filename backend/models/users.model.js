import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilepic: {
    type: String,
    required: true
  },
  biography: {
    type: String,
    default: '', 
    trim: true   
  }
});

const User = model('User', userSchema);
export default User;
