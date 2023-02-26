const express = require('express')
const router = express.Router()
const { registerCreater, login, registerMember} = require('../controllers/auth')
router.post('/register/creater', registerCreater)
router.post('/login', login)
router.post('/register/member', registerMember)

module.exports = router
