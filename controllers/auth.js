const Creater = require("../models/Creater");


const bcrypt = require("bcryptjs");


const register = async(req, res) => {
    
    try{
        const creaters = await Creater.create(req.body);

        res.json(creaters);
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
                    return res.status(200).json({"status": "login successful"});
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
        

    }

}


module.exports = {
    register,
    login,
}