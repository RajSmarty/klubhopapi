const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Code = require('../models/Code');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the Codes using: GET "/api/codes/fetchallcodes". Login required
router.get('/fetchallcodes', fetchuser, async (req, res) => {
    try {
        const codes = await Code.find({ user: req.user.id });
        res.json(codes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Code using: POST "/api/codes/addcode". Login required
router.post('/addcode', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const code = new Code({
                title, description, tag, user: req.user.id
            })
            const savedCode = await code.save()

            res.json(savedCode)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

// ROUTE 3: Update an existing Code using: PUT "/api/codes/updatecode". Login required
router.put('/updatecode/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newCode object
        const newCode = {};
        if (title) { newCode.title = title };
        if (description) { newCode.description = description };
        if (tag) { newCode.tag = tag };

        // Find the code to be updated and update it
        let code = await Code.findById(req.params.id);
        if (!code) { return res.status(404).send("Not Found") }

        if (code.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        code = await Code.findByIdAndUpdate(req.params.id, { $set: newCode }, { new: true })
        res.json({ code });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing Code using: DELETE "/api/codes/deletecode". Login required
router.delete('/deletecode/:id', fetchuser, async (req, res) => {
    try {
        // Find the code to be delete and delete it
        let code = await Code.findById(req.params.id);
        if (!code) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Code
        if (code.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        code = await Code.findByIdAndDelete(req.params.id)
        res.json({ "Response": "Content has been deleted", code: code });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router