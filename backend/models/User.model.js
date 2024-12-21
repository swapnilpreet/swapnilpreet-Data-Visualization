const mongoose  = require("mongoose");



const UserSchema = new mongoose.Schema({
    name:{
        type: 'String',
        required: true,
    },
    email:{
        type: 'String',
        required: true,
        trim: true,
    },
    password:{
        type: 'String',
        required: true,
    }
});

const UserModel = mongoose.model('Userdata',UserSchema);

module.exports = UserModel;