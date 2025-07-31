import mongoose from "mongoose"; 
const projectSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        trim:true,
        unique:[true,'Project name must be unique'],
        lowercase:true,
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    fileTree:{
        type:Object,
        default:{},
    },
})
const Project = mongoose.model('project',projectSchema);
export default Project;