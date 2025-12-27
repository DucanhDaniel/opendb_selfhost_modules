import axios from 'axios';
import logger from '../../utils/logger.js'
import { configDotenv } from 'dotenv';

configDotenv()

export async function sendForgotPasswordToken(email, content) {
    try {
        const response = await axios.post(process.env.FORGOT_PASSWORD_SMTP_ENDPOINT, 
            {
                email: email,
                otp: content 
            },
            {
                headers: {
                    'Content-Type': 'application/json' 
                }
            }
        );

        if (response.data && response.data.ok) {
            logger.info(`[Mail Success] Đã gửi OTP reset tới ${email}`);
        } else {
            logger.warn(`[Mail Warning] API trả về lỗi: ${JSON.stringify(response.data)}`);
        }

    } catch (error) {
        logger.error(`[Mail Failed] Lỗi kết nối API: ${error.message}`);
    }
}

export async function sendEmail(email, subject, body) {
    try {
        const response = await axios.post(process.env.ABSTRACT_SMTP_ENDPOINT, 
            {
                key: process.env.SMTP_API_KEY,
                to: email,
                subject: subject,
                body: body
            },
            {
                headers: {
                    'Content-Type': 'application/json' 
                }
            }
        );

        if (response.data && response.data.status) {
            logger.info(`[Mail Success] Đã gửi email tới ${email}`);
        } else {
            logger.warn(`[Mail Warning] API trả về lỗi: ${JSON.stringify(response.data)}`);
        }

    } catch (error) {
        logger.error(`[Mail Failed] Lỗi kết nối API: ${error.message}`);
    }
}


