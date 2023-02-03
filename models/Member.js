const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Member = new mongoose.Schema({
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



Member.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


module.exports = mongoose.model("Member", Member);