import express from "express";
import auth from "../../middleware/auth";
import { IssueController } from "./issue.controller";


const router = express.Router();

router.post("/", auth("contributor", "maintainer"), IssueController.createIssue);


export const IssueRoutes = router;