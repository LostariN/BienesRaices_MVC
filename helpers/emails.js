import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const { nombre, email, token } = datos
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    await transport.sendMail({
        from: 'bienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta',
        text: 'confimar tu Cuenta',
        html:
            `   <p> Hola ${nombre}, comprueba tu cuenta en bienesraices.com</p>
            <p>Tu cuenta ${nombre} ya esta lista solo debes confirmarla en:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a></p>
            <p> Si no lo has creado tu porfavor ignora este mensaje!</p>
        `
    })
}
const emailReestablecido = async (datos) => {
    const { nombre, email, token } = datos
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    await transport.sendMail({
        from: 'bienesRaices.com',
        to: email,
        subject: 'Reestablece tu password pajaron',
        text: 'Reestablece tu password',
        html:
            `   <p> Hola ${nombre}, Aqui podras cambiar tu pass en bienesraices.com</p>
            <p>TSigue el siguiente enlace para proceder:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-pass/${token}">Reestablece tu cuenta</a></p>
            <p> Si no lo has solicitado esto tu porfavor ignora este mensaje!</p>
        `
    })
}

export {
    emailRegistro,
    emailReestablecido
}