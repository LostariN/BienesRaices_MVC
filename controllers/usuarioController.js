import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generarJWT, generarId } from '../helpers/token.js'
import { emailRegistro, emailReestablecido } from '../helpers/emails.js'
import bcrypt from 'bcrypt'



// get
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Inicia Sesion!!",
        csrfToken: req.csrfToken()
    })
}
const autenticar = async (req, res) => {
    const { email, password } = req.body;
    await check('email').isEmail().withMessage('Debe ser un Email valido').run(req);
    await check('password').notEmpty().withMessage('password Obligatorio').run(req);

    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: "Inicia Sesion",
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            email
        })
    }
    const usuario = await User.findOne({ where: { email } })
    if (!usuario) {
        return res.render('auth/login', {
            pagina: "Inicia Sesion",
            errores: [{ msg: "El usuario no existe" }],
            csrfToken: req.csrfToken()

        })
    }
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: "Inicia Sesion",
            errores: [{ msg: "El usuario no esta confirmado" }],
            csrfToken: req.csrfToken()

        })
    }
    if (!usuario.verificarPass(password)) {
        return res.render('auth/login', {
            pagina: "Inicia Sesion",
            errores: [{ msg: "Password incorrecto" }],
            csrfToken: req.csrfToken()

        })
    }
    const token = generarJWT({ id: usuario.id, name: usuario.name });

    return res.cookie('_token', token, {
        httpOnly: true,
        // secure:true,
        // sameSite:true
    }).redirect('/mis-propiedades')
}
const formularioRegistro = (req, res) => {


    res.render('auth/registro', {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken()
    })
}
const formularioOlvidePass = (req, res) => {
    res.render('auth/olvide-pass', {
        pagina: "Recupera tu Cuenta!.",
        csrfToken: req.csrfToken()
    })
}
//post
const resetPass = async (req, res) => {
    const { email } = req.body;

    await check('email').isEmail().withMessage('Debe ser un Email valido').run(req);

    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-pass', {
            errores: resultado.array(),
            pagina: "Recupera tu Cuenta!.",
            csrfToken: req.csrfToken()
        })

    }
    const existeUsario = await User.findOne({ where: { email: email } })
    if (!existeUsario) {
        return res.render('auth/olvide-pass', {
            pagina: "Recupera tu Cuenta!.",
            errores: [{ msg: 'El usuario no existe...' }],
            csrfToken: req.csrfToken()
        })
    }
    existeUsario.token = generarId();
    await existeUsario.save();

    emailReestablecido({
        nombre: existeUsario.name,
        email: existeUsario.email,
        token: existeUsario.token
    })

    res.render('templates/confirmacion', {
        pagina: "Instruciones recupera tu cuenta",
        mensaje: "Hemos enviado un Email con los pasos",
        csrfToken: req.csrfToken()
    })


}
const comprobarToken = async (req, res) => {
    const { token } = req.params
    const usuario = await User.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: "Hubo un error",
            mensaje: "Tu cuenta no ha podido ser reestablecida",
            error: true

        })
    }

    res.render('auth/reset-pass', {
        pagina: "Reestablece tu Password",
        csrfToken: req.csrfToken()

    })

}
const crearNuevoPass = async (req, res) => {

    const { password } = req.body;
    await check('password').isLength({ min: 4 }).withMessage('Debe tener un minimo de 4 caracteres').run(req);
    await check('repetir_pass').equals(password).withMessage('Las passwords deben ser iguales').run(req);

    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('auth/reset-pass', {
            pagina: "Reestablece tu pass",
            errores: resultado.array(),
            csrfToken: req.csrfToken()
        })

    }
    const { token } = req.params
    const usuario = await User.findOne({ where: { token } })

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: "Password Reestablecido",
        mensaje: "Tu password se guardo correctamente",
        error: false

    })


}

// post
const register = async (req, res) => {

    const { name, email, password } = req.body;

    await check('name').notEmpty().withMessage('El nombre no puede ir vacio').run(req);
    await check('email').isEmail().withMessage('Debe ser un Email valido').run(req);
    await check('password').isLength({ min: 4 }).withMessage('Debe tener un minimo de 4 caracteres').run(req);
    await check('repetir_pass').equals(password).withMessage('Las passwords deben ser iguales').run(req);

    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: "Crear Cuenta",
            errores: resultado.array(),
            usuario: {
                nombre: name,
                email: email
            },
            csrfToken: req.csrfToken()
        })

    }
    const existeUsario = await User.findOne({ where: { email: email } })
    if (existeUsario) {
        res.render('auth/registro', {
            pagina: "Crear Cuenta",
            errores: [{ msg: 'El usuario ya esta registrado...' }],
            usuario: {
                nombre: name,
                email: email
            },
            duplicate: true,
            csrfToken: req.csrfToken()
        })
    } else {
        const usuario = await User.create({
            name,
            email,
            password,
            token: generarId()
        })
        emailRegistro({
            nombre: usuario.name,
            email: usuario.email,
            token: usuario.token
        })
        // res.render('auth/registro', {
        //     pagina: "Crear Cuenta",
        //     success: {
        //         msg: `Usuario ${usuario.name} registrado existosamente!.`
        //     }
        // })

        res.render('templates/confirmacion', {
            pagina: "Cuenta Creada",
            mensaje: "Hemos enviado un Email de confirmacion",
            csrfToken: req.csrfToken()
        })

    }

}

const confirmarEmail = async (req, res) => {
    const { token } = req.params;

    const usuario = await User.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: "Hubo un error",
            mensaje: "Tu cuenta no ha podido ser confirmada!",
            error: true

        })
    }
    usuario.confirmado = true;
    usuario.token = null;


    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: "Cuenta Confirmada",
        mensaje: "Tu cuenta fue confirmada!",
        error: false

    })


}

const cerrarSesion = (req, res) => {
    return res.clearCookie().status(200).redirect('/auth/login')
}
export {

    formularioLogin,
    formularioRegistro,
    formularioOlvidePass,
    register,
    confirmarEmail,
    resetPass,
    comprobarToken,
    crearNuevoPass,
    autenticar,
    cerrarSesion
}