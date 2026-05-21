import { type Request, type Response } from "express";

const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API not found",
  });
};

export default notFound;