import { UserService as userDao } from "../../repository/index.repository.js";
import { hashPassword, isValidPass } from '../../utils.js'
import CustomError from "../../middleware/error-management/CustomError.js";
import { ErrorList } from "../../middleware/error-management/error.dictionary.js";

class UserValidator{
    async userLogin( email, password, req ){
        
        if( !email || !password ) {
            req.logger.warning('Missing required fields')

            CustomError.createError({
            name: 'Login Error',
            cause: 'Email and password are required',
            message: 'Invalid data input',
            code: ErrorList.INVALID_PARAMS
            })
        };

        const user = await userDao.findByEmail(email);

        if(!user) {
            req.logger.warning('User does not exist')

            CustomError.createError({
                name: 'User not found',
                cause: 'User does not exist in the database',
                message: 'User is not registered',
                code: ErrorList.NOT_FOUND
            })
        };

        if(!isValidPass(user, password)) {
            req.logger.warning('Invalid password')
            
            CustomError.createError({
                name: 'Invalid password',
                cause: 'Invalid password',
                message: 'Invalid password',
                code: ErrorList.ACCESS_FORBIDDEN
            })
        };

        return user;
    }

    async registerUser({first_name, last_name, email, age, password}){
        if( !first_name || !last_name || !age || !email || !password ) {
            req.logger.warning('Missing required fields')
            
            CustomError.createError({
                name: 'Register error',
                cause: 'Missing required fields',
                message: 'Invalid data input',
                code: ErrorList.INVALID_PARAMS
            })
        };

        // -- checks if there is an existing user with that email
        const user = await userDao.findByEmail(email);
        if(user) {
            req.logger.warning('Email is already in use')
            
            CustomError.createError({
                name: 'Register error',
                cause: 'Email already ',
                message: 'Invalid data input',
                code: ErrorList.INVALID_PARAMS
            })

        };

        const data = {
            first_name, 
            last_name, 
            age, 
            email, 
            password: hashPassword(password)
        };

        const newUser = await userDao.createUser(data)
        return newUser;
    }
}

export default new UserValidator();