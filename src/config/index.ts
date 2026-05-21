import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path:path.join(process.cwd(),'.env')})

const config = {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL as string,

  access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,

  node_env: process.env.NODE_ENV || "development",
};

export default config;
