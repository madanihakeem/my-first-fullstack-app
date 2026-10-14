const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 1. Schema & Model Setup
const advancedStudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "اسٹوڈنٹ کا نام لکھنا لازمی ہے!"],
    trim: true,
  },
  role: {
    type: String,
    required: [true, "عہدہ (Role) لکھنا لازمی ہے!"],
    trim: true,
  },
  skills: { type: [String], default: ["HTML", "CSS", "Node.js"] },
  status: { type: String, default: "Active student" },
});

// Avoid re-compiling the model if it already exists in serverless cash cache
const Student =
  mongoose.models.AdvancedStudent ||
  mongoose.model("AdvancedStudent", advancedStudentSchema);

// Connection String Utility
const myPersonalDB =
  "mongodb+srv://pakistan:pakistan123456@cluster0.asjxhkj.mongodb.net/student_db?retryWrites=true&w=majority";

// 2. Serverless Connection Handler
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // If already connected, reuse the active connection pool
  }
  return mongoose.connect(myPersonalDB);
};

// 3. Optimized Post Route Handler
app.post("/", async (req, res) => {
  try {
    // Enforce the connection inside the lambda execution context
    await connectDB();

    const { studentName, studentRole } = req.body;

    const newStudent = new Student({
      name: studentName,
      role: studentRole,
      status: "Saved via Live Serverless Form",
    });

    // Save the document to the cluster
    const savedData = await newStudent.save();

    res.send(`
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
                <h1 style="color: #2ecc71;">✔ ماشاءاللہ! فارم کا ڈیٹا کلاؤڈ پر محفوظ ہو گیا ہے!</h1>
                <p><b>محفوظ کردہ نام:</b> ${savedData.name}</p>
                <a href="/form" style="display: inline-block; margin-top: 20px; background: #34495e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">نیا ڈیٹا داخل کریں</a>
            </div>
        `);
  } catch (err) {
    res.status(500).send("❌ ڈیٹا محفوظ کرنے میں مسئلہ آیا: " + err.message);
  }
});

// 4. Form Presentation Route
app.get("/form", (req, res) => {
  res.send(`
        <div style="max-width: 400px; margin: 50px auto; padding: 30px; background: #2c3e50; color: white; font-family: sans-serif; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); text-align: center;">
            <h2 style="color: #2ecc71;">نیا اسٹوڈنٹ فارم</h2>
            <form action="https://vercel.app" method="POST" style="display: flex; flex-direction: column; gap: 15px;">
                <input type="text" name="studentName" placeholder="اسٹوڈنٹ کا نام لکھیں" required style="padding: 10px; border-radius: 6px; border: none; font-size: 16px;">
                <input type="text" name="studentRole" placeholder="عہدہ (Role) لکھیں" required style="padding: 10px; border-radius: 6px; border: none; font-size: 16px;">
                <button type="submit" style="background: #2ecc71; color: white; padding: 12px; border: none; border-radius: 6px; font-size: 18px; cursor: pointer; font-weight: bold;">ڈیٹا بیس میں سیو کریں 💾</button>
            </form>
        </div>
    `);
});

// 5. Read API Route
app.get("/api/all-students", async (req, res) => {
  try {
    await connectDB();
    const allStudents = await Student.find();
    res.json(allStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback home endpoint
app.get("/", (req, res) => {
  res.send("<h1>الحمد للہ! میرا پہلا ایکسپریس بیک اینڈ سرور لائیو ہے! 🚀</h1>");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
