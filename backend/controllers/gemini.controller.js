
import * as gemini from "../services/gemini.service.js"
export const getResult = async (req,res)=>{
    try{
        const {contents}=req.query;
        const result = await gemini.generateResult(contents);
        
        let formattedResult;
        try {
            
            formattedResult = JSON.parse(result);
        } catch (parseError) {
            
            formattedResult = { text: result };
        }
        
        res.send(formattedResult);

    }catch(error){
        console.error("Error in gemini.controller.js:", error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
