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

const getAllIssues = catchAsync(async (req: Request, res: Response) => {
  const result = await IssueService.getAllIssuesFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: result,
  });
});

const getSingleIssue = catchAsync(async (req: Request, res: Response) => {
  const result = await IssueService.getSingleIssueFromDB(Number(req.params.id));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: result,
  });
});


const updateIssue = catchAsync(async (req: Request, res: Response) => {
  const result = await IssueService.updateIssueIntoDB(
    Number(req.params.id),
    req.body,
    req.user
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Issue updated successfully",
    data: result,
  });
});

const deleteIssue = catchAsync(async (req: Request, res: Response) => {
  await IssueService.deleteIssueFromDB(Number(req.params.id));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Issue deleted successfully",
  });
});


export const IssueController={
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}