import { createRequire } from 'module'; const require = createRequire(import.meta.url);

// src/app.ts
import express3 from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// src/middleware/globalErrorhandelar.ts
import "express";
var globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: err.message || "Internal Server Error"
  });
};
var globalErrorhandelar_default = globalErrorHandler;

// src/modules/auth/auth.route.ts
import express from "express";

// src/modules/auth/auth.controller.ts
import "express";
import { StatusCodes } from "http-status-codes";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  port: process.env.PORT || 5e3,
  database_url: process.env.DATABASE_URL,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  node_env: process.env.NODE_ENV || "development"
};
var config_default = config;

// src/utils/catchAsync.ts
import "express";
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
var catchAsync_default = catchAsync;

// src/utils/sendResponse.ts
var sendResponse = (res, response) => {
  res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data
  });
};
var sendResponse_default = sendResponse;

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// src/db/index.ts
import { Pool } from "pg";
var pool = new Pool({
  connectionString: config_default.database_url,
  ssl: {
    rejectUnauthorized: false
  }
});
var initDB = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(20) DEFAULT 'contributor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CHECK (role IN ('contributor', 'maintainer'))
    );
  `);
    await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(30) NOT NULL,
      status VARCHAR(30) DEFAULT 'open',
      reporter_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CHECK (type IN ('bug', 'feature_request')),
      CHECK (status IN ('open', 'in_progress', 'resolved')),
      CHECK (char_length(description) >= 20)
    );
  `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// src/modules/auth/auth.service.ts
var signup = async (payload) => {
  const { name, email, password, role } = payload;
  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }
  if (role && role !== "contributor" && role !== "maintainer") {
    throw new Error("Role must be contributor or maintainer");
  }
  const existingUser = await pool.query(
    `
      SELECT *
      FROM users
      WHERE email = $1
    `,
    [email]
  );
  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role || "contributor"]
  );
  return result.rows[0];
};
var login = async (payload) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const result = await pool.query(
    `
      SELECT *
      FROM users
      WHERE email = $1
    `,
    [email]
  );
  const user = result.rows[0];
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role
  };
  const accessToken = jwt.sign(jwtPayload, config_default.access_token_secret, {
    expiresIn: "15d"
  });
  const refreshToken = jwt.sign(jwtPayload, config_default.refresh_token_secret, {
    expiresIn: "30d"
  });
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  };
};
var AuthService = {
  signup,
  login
};

// src/modules/auth/auth.controller.ts
var signup2 = catchAsync_default(async (req, res) => {
  const result = await AuthService.signup(req.body);
  sendResponse_default(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: result
  });
});
var login2 = catchAsync_default(async (req, res) => {
  const result = await AuthService.login(req.body);
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: config_default.node_env === "production",
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1e3
  });
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: config_default.node_env === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1e3
  });
  sendResponse_default(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login successful",
    data: {
      token: result.accessToken,
      user: result.user
    }
  });
});
var AuthController = {
  signup: signup2,
  login: login2
};

// src/modules/auth/auth.route.ts
var router = express.Router();
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
var AuthRoutes = router;

// src/middleware/notFound.ts
import "express";
var notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "API not found",
    errors: `Cannot ${req.method} ${req.originalUrl}`
  });
};
var notFound_default = notFound;

// src/modules/isuues/issue.route.ts
import express2 from "express";

// src/middleware/auth.ts
import jwt2 from "jsonwebtoken";
var auth = (...requiredRoles) => {
  return (req, res, next) => {
    try {
      let token = req.headers.authorization;
      if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }
      if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
          errors: "Access token is missing"
        });
      }
      const decoded = jwt2.verify(token, config_default.access_token_secret);
      req.user = decoded;
      if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
          errors: "You do not have permission to access this route"
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        errors: "JWT verification failed"
      });
    }
  };
};
var auth_default = auth;

