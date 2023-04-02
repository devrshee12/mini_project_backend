const Creater = require("../models/Creater");
const Member = require("../models/Member");
const Project = require("../models/Project");
const Task = require("../models/Task");


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

const updateProject = async(req, res) => { // completed
    console.log("called update project");
    const {type} = req.user;
    const {name, category, desc, projectId} = req.body;
    try{
        if(type === "creater"){
            const project = await Project.findOne({_id: projectId});


            project.name = name;
            project.category = category;
            project.desc = desc;

            const createrEmail = project.creaters[0].email;

            await project.save();

            const creater = await Creater.findOne({email: createrEmail});


            const newProjects = creater.projects.map((p) => {
                if(p._id == projectId){
                    return project;
                }
                else{
                    return p;
                }
            })

            creater.projects = newProjects;
            await creater.save();




            return res.status(201).json({valid: true, "status": "project has been updated", project, creater});


        }
        else{
            return res.status(501).json({"valid": false, "status": "you are not allowed to do this"});
        }
    }
    catch(err){
        console.log(err);
        return res.status(401).json({"valid": false, "status": "something went wrong"});
    }
}


const deleteProject = async(req, res) => {
    const {type, email} = req.user;
    const {projectId} = req.params;
    console.log("here in delete project");
    console.log(projectId);
    try{
        if(type === "creater"){
            const project = await Project.deleteOne({_id: projectId});

            console.log("after delete from project")


            const creater = await Creater.findOne({email});

            // const newProjects = 

            

            creater.projects = creater.projects.filter((p) => {
                if(p._id != projectId){
                    return p;
                }
            });

            console.log("this is new projects" ,creater.projects);
            await creater.save();   


            console.log("after updating in creater model");






            return res.status(201).json({valid: true, status: "project has been deleted"});
        }
        else{
            return res.status(501).json({valid: false, status: "you are not allowed to delete project"});
        }
    }
    catch(err){

        return res.status(404).json({valid: false, status: "something went wrong"});
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

        
        const project = await Project.create({name, category, desc, creaters: [{email: user.email, name: user.name}], members: []});
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


const updateMember = async(req, res) => { // completed
    const {type} = req.user;
    const {name, email, password, projectId, memberId} = req.body;
    try{

        if(type === "creater"){
            const member = await Member.findOne({_id: memberId});
            member.name = name
            member.email = email
            member.password = password;

            await member.save();


            const project = await Project.findOne({_id: projectId});

            const newMembers = project.members.map((m) => {
                if(m._id == memberId){
                    return member;
                }
                else{
                    return m;
                }
            })
            project.members = newMembers;

            await project.save();



            return res.status(201).json({valid: true, status: "member has been updated", member, project});
        }
        else{
            return res.status(501).json({valid: false, status: "you are not allowed to update memeber"})

        }
    }
    catch(err){
        return res.status(401).json({valid: false, status: "something went wrong"});
    }
}


const getMembers = async(req, res) => {
    const {type, email} = req.user;
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



const createTask = async(req, res) => {
    const {type, email} = req.user;
    const {projectId, name, desc, taskType, status} = req.body;
    try{

        if(type === "creater"){
            const task = await Task.create({projectId, name, desc, taskType, status});

            const project = await Project.findOne({_id: projectId});

            const tempTasks = [...project.tasks, task._id];
            project.tasks = tempTasks;

            await project.save();

            const creater = await Creater.findOne({email});

            const newProjects = creater.projects.map((project) => {
                if(project._id == projectId){
                    return {...project, tasks: [...project.tasks, task._id]};
                }

                return project;
            })

            creater.projects = newProjects;

            await creater.save();


            
            


            return res.status(201).json({"valid": true, "status": "task created", task, project, creater});


        }   
        else{
            return res.status(404).json({"valid": false, "status": "something went wrong"});
        }   



    }
    catch(err){
        return res.status(404).json({"valid": false, "status": "there is some error"});
    }
}


const getAllTasks = async(req, res) => {
    // const {type} = req.user;
    const {projectId} = req.body;
    try{

        const tasks = await Task.find({projectId});
        return res.status(201).json({"valid": true, "status": "got all tasks", tasks});
    }
    catch(err){
        return res.status(404).json({"valid": false, "status": "something went wrong"});
    }
}


const selectTask = async(req, res) => {
    console.log("selected task called");
    const {projectId, memberId} = req.body;
    try{
        
        const tasks = await Task.find({projectId}); 

        const selected = tasks.filter((task) => {
            if(!task.members.includes(memberId)){
                return task;
            }
            
        })

        console.log(selected);


        return res.status(201).json({valid: true, "status": "got selected task", tasks: selected});
        
    }   
    catch(err){
        console.log(err);
        return res.status(401).json({"valid": false, "status": "something went wrong"});
    }

}




const assignTask = async(req, res) => {
    const {email} = req.user;
    const {memberId, taskId} = req.body;

    try{
        const task = await Task.findOne({_id:taskId});
        const newMembers = [...task.members, memberId];
        task.members = newMembers;
        await task.save();


        // update taskId in member

        const member = await Member.findOne({_id:memberId});
        const newTasks = [...member.tasks, taskId];
        member.tasks = newTasks;
        await member.save();

        // mail send to member -> task has been assigned
        const sendMail = require("../services/emailService")
        sendMail({
            from: email,
            to: member.email,
            subject: 'OpTask',
            text: `${email} assigned a task to you`,
            html: require('../services/emailTemplate')({
                        email,
                        name: task.name,
                        taskType: task.taskType,
                        status:task.status

                  })
          }).then(() => {
            return res.status(201).json({"valid": true, "status": "task has been assigned, email has been send", task, member});
            
          }).catch(err => {
            return res.status(500).json({error: 'Error in email sending.'});
          });




    }
    catch(err){
        
        console.log(err);
        return res.status(401).json({"valid": false, "status": "something went wrong"});
    }


}


const getTaskOfMember = async(req, res) => {
    const {projectId, memberId} = req.body;
    try{
        const tasks = await Task.find({projectId}); 

        const selected = tasks.filter((task) => {
            if(task.members.includes(memberId)){
                return task;
            }
            
        })

        return res.status(201).json({valid: true, "status": "got selected task", tasks: selected});

    }
    catch(err){
        console.log(err);
        return res.status(401).json({"valid": false, "status": "something went wrong"});
    }
}

const updateTask = async(req, res) => {
    const {type} = req.user;
    const {projectId, memberId, taskId, name, taskType, status, desc} = req.body;
    try{
        if(type === "creater"){
            const task = await Task.findOne({_id: taskId});
            task.name = name;
            task.taskType = taskType;
            task.status = status;
            task.desc = desc;

            await task.save();
            return res.status(201).json({valid: true, status: "your task has been updated", task});
        }
        else{
            return res.status(501).json({valid: false, status: "you are not allowed to update tasks"});
        }
    }
    catch(err){
        return res.status(401).json({valid: false, stauts: "something went wrong"});

    }
}

const deleteMember = async(req, res) => {
    const {type} = req.user;
    const {memberId, projectId} = req.body;
    try{
        if(type === "creater"){

            const member = await Member.findOne({_id: memberId});
    
            const allTasksOfMember = member.tasks;
    
            for(let i=0;i<allTasksOfMember.length;i++){
                const task = await Task.findOne({_id: allTasksOfMember[i]});
    
                const newMembers = task.members.filter((m) => {
                    if(m != memberId){
                        return m;
                    }
                })
    
                task.members = newMembers;
                await task.save();
            }
    
            const project = await Project.findOne({_id: projectId});
    
            const newMembers = project.members.filter((m) => {
                if(m._id != memberId){
                    return m;
                }
            })
    
            project.members = newMembers;
            await project.save();

            return res.status(201).json({valid: true, status: "member has been deleted"});
        }
        else{
            return res.status(501).json({valid: true, status: "you are not allowed to delete member"});
        }


    }
    catch(err){
        return res.status(401).json({valid: false, stauts: "something went wrong"});
    }

}

module.exports = {
    getUser,
    createProject,
    createMember,
    getMembers,
    createTask,
    getAllTasks,
    selectTask,
    assignTask,
    getTaskOfMember,
    updateProject,
    updateMember,
    updateTask,
    deleteProject,
    deleteMember

}