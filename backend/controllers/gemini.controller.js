
// backend/controllers/gemini.controller.js
import * as gemini from "../services/gemini.service.js";

export const getResult = async (req, res) => {
    try {
        const { contents } = req.query;
        const rawResult = await gemini.generateResult(contents);

        let formattedResult;
        try {
            // Attempt to parse the raw AI response as JSON
            formattedResult = JSON.parse(rawResult);
        } catch (parseError) {
            // If it's not valid JSON, create a structured object with the raw text
            formattedResult = { text: rawResult };
        }

        res.send(formattedResult);
    } catch (error) {
        console.error("Error in gemini.controller.js:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
