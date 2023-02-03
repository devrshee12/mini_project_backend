const Creater = require("../models/Creater");



const register = async(req, res) => {

    try{
        const creater = await Creater.create(req.body);

        res.json(creater);
    }
    catch(err){
        console.log(err);
        res.status(400).json({err});
    }
    

}


const login = async(req, res) => {

}


module.exports = {
    register,
    login,
}