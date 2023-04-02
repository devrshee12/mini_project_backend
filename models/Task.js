const mongoose = require("mongoose");



const Task = new mongoose.Schema({
    projectId: {
        type: String,
        require: [true, "please provide projectId"]
    },
    name: {
        type: String,
        require: [true, "please provide name"],

    },
    taskType: {
        type: String,
        default: "task"
    },
    status: {
        type: String,
        default: "backlog"
    },
    desc: {
        type: String,
        default: "",
    },
    members:[
        
    ]



    
    


})


module.exports = mongoose.model("Task", Task);