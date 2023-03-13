const express = require('express')
const router = express.Router()
const {getUser, createProject, createMember, getMembers} = require("../controllers/dashboard");
router.get('/getUser', getUser)
router.post('/createProject', createProject)
router.post('/createMember', createMember)
router.post('/getMembers', getMembers)


module.exports = router
