/* eslint-disable global-require */
const nodemailer = require("nodemailer");
const fs = require("fs-extra");
const path = require("path");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn("Unable to connect to email server. Make sure you have configured the SMTP options in .env")
    );
}

const loadTemplates = async (type, variables, lng = "") => {
  const versions = { html: "html.mjml", text: "plain.txt" };
  return (
    await Promise.all(
      Object.keys(versions).map((v) => {
        const src = path.join(__dirname, "..", "templates", "email", type, lng, versions[v]);
        return [v, fs.readFileSync(src, { encoding: "utf-8" })];
      })
    )
  ).reduce((prev, curr) => {
    let [version, content] = curr;
    if (version === "html") {
      content = mjml2html(content, { beautify: true }).html;
    }
    if (variables) {
      const tpl = Handlebars.compile(content);
      content = tpl(variables);
    }
    prev[version] = content;
    return prev;
  }, {});
};

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.admin.url}/forgot-password/reset?token=${token}`;
  const { html, text } = await loadTemplates("reset-password", {
    resetPasswordUrl,
  });
  await sendEmail(to, subject, text, html);
};

/**
 * Send password email
 * @param {string} to
 * @param {string} password
 * @returns {Promise}
 */
const sendPasswordEmail = async (to, password) => {
  const subject = "Temporary password";
  const changePasswordUrl = `${config.admin.url}/change-password`;
  const { html, text } = await loadTemplates("new-password", {
    password,
    changePasswordUrl,
  });
  await sendEmail(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendPasswordEmail,
  sendResetPasswordEmail,
};
