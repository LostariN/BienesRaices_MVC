
import bcrypt from 'bcrypt'

const usuarios = [{
    name: "esteban",
    password: bcrypt.hashSync('123456', 10),
    confirmado: 1,
    email: "esteban@esteban.com"

}]

export default usuarios;