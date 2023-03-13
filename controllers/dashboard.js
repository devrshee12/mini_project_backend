const Creater = require("../models/Creater");
const Member = require("../models/Member");
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

const createMember = async(req, res) => {
    console.log("create member");
    const {type, email} = req.user;
    const {memberEmail, memberName, memberPassword, projectId} = req.body;
    if(type === "creater"){
        try{
            // member added to member model
            const member = await Member.create({name: memberName, email: memberEmail, password: memberPassword});
            // add member to project model
            const project = await Project.findOne({_id: projectId});
            const tempMembers = [...project.members, member];
            project.members = tempMembers;
            await project.save();
            
            // update project to creater model ... remaining

            const creater = await Creater.findOne({email});
            const itemCreater = creater.projects.map((item) => {
                // console.log("item id is : " + item._id);
                // console.log("project id is : " + projectId);
                if(item._id == projectId){
                    console.log("under id");
                    const newItem = {...item, members: [...item.members, member]};
                    return newItem;
                }
                return item;
            })
            // console.log("after update");
            // console.log(itemCreater);

            creater.projects = itemCreater;

            await creater.save();

            

            return res.status(201).json({"valid": true, "status": "member created", "member": member, project, creater});
        }
        catch(err){
            console.log(err);
            return res.status(401).json({"valid": false, "status": "something went wrong"});
        }
    }
    else{
        return res.status(401).json({"valid": false, "status": "you are not allowded to create member"})
    }

}


const getMembers = async(req, res) => {
    const {type} = req.user;
    const {projectId} = req.body;
    console.log("project id : " + projectId);
    try{

        if(type === "creater"){
            const project = await Project.findOne({_id:projectId});
            if(!project){
                return res.status(401).json({valid: false, "status": "something went wrong"});
            }


            
            return res.status(201).json({valid: true, status: "success", members: project.members})
        }
        else{
            return res.status(401).json({valid: false, "status": "something went wrong"});
        }

    }
    catch(err){
        console.log(err);
    }
}


module.exports = {
    getUser,
    createProject,
    createMember,
    getMembers
}