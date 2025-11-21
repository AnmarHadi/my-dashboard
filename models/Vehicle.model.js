import mongoose from "mongoose";

// لاحظ: تم تعديل اسم الحقل إلى ownerAddress بدلاً من address
const vehicleSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  province: String,
  contractor: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor" },

  // الحقول الإضافية
  wheelType: String,         // نوع العجلة
  ownerName: String,         // اسم المالك
  ownerAddress: String,      // العنوان

  annualEnd: String,
  annualImage: String,
  checkupEnd: String,
  checkupImage: String,
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
