import { generateProducts } from "../../src/utils/utils.js";

const viewRegister = async (req, res) => {
  res.render("register");
};

const viewLogin = async (req, res) => {
  if (req.session.user) res.redirect("/api/products");
  res.render("login");
};

const viewProfile = (req, res) => {
  if (!req.session.user) res.redirect("/login");
  res.render("profile", { user: req.session.user });
};

const viewLogout = async (req, res) => {
  res.render("logout");
};

const viewResetPassword = async (req, res) => {
  const { code } = req.params.code;

  if (!code)
    return res.status(404).send({
      status: "error",
      error_description: " Código no autorizado.",
    });

  const link = await linksRepository.getLinkById({ codelink: code });

  if (!link)
    return res.status(400).send({ status: "error", error: "Link not found" });

  res.render("resetlink");
};

const resetBtn = async (req, res) => {
  //res.render('reset')
  res.render("resetbtn");
};

const viewMocking = async (req, res) => {
  let products = generateProducts();
  res.send(products);
};

const viewLogger = async (req, res) => {
  req.logger.warning(
    `Esto es un warning at ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  req.logger.info(
    `Esto es logger info at ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  req.logger.http(
    `Esto es un HTTP request at ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  req.logger.fatal(
    `Esto es un fatal at ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  req.logger.error(
    `Esto es un error at ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  req.logger.debug(
    `Esto es un debug at ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  res.status(200).send({ status: "success", message: "Prueba de loggers" });
};

export default{
  viewRegister,
  viewLogin,
  viewProfile,
  viewResetPassword,
  resetBtn,
  viewMocking,
  viewLogger,
  viewLogout
};
