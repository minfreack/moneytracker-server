const express = require('express');
const router = express.Router();
const CashflowController = require('./controller');

const onNewIncome = (req, res) => {
    CashflowController.newIncome(req.body)
        .then((result) => res.status(result.status).json(result.data))
        .catch((err) => res.status(500).json(err));  
}

const onGetTransactions = (req, res) => {
    CashflowController.getTransactions(req.body.userID || '')
        .then((result) => res.status(result.status).json(result.data))
        .catch((err) => res.status(500).json(err));  
}

router.post('/new-income', onNewIncome);
router.post('/all-transactions', onGetTransactions);

module.exports = router;
