const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // 👈 یہ لائن یہاں ہونا لازمی ہے!

const app = express();
const PORT = process.env.PORT || 3000; // 👈 انٹرنیٹ ہوسٹنگ کے لیے ڈائنامک پورٹ

// فارم کا ڈیٹا پڑھنے کا مڈل ویئر (MiddleWare)
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // فرنٹ اینڈ ویب سائٹ کو کنکشن کی اجازت دینا

// =================================================
// 1. ایڈوانس اور پروفیشنل اسکیما اور ماڈل ڈیزائن (Schema & Model)
// =================================================
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
  skills: {
    type: [String],
    default: ["HTML", "CSS", "Node.js"],
  },
  status: {
    type: String,
    default: "Active student",
  },
});

const Student = mongoose.model("AdvancedStudent", advancedStudentSchema);

// =================================================
// 2. ایکسپریس سرور کے تمام راستے (Routes)
// =================================================

// ہوم پیج کا روٹ
app.get("/", (req, res) => {
  res.send(
    "<h1>الحمد للہ! میرا پہلا ایکسپریس بیک اینڈ سرور لائیو ہے! 🚀</h1><p>میں اب فل اسٹیک ڈویلپر بن رہا ہوں۔</p>",
  );
});

// 1. فارم دکھانے کا بالکل درست اور صاف راستہ
app.get("/form", (req, res) => {
  res.send(`
        <div style="max-width: 400px; margin: 50px auto; padding: 30px; background: #2c3e50; color: white; font-family: sans-serif; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); text-align: center;">
            <h2 style="color: #2ecc71;">نیا اسٹوڈنٹ فارم</h2>
            
            <!-- جادو: فارم کا ایکشن اب سیدھا آپ کے لائیو ورسیل لنک پر جائے گا -->
            <form action="https://my-first-fullstack-app.vercel.app/" method="POST" style="display: flex; flex-direction: column; gap: 15px;">
                <input type="text" name="studentName" placeholder="اسٹوڈنٹ کا نام لکھیں" required style="padding: 10px; border-radius: 6px; border: none; font-size: 16px;">
                <input type="text" name="studentRole" placeholder="عہدہ (Role) لکھیں" required style="padding: 10px; border-radius: 6px; border: none; font-size: 16px;">
                <button type="submit" style="background: #2ecc71; color: white; padding: 12px; border: none; border-radius: 6px; font-size: 18px; cursor: pointer; font-weight: bold;">ڈیٹا بیس میں سیو کریں 💾</button>
            </form>
        </div>
    `);
});

