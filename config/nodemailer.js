import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.user,
        pass: process.env.password
    }
})

export default transport