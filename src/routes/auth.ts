import express, { Router } from 'express';
import { 
    authStatus, 
    userLogin, 
    userLogout,
    userRefresh, 
    userRegister 
} from '../controller/authController.js';
import { 
    authenticateToken, 
    validateUserLoginData, 
    validateUserRegisterData, 
    validationHandler 
} from '../middleware/authentication.js';
import { authorize } from '../middleware/authorization.js';
import { authLimiter } from '../middleware/limiter.js';
import { setTenantContext } from '../middleware/setTenantContext.js';

const auth: Router = express.Router();

auth.post( '/register',
    authLimiter,
    authenticateToken,
    authorize('admin'),
    validateUserRegisterData,
    validationHandler,
    setTenantContext,
    userRegister
);

auth.post( '/login',
    authLimiter,
    validateUserLoginData,
    validationHandler,
    userLogin
);

auth.post('/logout', userLogout);
auth.post('/refresh', userRefresh);
auth.get('/me', authenticateToken, authStatus);

export default auth;
