const Creater = require("../models/Creater");
const Project = require("../models/Project");


const getUser = (req, res) => {
    
    // console.log("req.user : ", req.user.type);
    // console.log("req.user : ", req.user.email);

    //currect till now
    const {type, email} = req.user;
    res.json({type, email});
}


const createProject = async(req, res) => {

    const {type, email} = req.user;
    const {name, category, desc} = req.body;

    if(type !== "creater"){
        return res.json({"valid": false})
    }

    try{
        const user = await Creater.findOne({email});

        if(!user){
            return res.json({"valid":  false});
        }

        
        const project = await Project.create({name, category, desc, creaters: [user.email], members: [], tasks: []});
        const tempProjects = [...user.projects, project];
        // console.log(project);
        user.projects = tempProjects;
        await user.save();



        res.json({"valid" : true, creater: user, project});
        
    }
    catch(err){
        console.log(err);
    }


}



module.exports = {
    getUser,
    createProject
}