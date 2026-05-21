import { type Request, type Response } from "express";

const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API not found",
    errors: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

export default notFound;