const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true })); // فارم کا ڈیٹا پڑھنے کا ٹول

// 1. ہوم پیج کا روٹ (Route)
app.get("/", (req, res) => {
  res.send(
    "<h1>الحمد للہ! میرا پہلا ایکسپریس بیک اینڈ سرور لائیو ہے! 🚀</h1><p>میں اب فل اسٹیک ڈویلپر بن رہا ہوں۔</p>",
  );
});

// 2. یوزر ڈیٹا کا روٹ (API)
app.get("/api/user", (req, res) => {
  const studentData = {
    name: "آپ کا نام (Student)",
    role: "Full-Stack Developer",
    skills: [
      "HTML",
      "CSS",
      "SASS",
      "JavaScript",
      "TypeScript",
      "Angular",
      "Node.js",
    ],
    status: "Learning Backend Successfully",
  };
  res.json(studentData);
});

// 3. اباؤٹ پیج (About Page)
app.get("/about", (req, res) => {
  res.send(
    "<h1>ہمارے بارے میں (About Us)</h1><p>ہم ایک میٹرک پاس اسٹوڈنٹ کو فل اسٹیک ویب ڈویلپر بنا رہے ہیں!</p>",
  );
});

// 4. کانٹیکٹ پیج (Contact Page)
app.get("/contact", (req, res) => {
  res.send(
    "<h1>رابطہ کریں (Contact Page)</h1><p>ای میل: student@example.com</p>",
  );
});

// 5. سرور کو لائیو سننا (Listen) شروع کرنا
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`سرور کامیابی سے پورٹ ${PORT} پر لائیو ہو چکا ہے!`);
  console.log(
    `براؤزر میں دیکھنے کے لیے اس لنک پر جائیں: http://localhost:${PORT}`,
  );
  console.log(`=================================================`);
});

// 6. کلاؤڈ ڈیٹا بیس کنکشن (صرف ایک بار بالکل صاف)
const myPersonalDB =
  "mongodb+srv://pakistan:pakistan123456@cluster0.asjxhkj.mongodb.net/?appName=Cluster0";

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

// 1. ڈیٹا کا ڈھانچہ (Schema) طے کرنا
const studentSchema = new mongoose.Schema({
  name: String,
  role: String,
  skills: [String],
  status: String,
});

// 2. ڈیٹا کا ماڈل (Model) بنانا (یہ ڈیٹا بیس میں 'students' نام کا فولڈر بنائے گا)
const Student = mongoose.model("Student", studentSchema);

// 3. ایک نیا روٹ بنانا جو ڈیٹا بیس میں لائیو ڈیٹا محفوظ کرے گا (/save-student)
app.get("/save-student", async (req, res) => {
  try {
    // ڈیٹا بیس میں بھیجنے کے لیے نیا ڈیٹا تیار کرنا
    const newStudent = new Student({
      name: "محمد ضمیر مدنی عطاری",
      role: "Full-Stack Developer",
      skills: ["HTML", "CSS", "Node.js", "MongoDB"],
      status: "Database Learning Completed",
    });

    // ڈیٹا کو کلاؤڈ پر محفوظ (Save) کرنا
    const savedData = await newStudent.save();

    // براؤزر پر کامیابی کا میسج دکھانا
    res.send(
      `<h1>✔ الحمد للہ! ڈیٹا کامیابی سے کلاؤڈ پر محفوظ ہو گیا ہے!</h1><pre>${JSON.stringify(savedData, null, 2)}</pre>`,
    );
  } catch (err) {
    res.status(500).send("❌ ڈیٹا محفوظ کرنے میں کوئی مسئلہ آیا: " + err);
  }
});

// 1. فارم دکھانے کا راستہ (/form)
app.get("/form", (req, res) => {
  res.send(`
        <div style="max-width: 400px; margin: 50px auto; padding: 30px; background: #2c3e50; color: white; font-family: sans-serif; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); text-align: center;">
            <h2 style="color: #2ecc71;">نیا اسٹوڈنٹ فارم</h2>
            <form action="/submit-form" method="POST" style="display: flex; flex-direction: column; gap: 15px;">
                <input type="text" name="studentName" placeholder="اسٹوڈنٹ کا نام لکھیں" required style="padding: 10px; border-radius: 6px; border: none; font-size: 16px;">
                <input type="text" name="studentRole" placeholder="عہدہ (Role) لکھیں" required style="padding: 10px; border-radius: 6px; border: none; font-size: 16px;">
                <button type="submit" style="background: #2ecc71; color: white; padding: 12px; border: none; border-radius: 6px; font-size: 18px; cursor: pointer; font-weight: bold;">ڈیٹا بیس میں سیو کریں 💾</button>
            </form>
        </div>
    `);
});

// 2. فارم کا ڈیٹا وصول کر کے ڈیٹا بیس میں سیو کرنے کا راستہ (/submit-form)
app.post("/submit-form", async (req, res) => {
  try {
    // فارم سے نام اور رول نکالنا
    const { studentName, studentRole } = req.body;

    // کلاؤڈ ڈیٹا بیس کے لیے نیا ریکارڈ تیار کرنا
    const newStudent = new Student({
      name: studentName,
      role: studentRole,
      skills: ["HTML", "CSS", "Node.js"], // بائی ڈیفالٹ اسکلز
      status: "Saved via HTML Form",
    });

    // ڈیٹا بیس میں محفوظ کرنا
    const savedData = await newStudent.save();

    // کامیابی کا میسج دکھانا
    res.send(`
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
                <h1 style="color: #2ecc71;">✔ ماشاءاللہ! فارم کا ڈیٹا کلاؤڈ پر محفوظ ہو گیا ہے!</h1>
                <p><b>محفوظ کردہ نام:</b> ${savedData.name}</p>
                <a href="/form" style="display: inline-block; margin-top: 20px; background: #34495e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">نیا ڈیٹا داخل کریں</a>
            </div>
        `);
  } catch (err) {
    res.status(500).send("❌ فارم کا ڈیٹا محفوظ کرنے میں مسئلہ آیا: " + err);
  }
});
