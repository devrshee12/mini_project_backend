const express = require('express')
const router = express.Router()
const {getUser, createProject, createMember, getMembers, createTask, getAllTasks, selectTask, assignTask, getTaskOfMember, updateProject, updateMember, updateTask, deleteProject, deleteMember} = require("../controllers/dashboard");
router.get('/getUser', getUser)
router.post('/createProject', createProject)
router.post('/createMember', createMember)
router.post('/getMembers', getMembers)
router.post('/createTask', createTask)
router.post('/getAllTasks', getAllTasks)
router.post('/selectTask', selectTask)
router.post('/assignTask', assignTask)
router.post('/getTaskOfMember', getTaskOfMember)
router.post('/updateProject', updateProject)
router.post('/updateMember', updateMember)
router.post('/updateTask', updateTask)
router.delete('/deleteProject/:projectId', deleteProject)
router.post('/deleteMember', deleteMember)


module.exports = router
