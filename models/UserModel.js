const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    name:{ type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    isAdmin:{ type:Boolean, required:true, default:false },
    picture:{ type:String, required:true, 
        default:'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    }
})

UserSchema.methods.matchPassword = async (enteredPassword, userPassword) => {
    return bcrypt.compareSync(enteredPassword, userPassword)
}

UserSchema.pre('save', function (next) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    // Continue with the save operation
    next();
  });

module.exports = mongoose.model("User",UserSchema)