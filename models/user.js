const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   
        firstName: {type:String, minlength:4, maxlength:50, required:true},
        lastName: {type:String, minlength:3, maxlength: 60, required:true},
        role: {type:String, enum: ['admin', 'writer', 'guest']},
        numberOfArticles: {type:Number, default: 0},
        nickname: {type:String}
    
},
{
  timestamps: true
});

UserSchema.methods.fullName = () => {
        return `fName:${this.firstName} lName:${this.lastName} role:${this.role} nickname:${this.nickname}`
}

module.exports = mongoose.model('User', UserSchema);