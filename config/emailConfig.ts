import dotenv from 'dotenv';
dotenv.config();
import nodemailer, { Transporter } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT), // also fix: port needs to be a number
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default transporter;