const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Code = require('../models/Code');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the Codes using: GET "/api/content/fetchallcontent". Login required
router.get('/fetchallcontent', fetchuser, async (req, res) => {
    try {
        const codes = await Code.find({ user: req.user.id });
        res.json(codes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Content using: POST "/api/content/addcontent". Login required
router.post('/addcontent', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { title, description, tag, videos } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const code = new Code({
                title, description, tag, videos, user: req.user.id
            })
            const savedCode = await code.save()

            res.json(savedCode)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

// ROUTE 3: Update an existing Content using: PUT "/api/content/updatecontent". Login required
router.put('/updatecontent/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newContent object
        const newCode = {};
        if (title) { newCode.title = title };
        if (description) { newCode.description = description };
        if (tag) { newCode.tag = tag };

        // Find the content to be updated and update it
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

// ROUTE 4: Delete an existing Content using: DELETE "/api/content/deletecontent". Login required
router.delete('/deletecontent/:id', fetchuser, async (req, res) => {
    try {
        // Find the content to be delete and delete it
        let code = await Code.findById(req.params.id);
        if (!code) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Content
        if (code.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        code = await Code.findByIdAndDelete(req.params.id)
        res.json({ "Message": "Content has been deleted", code: code, "Response" : "true" });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router