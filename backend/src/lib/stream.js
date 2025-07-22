
import { StreamChat } from 'stream-chat';
import "dotenv/config";
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_KEY_SECRET;
if (!apiKey || !apiSecret) {
    console.error('STREAM_API_KEY and STREAM_API_KEY_SECRET must be set in the environment variables');}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);
const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
        }
        
        
     catch (error) {
        console.error('Error creating/updating Stream user:', error);
    }
} 