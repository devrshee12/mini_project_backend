const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Member = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "please provide name"]
    },
    email: {
        type: String,
        // unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide valid email",
        ],
        require: [true, "please provide email"]
    },
    password: {
        type: String,
        require: [true, "please enter password"],
        minlength: 6,
    },
    setPasswordFlag:{
        type: Boolean,
        default: true
    },
    tasks: [
        
    ]

})



// Member.pre('save', async function () {
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt)
// })

Member.methods.generateAuthToken = function(){
    console.log(this);
    return jwt.sign(
        { type: "member", email: this.email },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30d",
        }
    )
}


module.exports = mongoose.model("Member", Member);