import * as dotenv from 'dotenv';
import constants from './constants';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    jwtSecretKey: process.env.JWT_SECRET_KEY || "your_jwt_secret_key_here",
    roles: constants.roles,
    polygonAgencyId: (polygonId: string) => {
        // Placeholder for agency resolution logic
        return "agency_123";
    }
};

export default config;
