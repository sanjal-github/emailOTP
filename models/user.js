const  mongoose  = require("mongoose");
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    name:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    dateOfBirth:
    {
        type:Date,
        required:true
    },
    verified:
    {
        type:Boolean,
        default:false
    }
})

userSchema.pre("save",async function(next){
    if(this.isModified(this.password))
    {
        const saltRounds = 10 
        this.password= await bcrypt.hash(this.password,saltRounds);
    }
    next();
})

const userSch = new mongoose.model("Users",userSchema);


module.exports = userSch;

