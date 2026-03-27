const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");

router.get("/users", async (req, res) => {
    try {
        const db = getDB();

        const users = await db
            .collection("users")
            .find()
            .toArray();

        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users"
        });
    }
});

router.post("/users", async (req, res) => {
    try {
        const db = getDB();

        const result = await db
            .collection("users")
            .insertOne(req.body);

        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error adding user"
        });
    }
});

module.exports = router;