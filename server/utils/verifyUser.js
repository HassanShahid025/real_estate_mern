import {errorHandler} from './error.js'
import  jwt  from 'jsonwebtoken';

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;
    console.log(req.cookies)
    console.log(token)

    if(!token) {                                            
        return next(errorHandler(401, 'Unauthorized User'));
    }

    jwt.verify(token,process.env.JWT_SECRET, (err,user) => {
        if(err) return next(errorHandler(403, 'Forbidden'));

        req.user = user //user is actually id we saved in jwt in signup controller
        next(); //it will run the updateUser function given in route
    })
} 