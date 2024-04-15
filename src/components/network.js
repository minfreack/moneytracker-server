const express = require('express');
const userRoutes = require('./users')
const cashflowRoutes = require('./cashflow')

const router = express.Router();

router.use('/users', userRoutes);
router.use('/cashflow', cashflowRoutes);


module.exports =  router;