// ڈیٹا بیس سے تمام سٹوڈنٹس کا ڈیٹا نکال کر فرنٹ اینڈ کو بھیجنا
app.get("/api/all-students", async (req, res) => {
  try {
    const allStudents = await Student.find(); // کلاؤڈ ڈیٹا بیس سے سارا ڈیٹا نکالنا
    res.json(allStudents); // ڈیٹا کو صاف بریکٹس (JSON) میں فرنٹ اینڈ کو بھیجنا
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =================================================
// 4. ڈیٹا کو تبدیل (Update) اور مٹانا (Delete)
// =================================================

// الف: ڈیٹا تبدیل کرنے کا راستہ (/api/update-student)
app.get("/api/update-student", async (req, res) => {
  try {
    // ہم ڈیٹا بیس میں موجود پہلے اسٹوڈنٹ کا نام تبدیل کر کے "کامران خان (اپڈیٹڈ)" کر رہے ہیں
    const updatedStudent = await Student.findOneAndUpdate(
      { name: "پاکستانی سٹوڈنٹ" }, // جس نام کو تبدیل کرنا ہے
      { name: "کامران خان (اپڈیٹڈ)", status: "Profile Updated Successfully!" }, // نیا ڈیٹا
      { new: true }, // یہ ڈیٹا بیس کو کہتا ہے کہ تبدیل شدہ ڈیٹا واپس دکھائے
    );

    if (updatedStudent) {
      res.send(
        `<h1>✔ الحمد للہ! ڈیٹا کامیابی سے تبدیل ہو گیا ہے!</h1><p><b>نیا نام:</b> ${updatedStudent.name}</p>`,
      );
    } else {
      res.send(`<h1>❌ اس نام کا کوئی اسٹوڈنٹ نہیں ملا!</h1>`);
    }
  } catch (err) {
    res.status(500).send("❌ تبدیل کرنے میں مسئلہ آیا: " + err.message);
  }
});

// ب: ڈیٹا مٹانے کا راستہ (/api/delete-student)
app.get("/api/delete-student", async (req, res) => {
  try {
    // ہم ڈیٹا بیس سے "کامران خان (اپڈیٹڈ)" نامی اسٹوڈنٹ کو ہمیشہ کے لیے مٹا رہے ہیں
    const deletedStudent = await Student.findOneAndDelete({
      name: "کامران خان (اپڈیٹڈ)",
    });

    if (deletedStudent) {
      res.send(
        `<h1>✔ الحمد للہ! اسٹوڈنٹ کا ریکارڈ ڈیٹا بیس سے ہمیشہ کے لیے مٹا دیا گیا ہے!</h1><p><b>مٹایا گیا نام:</b> ${deletedStudent.name}</p>`,
      );
    } else {
      res.send(`<h1>❌ مٹانے کے لیے کوئی اسٹوڈنٹ نہیں ملا!</h1>`);
    }
  } catch (err) {
    res.status(500).send("❌ مٹانے میں مسئلہ آیا: " + err.message);
  }
});

// فارم کا ڈیٹا وصول کر کے ڈیٹا بیس میں سیو کرنے کا بالکل درست راستہ
// Safeguard fallback for root form submissions
app.post('/', (req, res) => {
    // Redirects any accidental root posts to the correct submit-form path
    res.redirect(307, '/submit-form');
});

  try {
    const { studentName, studentRole } = req.body;

    const newStudent = new Student({
      name: studentName,
      role: studentRole,
      status: "Saved via HTML Form",
    });

    const savedData = await newStudent.save();

    // کامیابی کا لائیو میسج جو اسکرین پر دکھایا جائے گا
    res.send(`
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
                <h1 style="color: #2ecc71;">✔ ماشاءاللہ! فارم کا ڈیٹا کلاؤڈ پر محفوظ ہو گیا ہے!</h1>
                <p><b>محفوظ کردہ نام:</b> ${savedData.name}</p>
                <a href="/form" style="display: inline-block; margin-top: 20px; background: #34495e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">نیا ڈیٹا داخل کریں</a>
            </div>
        `);
  } catch (err) {
    res
      .status(500)
      .send("❌ فارم کا ڈیٹا محفوظ کرنے میں مسئلہ آیا: " + err.message);
  }
});

// =================================================
// 3. سرور اور کلاؤڈ ڈیٹا بیس کنکشن
// =================================================
const myPersonalDB =
  "mongodb+srv://pakistan:pakistan123456@cluster0.asjxhkj.mongodb.net/student_db?appName=Cluster0";

mongoose
  .connect(myPersonalDB)
  .then(() => {
    console.log(
      "✔ الحمد للہ! میرا اپنا کلاؤڈ ڈیٹا بیس کامیابی سے آن لائن جڑ چکا ہے! 🚀",
    );
  })
  .catch((err) => {
    console.error("❌ ڈیٹا بیس کنکشن میں مسئلہ آیا:", err);
  });

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`سرور کامیابی سے پورٹ ${PORT} پر لائیو ہو چکا ہے!`);
  console.log(
    `براؤزر میں دیکھنے کے لیے اس لنک پر جائیں: http://localhost:${PORT}`,
  );
  console.log(`=================================================`);
});
