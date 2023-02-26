const express = require('express')
const router = express.Router()
const {getUser, createProject} = require("../controllers/dashboard");
router.get('/getUser', getUser)
router.post('/createProject', createProject)


module.exports = router
