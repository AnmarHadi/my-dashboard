import express from "express";
import mongoose from "mongoose";
import Document from "../models/Document.model.js";
import Driver from "../models/Driver.model.js";
import Vehicle from "../models/Vehicle.model.js";

const router = express.Router();

// جلب السائقين المميزين حسب تعدد النقلات بشهر معيّن (أكثر من نقلة)
router.get("/api/telegrams/active-drivers", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "الشهر مطلوب بصيغة YYYY-MM" });
    }

    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const agg = await Document.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { driver: "$driverId", vehicle: "$vehicleId" },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }, // أكثر من نقلة
      {
        $lookup: {
          from: "drivers",
          localField: "_id.driver",
          foreignField: "_id",
          as: "driver"
        }
      },
      { $unwind: "$driver" },
      {
        $lookup: {
          from: "vehicles",
          localField: "_id.vehicle",
          foreignField: "_id",
          as: "vehicle"
        }
      },
      { $unwind: "$vehicle" },
      {
        $project: {
          key: { $concat: [{ $toString: "$_id.driver" }, "_", { $toString: "$_id.vehicle" }] },
          fullName: "$driver.fullName",
          first: "$driver.first",
          father: "$driver.father",
          grandfather: "$driver.grandfather",
          fourth: "$driver.fourth",
          last: "$driver.last",
          motherTriple: {
            $concat: [
              "$driver.motherFirst", " ",
              "$driver.motherFather", " ",
              "$driver.motherGrandfather"
            ]
          },
          nationalId: "$driver.nationalId",
          nationalIdExpire: "$driver.nationalIdExpire",
          licenseEnd: "$driver.licenseEnd",
          birthDate: "$driver.birthDate",
          driverProvince: "$driver.province",
          address: "$driver.areaAddress",
          vehicleNumber: "$vehicle.number",
          vehicleProvince: "$vehicle.province",
          wheelType: "$vehicle.wheelType",
          ownerName: "$vehicle.ownerName",
          annualEnd: "$vehicle.annualEnd",
          checkupEnd: "$vehicle.checkupEnd",
          count: 1
        }
      }
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل في جلب بيانات السائقين المميزين" });
  }
});

// جلب كل السائقين مع المركبات من المستندات (بدون تكرار السائق+المركبة)
router.get("/api/telegrams/all-drivers", async (req, res) => {
  try {
    const agg = await Document.aggregate([
      {
        $group: {
          _id: { driver: "$driverId", vehicle: "$vehicleId" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "drivers",
          localField: "_id.driver",
          foreignField: "_id",
          as: "driver"
        }
      },
      { $unwind: "$driver" },
      {
        $lookup: {
          from: "vehicles",
          localField: "_id.vehicle",
          foreignField: "_id",
          as: "vehicle"
        }
      },
      { $unwind: "$vehicle" },
      {
        $project: {
          key: { $concat: [{ $toString: "$_id.driver" }, "_", { $toString: "$_id.vehicle" }] },
          fullName: "$driver.fullName",
          first: "$driver.first",
          father: "$driver.father",
          grandfather: "$driver.grandfather",
          fourth: "$driver.fourth",
          last: "$driver.last",
          motherTriple: {
            $concat: [
              "$driver.motherFirst", " ",
              "$driver.motherFather", " ",
              "$driver.motherGrandfather"
            ]
          },
          nationalId: "$driver.nationalId",
          nationalIdExpire: "$driver.nationalIdExpire",
          licenseEnd: "$driver.licenseEnd",
          birthDate: "$driver.birthDate",
          driverProvince: "$driver.province",
          address: "$driver.areaAddress",
          vehicleNumber: "$vehicle.number",
          vehicleProvince: "$vehicle.province",
          wheelType: "$vehicle.wheelType",
          ownerName: "$vehicle.ownerName",
          annualEnd: "$vehicle.annualEnd",
          checkupEnd: "$vehicle.checkupEnd",
          count: 1
        }
      }
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل في جلب جميع السائقين" });
  }
});

export default router;
