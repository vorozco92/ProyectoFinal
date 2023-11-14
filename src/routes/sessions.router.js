import { Router } from "express";
import sessionsController from '../controllers/sessions.controller.js'; 
import { authToken} from "../utils/utils.js";
import passport from "passport";

const router = Router();

router.post("/register", sessionsController.registerUser);
/*
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(404)
      .send({
        status: "error",
        error_description: "Todos los campos son obligatoios",
      });

  const user = await userModel.findOne(
    { email: email },
    { email: 1, first_name: 1, last_name: 1, password: 1 }
  );
  if (!user)
    return res.status(400).send({ status: "error", error: "User not found" });

  if (!isValidatePassword(user, password))
    return res
      .status(403)
      .send({ status: "error", error: "Incorrect credentials" });
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    rol: user.rol,
  };
  res.send({
    status: "success",
    payload: req.session.user,
    message: "Nuestro primer logueo",
  });
});*/

router.post(
  "/login",
  passport.authenticate("login", {
    passReqToCallback: true,
    session: false,
    failureRedirect: "api/sessions/failedLogin",
    failureMessage: true,
  }),
  sessionsController.loginUser
);

router.get("/failedLogin", sessionsController.failedLogin);

/**Logueo con github */

router.post(
  "/registerGit",
  passport.authenticate("registerGithub", { failureRedirect: "/failregister" }),
  sessionsController.registerGit
);

router.get("/failregister", async (req, res) => {
  res.send({ error: "failed" });
});

router.post(
  "/loginGit",
  passport.authenticate("loginGithub", { failureRedirect: "/faillogin" }),
  sessionsController.loginGithub
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  sessionsController.githubCallback
);

router.post("/logout", sessionsController.logout);

/**
 * router.post('/register',async(req,res)=>{
    const { first_name,last_name,email, age, password}=req.body;
    const exist =await userModel.findOne({email});

    if(exist) return res.status(400).send({status:"error",error:"Users already exists"})

    const user={
        first_name,
        last_name,
        email,
        age,
        password
    }
    let result = await userModel.create(user)
    res.send({status:"success",message:"User registered"})
})


router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    const user = await userModel.findOne({email,password});

    if(!user) return res.status(400).send({status:"error",error:"Incorrect credentials"})

    req.session.user={
        name: `${user.first_name} ${user.last_name}`,
        email:user.email,
        age: user.age
    }
    res.send({status:"success",payload:req.session.user, message:"Nuestro primer logueo"})
})
 */

router.post("/reset", sessionsController.reset);

router.post("/resetbyemail", sessionsController.resetByEmail);



router.get('current',authToken,(req,res)=>{
    res.send({status:"success", token: token})
})

export default router;
