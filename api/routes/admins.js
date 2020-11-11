const router = require('express').Router();
const mongoose = require('mongoose');
const Admin = require('../../models/admin');
const adminControls = require('../controls/admins');
const checkAuth = require('../middlewares/checkAuth');

router.post('/signup',adminControls.signUp);
router.post('/signin',adminControls.signIn);
router.get('/dashboard',checkAuth,adminControls.dashboard);

router.delete('/:userId',adminControls.deleteAdmin);

module.exports = router;
