import { Router } from "express";
import inventoryRoutes from "./inventoryRoutes.js";
const routes = Router();

// inventory routes
routes.use("/inventory", inventoryRoutes);

export default routes;
