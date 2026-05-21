import { pool } from "../../db";

const createIssueIntoDB = async (payload: any, user: any) => {
  const { title, description, type } = payload;

  if (!title || !description || !type) {
    throw new Error("Title, description and type are required");
  }

  if (title.length > 150) {
    throw new Error("Title cannot be more than 150 characters");
  }

  if (description.length < 20) {
    throw new Error("Description must be at least 20 characters");
  }

  if (type !== "bug" && type !== "feature_request") {
    throw new Error("Type must be bug or feature_request");
  }

  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [title, description, type, user.id]
  );

  return result.rows[0];
};


export const IssueService = {
  createIssueIntoDB
}