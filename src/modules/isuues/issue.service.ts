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




const getAllIssuesFromDB = async (query: any) => {
  //   sorting order
  const sort = query.sort === "oldest" ? "ASC" : "DESC";

  // . for filtering
  const values: any[] = [];
  const conditions: string[] = [];

  //  If user sends ?type=bug, add  type filter
  if (query.type) {
    values.push(query.type);
    conditions.push(`type = $${values.length}`);
  }

  //  If user sends ?status=open, add status filter
  if (query.status) {
    values.push(query.status);
    conditions.push(`status = $${values.length}`);
  }

  //  only if filter exists
  const whereText =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  //   get issues from table
  const issuesResult = await pool.query(
    `
      SELECT *
      FROM issues
      ${whereText}
      ORDER BY created_at ${sort}
    `,
    values
  );

  const issues = issuesResult.rows;

  const finalResult = [];

  // 7. For every issue, get reporter details separately
  for (const issue of issues) {
    const reporterResult = await pool.query(
      `
        SELECT id, name, role
        FROM users
        WHERE id = $1
      `,
      [issue.reporter_id]
    );

    // response
    finalResult.push({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporterResult.rows[0],
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    });
  }

  return finalResult;
};


const getSingleIssueFromDB = async (id: number) => {
  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id = $1
    `,
    [id]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  const reporterResult = await pool.query(
    `
      SELECT id, name, role
      FROM users
      WHERE id = $1
    `,
    [issue.reporter_id]
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporterResult.rows[0],
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};


const updateIssueIntoDB = async (id: number, payload: any, user: any) => {
  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id = $1
    `,
    [id]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  // Contributor role
  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new Error("You can update only your own issue");
    }

    if (issue.status !== "open") {
      throw new Error("You can update only open issue");
    }

  
    if (payload.status) {
      throw new Error("Contributor cannot update issue status");
    }
  }

  // Maintainer can update status
  if (payload.status) {
    if (
      payload.status !== "open" &&
      payload.status !== "in_progress" &&
      payload.status !== "resolved"
    ) {
      throw new Error("Status must be open, in_progress, or resolved");
    }
  }

  const title = payload.title !== undefined ? payload.title : issue.title;
  const description =
    payload.description !== undefined ? payload.description : issue.description;
  const type = payload.type !== undefined ? payload.type : issue.type;
  const status = payload.status !== undefined ? payload.status : issue.status;

  if (title.length > 150) {
    throw new Error("Title cannot be more than 150 characters");
  }

  if (description.length < 20) {
    throw new Error("Description must be at least 20 characters");
  }

  if (type !== "bug" && type !== "feature_request") {
    throw new Error("Type must be bug or feature_request");
  }

  const updatedResult = await pool.query(
    `
      UPDATE issues
      SET title = $1,
          description = $2,
          type = $3,
          status = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `,
    [title, description, type, status, id]
  );

  return updatedResult.rows[0];
};



export const IssueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB
}
  
