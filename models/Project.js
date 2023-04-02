const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Project = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "please provide name for your project"],

    },
    category: {
        type: String,
        require: [true, "please provide category for your project"]
    },
    desc: {
        type: String,
        default: ""
    },
    creaters: [

    ],
    members:[

    ],
    tasks:[

    ]




})




module.exports = mongoose.model("Project", Project);