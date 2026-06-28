import express, { Router } from 'express';
import { tenantRegister } from '../controller/authController.js';
import { 
    validateTenantAdminRegisterData, 
    validateTenantRegisterData, 
    validationHandler 
} from '../middleware/authentication.js';
import { authLimiter } from '../middleware/limiter.js';

const tenant: Router = express.Router();

tenant.post( '/register',
    authLimiter,
    validateTenantRegisterData,
    validateTenantAdminRegisterData,
    validationHandler,
    tenantRegister
);

export default tenant;
