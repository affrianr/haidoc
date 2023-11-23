const { Doctor, Patient, Appointment, Post } = require('../models')
const calculate = require('fitness-health-calculations');

class Controller {
    static async home(req, res){
        try {
            let { id } = req.params
            res.render('doctor-page', { id })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async updateProfileForm(req, res){
        try {
            let { id } = req.params
            let data = await Doctor.findByPk(id)
            res.render('doctor-update-profile', { data })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async updateProfilePost(req, res){
        try {
            let UserId = req.session.userId
            let { id } = req.params
            let doctor = await Doctor.findByPk(id)
            let { name, phone_number, specialty, address, profile_picture } = req.body
            await Doctor.update({ name, phone_number, specialty, address, profile_picture}, {
                where : {
                    UserId
                }
            })
            res.redirect(`/doctor/${doctor.id}`)
        } catch (error) {
            let { id } = req.params
            if(error.name === "SequelizeValidationError"){
                const err = error.errors.map(el=> el.message)
                res.redirect(`/doctor/${id}/profile-update?error=${err}`)
            } else {
                console.log(error)
                res.send(error)
            }
        }
    }

    static async appointmentList(req, res){
        try {
            let UserId = req.session.userId
            let { id } = req.params
            let appointment = await Appointment.findAll({
                include : [
                    { model : Patient }
                ],
                where : {
                    DoctorId : id
                }
            })
            // res.send(appointment)
            // console.log(appointment)
            res.render('doctor-appointment', { appointment })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async createPostForm(req, res){
        try {
            let {id} = req.params
            let { error } = req.query
            res.render('doctor-create-post', {error, id})
        } catch (error) {
            console.log(error)
            res.render(error)
        }
    }

    static async createPost(req, res){
        try {
            let DoctorId = +req.params.id
            let { title, highlight, description, picture} = req.body
            await Post.create(title, highlight, description, DoctorId, picture)
        } catch (error) {
            let { id } = req.params
            if(error.name === "SequelizeValidationError"){
                const err = error.errors.map(el=> el.message)
                res.redirect(`/doctor/${id}/profile-update?error=${err}`)
            } else {
                console.log(error)
                res.send(error)
            }
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