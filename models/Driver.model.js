import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    // بيانات السائق
    first:         { type: String, required: true },
    father:        { type: String, required: true },
    grandfather:   { type: String, required: true },
    fourth:        { type: String, required: true },
    last:          { type: String, required: true },
    fullName:      { type: String, required: true, unique: true },
    
    // أم السائق
    motherFirst:        { type: String, required: true },
    motherFather:       { type: String, required: true },
    motherGrandfather:  { type: String, required: true },
    
    // بيانات الميلاد والهوية والعنوان
    birthDate:         { type: String, required: true },   // YYYY-MM-DD
    nationalId:        { 
      type: String, required: true,
      validate: {
        validator: v => /^\d{12}$/.test(v),
        message: "رقم البطاقة الوطنية يجب أن يتكوّن من 12 رقمًا"
      }
    },
    nationalIdExpire:  { type: String, required: true },   // التاريخ الجديد
    
    province:          { type: String, required: true },
    areaAddress:       { type: String, required: true },

    // الاتصال والرخصة
    phone:        { type: String, required: true },
    licenseEnd:   { type: String, required: true },   // تاريخ نفاذ رخصة السوق

    // صور الرخصة
    frontImage:      { type: String },
    backImage:       { type: String },
    // صور البطاقة الوطنية
    idFrontImage:    { type: String },
    idBackImage:     { type: String }
  },
  { timestamps: true }
);

driverSchema.pre("save", function (next) {
  const parts = [this.first, this.father, this.grandfather, this.fourth, this.last]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  this.fullName = parts;
  next();
});

export default mongoose.model("Driver", driverSchema);
