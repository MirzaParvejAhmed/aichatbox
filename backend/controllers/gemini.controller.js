import * as gemini from "../services/gemini.service.js"
export const getResult =async (req,res)=>{
    try{
        const {contents}=req.query;
        const result = await gemini.generateResult(contents);
        console.log(gemini);
        res.send(result);

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}