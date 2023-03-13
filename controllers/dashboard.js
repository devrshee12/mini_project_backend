const Creater = require("../models/Creater");
const Project = require("../models/Project");


const getUser = async(req, res) => {
    
    // console.log("req.user : ", req.user.type);
    // console.log("req.user : ", req.user.email);
    
    //currect till now
    const {type, email} = req.user;
    console.log("type: " + type);
    console.log("email: " + email);
    // res.json({type, email});
    try{
        if(type === "creater"){
            console.log("1");
            const user = await Creater.findOne({email});


            if(!user){
                return res.status(401).json({"valid": false})
            }
            // const projects = user.projects;
            console.log("2");
            console.log(user);
            // user[0].projects.map((project) => {
            //     console.log(project.name);
            // })
            // projects: user.projects.length ? user.project : []
            return res.status(201).json({valid: true, projects: user.projects});



            

        }
        

        if(type === "member"){
            console.log("3");
        }

    }
    catch(err){
        console.log("4")
        console.log(err);
    }
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

        
        const project = await Project.create({name, category, desc, creaters: [{email: user.email, name: user.name}], members: [], tasks: []});
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