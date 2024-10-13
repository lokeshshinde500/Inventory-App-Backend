import inventoryModel from "../models/inventoryModel.js";
import csv from "csvtojson";
import CsvParser from "json2csv";

// ----------> normal CRUD operations <-----------

//create inventory
export const createInventory = async (req, res) => {
  try {
    const { name, quantity, category, supplierName, contactNumber } = req.body;

    // all fields are required
    if (!name || !quantity || !category || !supplierName || !contactNumber) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }

    // contact number validation
    const numberRegEx = /^\d{10}$/;
    if (!numberRegEx.test(contactNumber)) {
      return res.status(400).json({
        message: "Please, enter a valid contact number!",
        success: false,
      });
    }

    // store inventory
    const newInventory = {
      name,
      quantity,
      category,
      supplierName,
      contactNumber,
    };

    const createInventory = await inventoryModel.create(newInventory);

    return res.status(201).json({
      message: "Inventory created successfully.",
      inventory: createInventory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: error.message,
    });
  }
};

// get all inventory
export const getInventories = async (req, res) => {
  try {
    const inventories = await inventoryModel.find();

    if (!inventories || inventories.length === 0) {
      return res.status(404).json({
        message: "Inventories not found.",
        success: false,
      });
    }

    return res.status(200).json({
      inventories,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: error.message,
    });
  }
};

// get inventory by id
export const getInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found.",
        success: false,
      });
    }

    return res.status(200).json({
      inventory: inventory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: error.message,
    });
  }
};

// update inventory by id
export const updateInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found!",
        success: false,
      });
    }

    // new data
    const { name, quantity, category, supplierName, contactNumber } = req.body;

    // mobile number validation
    const numberRegEx = /^\d{10}$/;
    if (contactNumber && !numberRegEx.test(contactNumber)) {
      return res.status(400).json({
        message: "Please, enter a valid contact number!",
        success: false,
      });
    }

    // updating new data
    inventory.name = name || inventory.name;
    inventory.quantity = quantity || inventory.quantity;
    inventory.category = category || inventory.category;
    inventory.supplierName = supplierName || inventory.supplierName;
    inventory.contactNumber = contactNumber || inventory.contactNumber;

    // saving new document
    const updatedInventory = await inventory.save({ new: true });

    return res.status(200).json({
      message: "Inventory updated successfully.",
      inventory: updatedInventory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: error.message,
    });
  }
};

// delete inventory by id
export const deleteInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Inventory deleted successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: error.message,
    });
  }
};

// ---------> For csv bulk operation <---------

// import csv from user
export const importCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No CSV file found!", success: false });
    }

    const data = [];
    const response = await csv().fromFile(req.file.path);

    for (const row of response) {
      data.push({
        name: row.name,
        quantity: row.quantity,
        category: row.category,
        supplierName: row.supplierName,
        contactNumber: row.contactNumber,
      });
    }

    await inventoryModel.insertMany(data);

    return res.status(200).json({
      message: "Csv file uploaded successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: error.message,
    });
  }
};

// export csv file to user
export const exportCsv = async (req, res) => {
  try {
    const data = [];
    const inventoryData = await inventoryModel.find();

    inventoryData.forEach((value) => {
      const { name, quantity, category, supplierName, contactNumber } = value;
      data.push({
        name,
        quantity,
        category,
        supplierName,
        contactNumber,
      });
    });

    const csvFields = [
      "Name",
      "Quantity",
      "Category",
      "SupplierName",
      "ContactNumber",
    ];

    const csvParser = new CsvParser.Parser({ csvFields });
    const csvData = csvParser.parse(data);

    // setting headers
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventoryData.csv"
    );
    return res.status(200).end(csvData);
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: error.message,
    });
  }
};
