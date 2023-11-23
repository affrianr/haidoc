const router = require('express').Router();
const UserController = require('../controllers/UserController')
const DoctorController = require('../controllers/DoctorController');
const PatientController = require('../controllers/PatientController');

router.get('/', UserController.home)
router.get('/register', UserController.registerForm)
router.post('/register', UserController.registerPost)
router.get('/register/doctor/:id', UserController.registerDoctorForm)
router.post('/register/doctor/:id', UserController.registerDoctorPost)
router.get('/register/patient/:id', UserController.registerPatientForm)
router.post('/register/patient/:id', UserController.registerPatientPost)
router.get('/login', UserController.loginForm)
router.post('/login', UserController.postLogin)

const isLoggedin = function (req, res, next){
    console.log(req.session)
    if(!req.session.userId){
        const err = 'Please login first'
        res.redirect(`/login?error=${err}`)
    } else {
        next()
    }
}

const isDoctor = function (req, res, next){
    if(req.session.userId && req.session.role !== "Doctor"){
        const err = 'You have no access'
        res.redirect(`/login?error=${err}`)
    } else {
        next()
    }
}

const isPatient = function(req, res, next){
    if(req.session.userId && req.session.role !== "Patient"){
        const err = 'You Have no access'
        res.redirect(`/login?error=${err}`)
    } else {
        next()
    }
}

// doctor
router.get('/doctor/:id', isLoggedin, isDoctor, DoctorController.home)
router.get('/doctor/:id/update-profile', isLoggedin, isDoctor, DoctorController.updateProfileForm )
router.post('/doctor/:id/update-profile', isLoggedin, isDoctor, DoctorController.updateProfilePost )
router.get('/doctor/:id/appointment', DoctorController.appointmentList)
router.get('/doctor/:id/create-post', DoctorController.createPostForm)
router.post('/doctor/:id/create-post', DoctorController.createPost)


// patient
router.get('/patient/:id', isLoggedin, isPatient, PatientController.home)
router.get('/patient/:id/doctor-list', isLoggedin, isPatient, PatientController.doctorList)
router.get('/patient/:id/appointment/:doctorId', isLoggedin, isPatient, PatientController.appointmentForm)
router.post('/patient/:id/appointment/:doctorId', PatientController.appointmentPost)
// logout
router.get('/logout', UserController.logout)

module.exports = router