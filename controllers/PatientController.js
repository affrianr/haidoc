const { Doctor, Patient, Appointment } = require('../models')


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
            let UserId = req.session.userId
            let { id } = req.params
            let data = await Patient.findByPk(id)
            res.render('patient-update-profile', { data })
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
            await Doctor.update({ name, phone_number, address }, {
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
            res.render('patient-appointment-form', { id, doctorId})
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async appointmentPost(req, res){
        try {
            let PatientId = req.params.id
            let DoctorId = req.params.doctorId
            let {appointmentDate} = req.body
            
            await Appointment.create({PatientId, DoctorId, appointmentDate})
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
            let appoinment = await Appointment.findAll({
                include : [
                    { model : Doctor }
                ],
                where: {
                    PatientId : id
                }
            })

            res.render('patient-appoinment', { appoinment })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async appoinmentDelete(req, res){
        try {
            let { id } = req.params
            await Appointment.destroy({
                where : {
                PatientId : id
                }
            })
            res.redirect(`back`)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
    
    static async calorieForm(req, res){
        try {
            res.render('calorie-need')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async calorieNeed(req, res){
        try {
            let { gender, age, height, weight, activity_level, goal, approach } = req.body

            let totalCaloricNeeds = calculate.caloricNeeds({ gender, age, height, weight, activity_level, goal, approach })

            res.redirect(`/patient/:id/calorie?resutl=${totalCaloricNeeds}`)
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