import express from 'express';
import {
  signupController,
  loginController,
  logoutController,
  updateDataController,
  addAddressController,
  updateAddressController,
  getAddressController
} from '#controllers/auth.controller.js';
import { authenticateToken } from '#middleware/auth.middleware.js';
import { apiLimiter } from '#config/rateLimiter.js';

const router = express.Router();

router.post('/signup',apiLimiter(15*60*1000,10), signupController);
router.post('/login',apiLimiter(15*60*1000,10), loginController);
router.post('/logout',apiLimiter(15*60*1000,10), authenticateToken, logoutController);

router.patch('/updateData',apiLimiter(15*60*1000,10), authenticateToken, updateDataController);

router.get("/getAddress",apiLimiter(15*60*1000,200),authenticateToken,getAddressController)
router.post("/addAddress",apiLimiter(15*60*1000,10),authenticateToken,addAddressController)
router.put("/updateAddress",apiLimiter(15*60*1000,10),authenticateToken,updateAddressController)

router.get("/me",apiLimiter(15*60*1000,200),authenticateToken,(req,res)=>{
  res.status(200).json({success:true,user:req.user})
})

//dupa ce fac si orders sa adaug ruta sa primesti toate informatiile

export default router;
