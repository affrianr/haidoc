const { Doctor, Patient, Appointment, Post } = require('../models')


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
            res.render('doctor-update-profile', { data, id })
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
            let {patient, date } = req.query
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
            res.render('doctor-appointment', { appointment, patient, date, id })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async deleteAppointment(req, res){
        try {
            let {id} = req.params
            let {appointmentId} = req.params
            let deleted = await Appointment.findOne({
                where: {
                    id : +appointmentId
                },
                include : Patient
            })
            await Appointment.destroy({
                where : {
                    id : +appointmentId
                }
            })
            console.log(deleted)
            res.redirect(`/doctor/${id}/appointment?patient=${deleted.Patient.name}&date=${deleted.appointmentDate}`)
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

    static async postDetail(req, res){
        try {
            let {id} = req.params
            let data = await Post.findByPk(id)
            res.render('post-detail', {data, id})
        } catch (error) {
            res.send(error)
        }
    }

    static async deletePost(req, res){
        try {
            let {id} = req.params
            let {postId} = req.params
            let data = await Post.findByPk(postId)
            await Post.destroy({
                where : {
                    id: +postId
                }
            })
            res.redirect(`/doctor/${id}/post-list`)
        } catch (error) {
            res.send(error)
        }
    }

    static async postList(req, res){
        try {
            let id = +req.params.id
            let data = await Post.findAll({
                where : {
                    DoctorId : +id
                }
            })

            res.render('doctor-post-list', { data, id })
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