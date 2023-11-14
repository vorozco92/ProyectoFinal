import { createHash, generateToken ,generateLink} from "../utils/utils.js";
import CONFIG from '../config/config.js'
import { UsersRepository } from "../repositories/Users.repository.js";
import { LinksRepository } from "../repositories/Links.repository.js";
import { CartsRepository } from "../repositories/Carts.repository.js";
import MailingService from '../services/mailing.js';


const usersRepository =new UsersRepository()
const linksRepository =new LinksRepository()
const cartsRepository =new CartsRepository()

const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    let exist = await usersRepository.getUserById({ email: email });
    if (exist)
      return res
        .status(400)
        .send({ status: "error", error: "Ya esta registrado este correo" });
  
    const user = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
    };
  
    if (email == CONFIG.EMAIL_ADMIN && password == CONFIG.PASSWORD_ADMIN)
      user.role = "admin";
  
    let resr = await usersRepository.saveUser(user);
    return res
      .status(200)
      .send({ status: "success", msj: "Te registraste correctamente" });
  }
  
const loginUser = async(req, res) => {

    const user = await usersRepository.getUserById({email:req.body.email});
    const serialUser = {
      id: user._id,
      name: `${user.first_name}`,
      role: user.role,
      email: user.email,
    };
    req.session.user = serialUser;

    //check if has cart 
    if (user.role == 'user'){
      let cartUser = await cartsRepository.getCartByIdUser(user._id)
      if (! cartUser){
        let newCart = {
          user: user
        }
        let cart =  await cartsRepository.saveCart(newCart);
       }
    }


    const access_token = generateToken(serialUser);
    res
      .cookie("access_token", access_token, { maxAge: 36000000 })
      .send({ status: "success", payload: serialUser , token : access_token });
  }

const failedLogin  = (req, res) => {
    //console.log(req.message);
    console.log('failed login')
    res.send({status:'error', message: 'failed login'})
}

const registerGit = async (req, res) => {
    res.send({ status: "success", message: "User Register" });
  }

const loginGithub =   async (req, res) => {
    console.log("Probando el ingreso a la estrategia");

    const { email, password } = req.body;

    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "Incorrect Password" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    res.send({ status: "success", payload: req.user});
  }

const resetByEmail = async (req, res) => {
    const { email} = req.body;
  
    if (!email)
      return res
        .status(404)
        .send({
          status: "error",
          error_description: "Todos los campos son obligatoios",
        });
  
    const user = await usersRepository.getUserById({ email: email });
  
    if (!user)
      return res.status(400).send({ status: "error", error: "User not found" });
  
      let link = await generateLink(user);
      console.log(link);
      let linkComp = req.url+'/'+link.codelink;
      const mailer = new MailingService();
      const result = await mailer.sendSimpleMail({
          from:'Ecommerce',
          to: user.email,
          subject:"Reseteo de contraseña",
          html:`<div><h1>Hola ${user.first_name}!</h1>
          <p> En el siguiente link podras resetear tu contraseña:</p>
          <form method="GET" action="${linkComp}">
          <input type="hidden" value="${link.codelink}" name="code">
          <button type="submit">Resetear contraseña</button>
          </form>
          <p>El link expirará en 1 hora.</p>
          </div>`
      })
      console.log(result);
  
    res.send({
      status: "success",
      message: "Se envio un correo para reestablecer su contraseña.",
    });
  }

const reset = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password)
      return res
        .status(404)
        .send({
          status: "error",
          error_description: "Todos los campos son obligatoios",
        });
  
    const user = await usersRepository.getUserById({ email: email });
  
    if (!user)
      return res.status(400).send({ status: "error", error: "User not found" });
  
    user.password = password;
    user.save();
  
    res.send({
      status: "success",
      message: "Contraseña reseteada correctamente",
    });
  }

const logout = async (req, res) => {
    if (req.session.user) req.session.destroy();
    res.redirect("/logout");
  }

const githubCallback =   async (req, res) => {
    req.session.user = req.user;

    res.redirect("/api/products");
  }
export default{
    registerUser,
    loginUser,
    failedLogin,
    registerGit,
    loginGithub,
    resetByEmail,
    reset,
    logout,
    githubCallback
}