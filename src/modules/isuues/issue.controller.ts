import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IssueService } from "./issue.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createIssue = catchAsync(async (req: Request, res: Response) => {
  const result = await IssueService.createIssueIntoDB(req.body, req.user);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Issue created successfully",
    data: result,
  })
});

export const IssueController={
    createIssue
}