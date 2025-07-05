import { Router, Request, Response } from "express";
import { DomainComparisonController } from "../controllers/domainComparisonController.js";

export function createDomainComparisonRoutes(): Router {
  const router = Router();
  const domainComparisonController = new DomainComparisonController();

  router.post("/analyze", (req: Request, res: Response) => {
    domainComparisonController.analyzeDomainComparison(req, res);
  });

  return router;
}
