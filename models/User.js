const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    //schema
});

mongoose.model('users', UserSchema);