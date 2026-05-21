import express, {
  type Application,
  type Request,
  type Response,
} from "express";



//import logger from "./middleware/logger";
//import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorhandelar";




const app: Application = express();


//app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(logger);
 
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});



// Global Error Handler
app.use(globalErrorHandler);

export default app;