// src/modules/isuues/issue.service.ts
var createIssueIntoDB = async (payload, user) => {
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
var getAllIssuesFromDB = async (query) => {
  const sort = query.sort === "oldest" ? "ASC" : "DESC";
  const values = [];
  const conditions = [];
  if (query.type) {
    values.push(query.type);
    conditions.push(`type = $${values.length}`);
  }
  if (query.status) {
    values.push(query.status);
    conditions.push(`status = $${values.length}`);
  }
  const whereText = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
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
  for (const issue of issues) {
    const reporterResult = await pool.query(
      `
        SELECT id, name, role
        FROM users
        WHERE id = $1
      `,
      [issue.reporter_id]
    );
    finalResult.push({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporterResult.rows[0],
      created_at: issue.created_at,
      updated_at: issue.updated_at
    });
  }
  return finalResult;
};
var getSingleIssueFromDB = async (id) => {
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
    updated_at: issue.updated_at
  };
};
var updateIssueIntoDB = async (id, payload, user) => {
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
  if (payload.status) {
    if (payload.status !== "open" && payload.status !== "in_progress" && payload.status !== "resolved") {
      throw new Error("Status must be open, in_progress, or resolved");
    }
  }
  const title = payload.title !== void 0 ? payload.title : issue.title;
  const description = payload.description !== void 0 ? payload.description : issue.description;
  const type = payload.type !== void 0 ? payload.type : issue.type;
  const status = payload.status !== void 0 ? payload.status : issue.status;
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
var deleteIssueFromDB = async (id) => {
  const issueResult = await pool.query(
    `
      SELECT *
      FROM issues
      WHERE id = $1
    `,
    [id]
  );
  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }
  await pool.query(
    `
      DELETE FROM issues
      WHERE id = $1
    `,
    [id]
  );
  return null;
};
var IssueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB
};

// src/modules/isuues/issue.controller.ts
import { StatusCodes as StatusCodes2 } from "http-status-codes";
var createIssue = catchAsync_default(async (req, res) => {
  const result = await IssueService.createIssueIntoDB(req.body, req.user);
  sendResponse_default(res, {
    statusCode: StatusCodes2.CREATED,
    success: true,
    message: "Issue created successfully",
    data: result
  });
});
var getAllIssues = catchAsync_default(async (req, res) => {
  const result = await IssueService.getAllIssuesFromDB(req.query);
  sendResponse_default(res, {
    statusCode: StatusCodes2.OK,
    success: true,
    data: result
  });
});
var getSingleIssue = catchAsync_default(async (req, res) => {
  const result = await IssueService.getSingleIssueFromDB(Number(req.params.id));
  sendResponse_default(res, {
    statusCode: StatusCodes2.OK,
    success: true,
    data: result
  });
});
var updateIssue = catchAsync_default(async (req, res) => {
  const result = await IssueService.updateIssueIntoDB(
    Number(req.params.id),
    req.body,
    req.user
  );
  sendResponse_default(res, {
    statusCode: StatusCodes2.OK,
    success: true,
    message: "Issue updated successfully",
    data: result
  });
});
var deleteIssue = catchAsync_default(async (req, res) => {
  await IssueService.deleteIssueFromDB(Number(req.params.id));
  sendResponse_default(res, {
    statusCode: StatusCodes2.OK,
    success: true,
    message: "Issue deleted successfully"
  });
});
var IssueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue
};

// src/modules/isuues/issue.route.ts
var router2 = express2.Router();
router2.post("/", auth_default("contributor", "maintainer"), IssueController.createIssue);
router2.get("/", IssueController.getAllIssues);
router2.get("/:id", IssueController.getSingleIssue);
router2.patch("/:id", auth_default("contributor", "maintainer"), IssueController.updateIssue);
router2.delete("/:id", auth_default("maintainer"), IssueController.deleteIssue);
var IssueRoutes = router2;

// src/app.ts
var app = express3();
app.use(cookieParser());
app.use(express3.json());
app.use(express3.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true
  }
));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", AuthRoutes);
app.use("/api/issues", IssueRoutes);
app.use(notFound_default);
app.use(globalErrorhandelar_default);
var app_default = app;

// src/server.ts
var dbInitialized = false;
async function bootstrap() {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }
}
async function handler(req, res) {
  await bootstrap();
  return app_default(req, res);
}
export {
  handler as default
};
//# sourceMappingURL=server.js.map