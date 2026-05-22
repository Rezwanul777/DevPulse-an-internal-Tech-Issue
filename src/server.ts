// import app from "./app"
// import config from "./config"
// import { initDB } from "./db"



// const main=()=>{
//     initDB()
//     app.listen(config.port, () => {
//       console.log(`Server running on port ${config.port}`)
//     })
    
// }

// main()


import app from "./app";
import { initDB } from "./db";

let dbInitialized = false;

async function bootstrap() {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  return app(req, res);
}