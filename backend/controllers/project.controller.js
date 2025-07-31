
import userModel from '../models/user.model.js';
import * as projectService from '../services/project.service.js';
import { validationResult} from 'express-validator';

export const createProject = async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        const {Name} = req.body;
        const loggedInUser = await userModel.findOne({email:req.user.email});
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({Name,userId});
        res.status(201).json({
            message:"Project created Successfullly",
            project:newProject
        })

    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);
            
        
    }
}
export const getAllProject = async(req,res)=>{
    try{
        const loggedInUser = await userModel.findOne({email:req.user.email});
        const allUserProjects = await projectService.getAllProjectsByUserId({userId:loggedInUser._id});
        return res.status(200).json({
            message:"All Projects fetched successfully",
            projects:allUserProjects
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            error:err.message
        })
    }
}
export const addUserToProject =async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const {projectId,users}= req.body;
        const loggedInUser = await userModel.findOne({email:req.user.email})
        const project = await projectService.addUserToProject
        ({projectId,
            users,
            userId:loggedInUser._id})
            return res.status(200).json({project});
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:err.message
        });
    }

    
}
export const getProjectById= async (req,res)=>{
    const {projectId}=req.params;
    try{
        const project = await projectService.getProjectById({projectId})
        return res.status(200).json({project})
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message:error.message
        });
    }
}
export const updateFileTree= async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }
    try{
        const{projectId,fileTree} =req.body;
        const project = await projectService.updateFileTree({
            projectId,fileTree
        })
        return res.status(200).json({project})
    }catch(error){
        console.log(error)
        res.status(400).json({
            error:error.message
        })

    }

}
