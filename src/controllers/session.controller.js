import UserValidator from "../dao/validators/user.validator.js";
import { admin } from '../utils.js';
import UserDTO from '../dao/dto/user.dto.js';
import jwt from 'jsonwebtoken';

class SessionController{
    async login(req, res){
        try{
            const { email, password } = req.body;
            let user = {};
            
            
            if(email == admin.user && password == admin.password){
                req.logger.debug('User is admin')    
                user = {...admin}
            }else{
                user = await UserValidator.userLogin(email, password, req);  
            }          

            const token = jwt.sign({email, first_name: user.first_name, last_name: user.last_name, role: user.role }, 'pageSecret', { expiresIn: '10m' });
            res.status(200).cookie('secretToken', token, {maxAge: 50000, httpOnly: true})
            
            req.logger.info('Login successful') 
            req.logger.debug('Redirecting to /products')
            res.redirect('/products');
        }catch(err){
            req.logger.error(err.message)
            return res.status(400).json({error: err.message});
        }
    } 

    async register(req, res){
        try{
            const {first_name, last_name, email, age, password} = req.body;
            req.logger.debug(`Got the following values, first_name: ${first_name}, last_name: ${last_name}, email: ${email}, age: ${age}`)

            const user = await UserValidator.registerUser({first_name, last_name, email, age, password});

            req.logger.info('User registration successful')
            req.logger.debug('Redirecting to /login')
            return res.status(201).redirect('/login');
        }catch(err){
            req.logger.error(err.message)
            res.status(400).json({error: err.message})
        }
    }

    async current(req, res){
        const user = new UserDTO(req.user)
        req.logger.debug('Obtained current user information')
        res.send(user);
    }

    async handleLogout(req, res){
        req.logger.debug('Logging out! Redirecting to login page.')
        res.clearCookie('secretToken');
        res.redirect('/login');
    }
}

export default new SessionController();