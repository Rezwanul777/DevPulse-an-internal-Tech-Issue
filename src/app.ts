import express, {
  type Application,
  type Request,
  type Response,
} from "express";



//import logger from "./middleware/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorhandelar";
import { AuthRoutes } from "./modules/auth/auth.route";
import notFound from "./middleware/notFound";
import { IssueRoutes } from "./modules/isuues/issue.route";




const app: Application = express();


app.use(cookieParser());

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

// Routes

app.use("/api/auth",AuthRoutes);
app.use("/api/issues", IssueRoutes);



// Not Found Middleware
app.use(notFound);
// Global Error Handler
app.use(globalErrorHandler);

export default app;
