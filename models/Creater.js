const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const Creater = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "please provide name"],

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
    number: {
        type: Number,
        minlength: 10,
        maxlength: 10,
        require: [true, "please provide phone number"]
    },
    password: {
        type: String,
        require: [true, "please enter password"],
        minlength: 6,
    },
    projects:[

    ],


})



Creater.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


module.exports = mongoose.model("Creater", Creater);