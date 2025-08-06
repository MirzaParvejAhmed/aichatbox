// File: controllers/gemini.controller.js
import * as gemini from "../services/gemini.service.js";

export const getResult = async (req, res) => {
    try {
        const { contents } = req.query;
        // The service now returns an already-parsed object.
        const resultObject = await gemini.generateResult(contents);

        // Your code that caused the f.replace error is likely here or in your frontend.
        // It should look something like this:
        if (resultObject.text) {
            // Correctly access the string before performing operations
            let aiText = resultObject.text;
            // if you need to remove something from the text...
            // aiText = aiText.replace("@ai", ""); 
            res.send({ text: aiText });
        } else {
            // If the response is a fileTree or another object, send it as-is
            res.send(resultObject);
        }

    } catch (error) {
        console.error("Error in gemini.controller.js:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
