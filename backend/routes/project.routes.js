import { Router } from "express";
import { body } from "express-validator";
import * as projectController from '../controllers/project.controller.js';
import * as auth from "../middleware/auth.js";

const router = Router();
router.post('/create',
    auth.authUser,
   body('Name').isString().withMessage('Name is required'),
   projectController.createProject 
)
router.get('/all',
    auth.authUser,
    projectController.getAllProject
)
router.put('/add-user',
    auth.authUser,
    body('projectId').isString().withMessage("ProjectId is required"),
    body('users').isArray({min:1}).withMessage('Users must be an array with atleast one string')
    .custom((users)=>users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject,)
    
    router.get('/get-project/:projectId',
        auth.authUser,
        projectController.getProjectById
    )
    router.put('/update-file-tree',
        auth.authUser,
        body('projectId').isString().withMessage('ProjectId is required'),
        body('fileTree').isObject().withMessage('File Tree is required'),
        projectController.updateFileTree
    )
export default router;
