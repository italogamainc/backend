import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

// GET /tasks
app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// GET /tasks/:id
app.get(
  "/tasks/:id",
  [param("id").isInt().withMessage("ID must be an integer")],
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  }
);

// POST /tasks
app.post(
  "/tasks",
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a string")
      .isLength({ max: 150 })
      .withMessage("Title must not exceed 255 characters"),
    body("color")
      .notEmpty()
      .withMessage("Color is required")
      .isString()
      .withMessage("Color must be a string")
      .isLength({ max: 7 })
      .withMessage("Color must not exceed 7 characters (e.g., #FFFFFF)"),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { title, color } = req.body;
    const task = await prisma.task.create({
      data: { title, color, completed: false },
    });
    res.status(201).json(task);
  }
);

// PUT /tasks/:id
app.put(
  "/tasks/:id",
  [
    param("id").isInt().withMessage("ID must be an integer"),
    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string")
      .isLength({ max: 255 })
      .withMessage("Title must not exceed 255 characters"),
    body("color")
      .optional()
      .isString()
      .withMessage("Color must be a string")
      .isLength({ max: 7 })
      .withMessage("Color must not exceed 7 characters (e.g., #FFFFFF)"),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be a boolean"),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, color, completed } = req.body;

    try {
      const task = await prisma.task.update({
        where: { id: Number(id) },
        data: { title, color, completed },
      });

      res.json(task);
    } catch (error) {
      res.status(404).json({ error: "Task not found" });
    }
  }
);

// DELETE /tasks/:id
app.delete(
  "/tasks/:id",
  [param("id").isInt().withMessage("ID must be an integer")],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.task.delete({
        where: { id: Number(id) },
      });
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(404).json({ error: "Task not found" });
    }
  }
);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
