import {Router} from 'express';
import * as userController from "../controllers/user.controller.js";
import {body} from "express-validator";
import * as auth from "../middleware/auth.js";

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    userController.createUserController
)
router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    userController.loginController
)
router.get('/profile', auth.authUser,userController.profileController);
router.get('/logout',auth.authUser,userController.logoutController);
router.get('/all',auth.authUser,userController.getAllUsersController);

export default router;