import { Router, Request, Response } from "express";
import { CompanyController } from "../controllers/companyController.js";
import { BrandfetchService } from "../services/brandfetchService.js";

export function createCompanyRoutes(brandfetchApiKey: string): Router {
  const router = Router();
  const brandfetchService = new BrandfetchService(brandfetchApiKey);
  const companyController = new CompanyController(brandfetchService);

  // POST /api/analyze-company
  router.post("/analyze-company", (req: Request, res: Response) => {
    companyController.analyzeCompany(req, res);
  });

  return router;
}
