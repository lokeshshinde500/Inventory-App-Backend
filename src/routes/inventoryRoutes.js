import { Router } from "express";
import {
  createInventory,
  deleteInventory,
  exportCsv,
  getInventories,
  getInventory,
  importCsv,
  updateInventory,
} from "../controllers/inventoryController.js";
import { upload } from "../models/inventoryModel.js";

const routes = Router();

// ----------> Normal CRUD Operations <-----------

// Create new inventory
routes.post("/", createInventory);

// Get all inventories
routes.get("/", getInventories);

// Get a single inventory by ID
routes.get("/:id/single", getInventory);

// Update inventory by ID
routes.patch("/:id", updateInventory);

// Delete inventory by ID
routes.delete("/:id", deleteInventory);

// ----------> Bulk Operations for CSV <-----------

// Import CSV
routes.post("/import", upload, importCsv);

// Export CSV file
routes.get("/export", exportCsv);

export default routes;
