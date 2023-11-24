const { Doctor, Patient, Appointment, Post } = require('../models')
const calculate = require('fitness-health-calculations');

class Controller {
    static async home(req, res){
        try {
            let { id } = req.params
            res.render('patient-page', { id })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async updateProfileForm(req, res){
        try {
            let { id } = req.params
            let data = await Patient.findByPk(id)
            res.render('patient-update-profile', { data, id })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async updateProfilePost(req, res){
        try {
            let UserId = req.session.userId
            let { id } = req.params
            let patient = await Patient.findByPk(id)
            let { name, phone_number, address } = req.body
            await Patient.update({ name, phone_number, address }, {
                where : {
                    UserId
                }
            })
            res.redirect(`/patient/${patient.id}`)
        } catch (error) {
            let {id} = req.params
            if(error.name === "SequelizeValidationError"){
                const err = error.errors.map(el=> el.message)
                res.redirect(`/patient/${id}/update-profile?error=${err}`)
            } else {
                console.log(error)
                res.send(error)
            }
        }
    }

    static async doctorList(req, res){
        try {
            let UserId = req.session.userId
            let { id } = req.params
            let doctor = await Doctor.showDoctor()
            // res.send(appointment)
            // console.log(appointment)
            res.render('patient-doctor-list', { doctor, id })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async appointmentForm(req, res){
        try {
            let { id } = req.params
            let { doctorId } = req.params
            let doctor = await Doctor.findByPk(doctorId)
            res.render('patient-appointment-form', { id, doctor})
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async appointmentPost(req, res){
        try {
            let PatientId = req.params.id
            let DoctorId = req.params.doctorId
            let {appointmentDate, symptoms} = req.body
            
            await Appointment.create({PatientId, DoctorId, appointmentDate, symptoms})
            res.redirect(`/patient/${PatientId}/doctor-list`)
        } catch (error) {
            let {id} = req.params
            let {doctorId} = req.params
            if(error.name === "SequelizeValidationError"){
                const err = error.errors.map(el=> el.message)
                res.redirect(`/patient/${id}/appointment/${doctorId}?error=${err}`)
            } else {
                console.log(error)
                res.send(error)
            }
        }
    }

    static async appointmentList(req, res){
        try {
            let { id } = req.params
            let {doctor, date} = req.query

            let appointment = await Appointment.findAll({
                include : [
                    { model : Doctor }
                ],
                where: {
                    PatientId : id
                }
            })
            // console.log(appointment.dataValues)
            res.render('patient-appointment', { appointment, doctor, date, id})
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postDetail(req, res){
        try {
            let {id} = req.params
            let data = await Post.findByPk(id)
            res.render('post-detail', {data})
        } catch (error) {
            res.send(error)
        }
    }

    static async postList(req, res){
        try {
            let data = await Post.findAll()
            res.render('patient-post-list', { data })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    
    static async calorieForm(req, res){
        try {
            let { id } = req.params
            let { result } = req.query
            res.render('calorie-need', { id, result })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async calorieNeed(req, res){
        try {
            let { gender, age, height, weight, activity_level, goal } = req.body
            let gender1 = gender
            let age1 = +age
            let height1 = +height
            let weight1 = +weight
            let activ = activity_level
            let goal1 = goal
            let totalCaloricNeeds = calculate.caloricNeeds(gender1,age1,height1,weight1,activ, goal1)

            res.redirect(`/patient/:id/calorie?result=${totalCaloricNeeds}`)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async deleteAppointment(req, res){
        try {
            let {id} = req.params
            let { doctorId } = req.params
            let deleted = await Appointment.findOne({
                where: {
                    DoctorId : +doctorId
                },
                include : Doctor
            })
            await Appointment.destroy({
                where : {
                    DoctorId: +doctorId
                }
            })
            console.log(deleted)
            res.redirect(`/patient/${id}/appointment?doctor=${deleted.Doctor.name}&date=${deleted.appointmentDate}`)
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
            console.log(error)
            res.send(err)
        }
    }
}

module.exports = Controller