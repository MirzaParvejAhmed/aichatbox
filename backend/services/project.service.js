
import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({Name,userId})=>{
    if(!Name || !userId){
        throw new Error("Name and userId are required");
    }
    const project = await projectModel.create({Name,users:[userId]});
    return project;
}
export const getAllProjectsByUserId = async ({userId}) => {
    if(!userId){
        throw new Error("UserId is required");
    }
    const allUserProjects = await projectModel.find({users:userId})
    return allUserProjects;
}
export const addUserToProject = async ({projectId,users,userId})=>{
    if( !projectId){
        throw new Error("ProjectId is required");
    }
    console.log(projectId.length);
    if (!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid ProjectId")
    }
    if(!users){
        throw new Error ("User is required")
    }
    if(!Array.isArray(users) || users.some(userId=>
    !mongoose.Types.ObjectId.isValid(userId))){
        throw new Error("Invalid userId(s) in users array")
    }
    if(!userId){
        throw new Error("UserId is required")
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error("Userid is required")
    }

    const project = await projectModel.findOne({_id:projectId,users:userId})
    
    if(!project){
        throw new Error("Users not belong to this project")
    }
    const updatedProject = await projectModel.findOneAndUpdate({
        _id:projectId
    },{
        $addToSet:{
            users:{
                $each:users
            }
        }
    },{
        new:true   
    })
     return updatedProject;

}
export const getProjectById = async ({projectId})=>{
    if(!projectId){
        throw new Error("ProjectId is required");
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid projectId")
    }
    const project = await projectModel.findOne({_id:projectId}).populate('users')
    return project;
}

export const updateFileTree=async ({projectId,fileTree})=>{
    if(!projectId){
        throw new Error("ProjectId is required")
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid projectId")
    }
    if(!fileTree){
        throw new Error("FileTree is required")
    }
    const project=await projectModel.findOneAndUpdate({
        _id:projectId
    },{
        fileTree
    },{
        new:true
    })
    return project;
}