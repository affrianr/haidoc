const { User, Doctor, Patient } =  require('../models')
const bcrypt = require('bcryptjs');
class Controller {

    static async home(req, res){
        try {
            res.render('home')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
    
    static async registerForm(req, res){
        try {
            let { error } = req.query
            res.render('register-page', { error })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async registerPost(req, res){
        try {

            let { username, password, role } = req.body
            await User.create( { username, password, role })
            let user = await User.findOne( { where : {username : username}})

            if(role === "Doctor"){
                res.redirect(`/register/doctor/${user.id}`)
            } else {
                res.redirect(`/register/patient/${user.id}`)
            }
        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                const err = error.errors.map(el=> el.message)
                res.redirect(`/register?error=${err}`)
            } else {
                console.log(error)
                res.send(error)
            }
        }
    }

    static async registerDoctorForm(req, res){
        try {
            let { id } = req.params
            let { error } = req.query
            // console.log(id)
            res.render('doctor-create-profile', { id, error })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async registerDoctorPost(req, res){
            try {
                let { id } = req.params
                let UserId = id
                let { name, phone_number, specialty, address, profile_picture } = req.body
                await Doctor.create({ name, phone_number, specialty, address, profile_picture, UserId })
                res.redirect('/')
            } catch (error) {
                if(error.name === "SequelizeValidationError"){
                    let { id } = req.params
                    const err = error.errors.map(el=> el.message)
                    res.redirect(`/register/doctor/${id}?error=${err}`)
                } else {
                    console.log(error)
                    res.send(error)
                }
            }
    }

    static async registerPatientForm(req, res){
        try {
            let { id } = req.params
            let { error } = req.query
            res.render('patient-create-profile', { id, error })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async registerPatientPost(req, res){
            try {
                let { id } = req.params
                // console.log(id)
                let UserId = id
                let { name, phone_number, address } = req.body
                await Patient.create({ name, phone_number, address, UserId })
                res.redirect('/')
            } catch (error) {
                let { id } = req.params
                if(error.name === "SequelizeValidationError"){
                    const err = error.errors.map(el=> el.message)
                    res.redirect(`/register/patient/${id}?error=${err}`)
                } else {
                    console.log(error)
                    res.send(error)
                }
            }
    }

    static async loginForm(req, res){
        try {
            let { error } = req.query
            res.render('login-page', { error })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postLogin(req, res){
        try {
            let { username, password } = req.body

            let user = await User.findOne( { where : { username }})
            if(user){
                const isValidPass = bcrypt.compareSync(password, user.password) //true or false
                console.log(isValidPass)
                if(isValidPass){
                    if(user.role === "Doctor"){
                        req.session.userId = user.id
                        req.session.role = user.role
                        let doctor = await Doctor.findOne( { where: {UserId : user.id}})
                        res.redirect(`/doctor/${doctor.id}`)
                    } 
                    if(user.role === "Patient") {
                        req.session.userId = user.id
                        req.session.role = user.role
                        let patient = await Patient.findOne( { where: {UserId : user.id}})
                        res.redirect(`/patient/${patient.id}`)
                    }

                    //success login
                } else {
                    const err = "Invalid username/password"
                    res.redirect(`/login?error=${err}`)
                }
            } else {
                const err = "Invalid username/password"
                res.redirect(`/login?error=${err}`)
            }

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    

    static async logout(req, res){
        try {
            await req.session.destroy((err) => {
                if(err) res.send(err)
                else {
                    res.redirect('/')
                }
            })
        } catch (error) {
            
        }
    }

}

module.exports = Controller