import { Router } from 'express';
import { passportCall } from '../utils.js';
import SessionController from '../controllers/session.controller.js'

const router = Router();

// -- login
router.post('/login', SessionController.login);

// -- register user
router.post('/register', SessionController.register);

// -- current jsonwebtoken
router.get('/current', passportCall('current'), SessionController.current);

// -- logout
router.get('/logout', SessionController.handleLogout);

export default router;