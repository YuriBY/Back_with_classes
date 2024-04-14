import nodemailer from "nodemailer";
import { appConfig } from "../common/config/appConfi";

export const emailAdapter = {
  async sendMail(
    email: string,
    subject: string,
    status?: string,
    code?: string
  ) {
    const generateHTML = (
      status?: string,
      code?: string
    ): string | undefined => {
      if (status === "toSend") {
        return `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
        </p>`;
      } else if (status === "toReSend") {
        return `<h1> Input data is accepted.</h1> 
        <p>Email with confirmation code will be send to passed email address. 
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
        </p>`;
      } else if (status === "toRecover") {
        return `<h1>Password recovery</h1> 
        <p>To finish password recovery please follow the link below:
        <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
        </p>`;
      } else {
        return undefined;
      }
    };

    let transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: appConfig.EMAIL,
        pass: appConfig.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let info = await transporter.sendMail({
      from: `Admin <${appConfig.EMAIL}>`,
      to: email,
      subject: subject,
      html: generateHTML(status, code),
    });
  },
};
