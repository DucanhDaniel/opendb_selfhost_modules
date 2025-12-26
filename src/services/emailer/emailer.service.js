import axios from 'axios';
import logger from '../../utils/logger.js'
import { configDotenv } from 'dotenv';

configDotenv()

export async function sendForgotPasswordToken(email, content) {
    try {
        const response = await axios.post(process.env.EMAILER_ENDPOINT, 
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
            logger.info(`[Mail Success] Đã gửi link reset tới ${email}`);
        } else {
            logger.warn(`[Mail Warning] API trả về lỗi: ${JSON.stringify(response.data)}`);
        }

    } catch (error) {
        logger.error(`[Mail Failed] Lỗi kết nối API: ${error.message}`);
    }
}

