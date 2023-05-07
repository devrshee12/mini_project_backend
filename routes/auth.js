const express = require('express')
const router = express.Router()
const { registerCreater, login, registerMember, createTokenForGoogle} = require('../controllers/auth')
router.post('/register/creater', registerCreater)
router.post('/login', login)
router.post('/register/member', registerMember)
router.post('/google', createTokenForGoogle)

module.exports = router
