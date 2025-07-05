import { Router, Request, Response } from "express";
import { QuestionOptimizationController } from "../controllers/questionOptimizationController.js";

export function createQuestionOptimizationRoutes(): Router {
  const router = Router();
  const controller = new QuestionOptimizationController();

  router.post("/optimize", (req: Request, res: Response) => {
    controller.optimizeQuestions(req, res);
  });

  return router;
}
