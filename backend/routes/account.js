const express = require('express');
const { authmiddleware } = require('../middleware.js');
const { Amount } = require('../db.js');
const mongoose = require('mongoose');

const router = express.Router();

router.get("/balance", authmiddleware, async (req, res) => {
    const account = await Amount.findOne({
        newuserid: req.newuserid
    });

    if (!account) {
        return res.status(404).json({ message: 'Account not found' });
    }

    res.json({
        balance: account.balance
    });
});

router.post("/transfer", authmiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        // Fetch the accounts within the transaction
        const account = await Amount.findOne({ newuserid: req.newuserid }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Amount.findOne({ newuserid: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid recipient account" });
        }

        // Perform the transfer
        await Amount.updateOne({ newuserid: req.newuserid }, { $inc: { balance: -amount } }).session(session);
        await Amount.updateOne({ newuserid: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Transfer successful" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Transfer failed", error: err.message });
    }
});

module.exports = router;
