import express from "express";
import Warehouse from "../models/warehouse.model.js";
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subcategory.model.js';
import OrderModel from '../models/order.model.js';
import mongoose from 'mongoose';
import ProductModel from '../models/product.model.js';
import WarehouseProductStock from '../models/warehouseProductStock.model.js';

export async function getProductsByUserLocation(req, res) {
  try {
      const { latitude, longitude } = req.query;

      if (!latitude || !longitude) {
          return res.status(400).json({
              message: "User location required",
              success: false,
              error: true
          });
      }

      const warehouses = await warehouseModel.find(); // location: { lat, lng }

      const nearest = findNearestWarehouse({ latitude, longitude }, warehouses);

      if (!nearest) {
          return res.status(404).json({
              message: "No warehouse found near your location",
              success: false,
              error: true
          });
      }

      const warehouseStocks = await warehouseStockModel.find({ warehouse: nearest._id })
          .populate("product");

      return res.json({
          message: "Products near your location",
          success: true,
          error: false,
          warehouse: nearest.name,
          products: warehouseStocks
      });

  } catch (error) {
      res.status(500).json({
          message: error.message || "Server error",
          success: false,
          error: true
      });
  }
}

export const upsertStockForProduct = async (req, res) => {
  try {
    const { warehouseId, productId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(warehouseId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid warehouse or product ID' });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a non-negative number' });
    }

    // Upsert stock
    const updated = await WarehouseProductStock.findOneAndUpdate(
      { product: productId, warehouse: warehouseId },
      { stock: quantity },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: 'Stock updated', data: updated });
  } catch (err) {
    res.status(500).json({ 
      success: false,     
      message: err.message || err,
    });
  }
};
// count all Categories Subcategories Products Orders Warehouses
export async function CountAllDetails(req, res) {
  try {
    const [
      categoryCount,
      subCategoryCount,
      productCount,
      orderCount,
      acceptedOrders,
      rejectedOrders,
      pendingOrders,
      warehouseCount,
    ] = await Promise.all([
      CategoryModel.countDocuments(),
      SubCategoryModel.countDocuments(),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ status: "accepted" }),
      OrderModel.countDocuments({ status: "cancelled" }),
      OrderModel.countDocuments({ status: "pending" }),
      Warehouse.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        categories: categoryCount,
        subcategories: subCategoryCount,
        products: productCount,
        orders: orderCount,
        acceptedOrders,
        rejectedOrders,
        pendingOrders,
        warehouses: warehouseCount,
      },
    });
  } catch (error) {
    console.error("Dashboard count error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching counts" });
  }
}

export async function getWarehouseDetails(req, res) {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, data: warehouse });
  } catch (err) {
    console.error("Warehouse fetch error:", err);
    return res.status(500).json({
      message: "Error creating warehouse",
      error: true,
      success: false,
    });
  }
}
// Create warehouse (Admin) edited
export async function createWarehouse(req, res) {
  try {
    const { name, location, coordinates } = req.body;
    const warehouse = new Warehouse({ name, location, coordinates });
    await warehouse.save();
    res.json({ success: true, warehouse });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating warehouse",
      error: true,
      success: false,
    });
  }
}

// Toggle warehouse status
export async function ShowWareHouseStatus(req, res) {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }
    // warehouse.isActive = !warehouse.isActive;
    await warehouse.save();
    return res.json({
      message: "Status updated successfully",
      error: false,
      success: true,
      data: warehouse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating status",
      error: true,
      success: false,
    });
  }
}

// Get all warehouses
export async function GetAllWarehouse(req, res) {
  try {
    const warehouses = await Warehouse.find();
    res.json({ success: true, data: warehouses });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch warehouses" });
  }
}

// Delete warehouse
export async function deleteWarehouse(req, res) {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, message: "Warehouse deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting warehouse" });
  }
}

// Edit warehouse
export async function editWarehouse(req, res) {
  const { name, location, coordinates } = req.body;
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      {  name, location, coordinates },
      { new: true }
    );
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, message: "Warehouse updated", data: warehouse });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating warehouse" });
  }
}

// Get order stats grouped by each warehouse
export async function getOrderStatsByWarehouse(req, res) {
  try {
    const warehouses = await Warehouse.find();

    const results = await Promise.all(warehouses.map(async (warehouse) => {
      const [total, accepted, cancelled, pending] = await Promise.all([
        OrderModel.countDocuments({ warehouse: warehouse._id }),
        OrderModel.countDocuments({ warehouse: warehouse._id, status: 'accepted' }),
        OrderModel.countDocuments({ warehouse: warehouse._id, status: 'cancelled' }),
        OrderModel.countDocuments({ warehouse: warehouse._id, status: 'pending' }),
      ]);

      return {
        warehouseId: warehouse._id,
        warehouseName: warehouse.name,
        totalOrders: total,
        acceptedOrders: accepted,
        cancelledOrders: cancelled,
        pendingOrders: pending
      };
    }));

    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching warehouse order stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


