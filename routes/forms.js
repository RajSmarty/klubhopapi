const express = require('express');
const Form = require('../models/Form');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// ROUTE 1: POST the DETAILS of Form-data using: POST "/api/forms/formdata".
router.post('/formdata', [
    body('formName', 'Enter a valid formName').isLength({ min: 3 }),
    body('formEmail', 'Enter a valid formEmail').isEmail(),
    body('formAddress', 'Enter a valid formAddress').isLength({ min: 10 }),
    body('formNumber', 'Enter a valid formNumber').isLength({ min: 10 }),
    body('formMsg', 'formMsg max. length can not be exceeded by 100 characters.').isLength({ max: 100 }),], async (req, res) => {
        try {
            const { formName, formEmail, formBackground, formAddress, formNumber, formMsg } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const form = new Form({
                formName, formEmail, formBackground, formAddress, formNumber, formMsg
            })
            const savedForm = await form.save()

            res.json(savedForm)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

module.exports = router
