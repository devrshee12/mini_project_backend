const Creater = require("../models/Creater");
const jwt = require("jsonwebtoken");





const bcrypt = require("bcryptjs");
const Member = require("../models/Member");


const registerCreater = async(req, res) => {
    
    try{
        const creater = await Creater.create(req.body);
        const token = creater.generateAuthToken();
        
        // res.status(201).json({token});
        
        console.log("register token : " + token);
        res.cookie("token", token, {
            expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // ms // 30 d
            httpOnly: true
        })

        res.status(200).json({token});
        
        
    }
    catch(err){
        console.log(err);
        res.status(400).json({err});
    }
    

}


const login = async(req, res) => {
    const {type, email, password} = req.body;
    if(type === "creater"){
        try{
            
            const creater = await Creater.findOne({email: email});
            
            if(!creater){
                return res.status(404).json({"status" : "email invalid"});
            }

            const dbPassword = creater.password;
            
            bcrypt.compare(password, dbPassword, (err, data) => {
                if(err){
                    return res.status(404).json({"status": "something went wrong"});
                }

                if(data){
                    const token = creater.generateAuthToken();
                    console.log("login token : " + token);
                    res.cookie("token", token, {
                        expires: new Date(Date.now() + ( 30 * 24 * 60 * 60 * 1000)), // ms
                        httpOnly: true
                    })

                    return res.status(200).json({"status": "login successful for creater", token});
                }
                else{
                    return res.status(404).json({"status": "invalid password"});
                }
            })

        }
        catch(err){
            console.log(err);
            res.json(err);
        }
    }
    if(type === "member"){
        try{
            
            const member = await Member.findOne({email: email});
            
            if(!member){
                return res.status(404).json({"status" : "email invalid"});
            }

            const dbPassword = member.password;
            
            bcrypt.compare(password, dbPassword, (err, data) => {
                if(err){
                    return res.status(404).json({"status": "something went wrong"});
                }

                if(data){
                    const token = member.generateAuthToken();
                    console.log("login token member : " + token);
                    res.cookie("token", token, {
                        expires: new Date(Date.now() + 120000), // ms
                        httpOnly: true
                    })

                    return res.status(200).json({"status": "login successful for member", token});
                }
                else{
                    return res.status(404).json({"status": "invalid password"});
                }
            })

        }
        catch(err){
            console.log(err);
            res.json(err);
        }

    }

}


const registerMember = async(req, res) => {
    try{
        const member = await Member.create(req.body);
        const token = member.generateAuthToken();
        
        // res.status(201).json({token});
        
        console.log("register token member : " + token);
        res.cookie("token", token, {
            expires: new Date(Date.now() + 120000), // ms
            httpOnly: true
        })

        res.status(200).json({token});

    }
    catch(err){
        console.log(err);
    }
}


module.exports = {
    registerCreater,
    login,
    registerMember
}