const router = require('express').Router();
const multer = require('multer');
const auth = require('../controllers/auth');
const authenticate = require('../middleware/auth');
const verifyOtp = require('../controllers/otp');

const storage = multer.memoryStorage(); // or configure diskStorage if needed
const upload = multer({ storage });
router.post('/signup', auth.signup);
router.post('/login', auth.loginUser);
router.post('/admin-login',auth.loginAdmin);
router.post('/superadmin-login', auth.loginSuperAdmin);
router.post('/otp/send', verifyOtp.sendOtp);
router.post('/otp/verify', verifyOtp.verifyOtp); 


module.exports = router;