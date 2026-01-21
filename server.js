import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3000;

// Multer (REQUIRED for file uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Supabase Client (SERVICE ROLE KEY REQUIRED)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================
// CREATE BOOKING
// ============================
app.post("/book", upload.single("reference_image"), async (req, res) => {
  try {
    const { name, email, phone, date, time, request } = req.body;

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).send("Please fill in all required fields.");
    }

    // Check duplicate booking
    const { data: existing = [], error: checkError } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", date)
      .eq("time", time);

    if (checkError) throw checkError;

    if (existing.length > 0) {
      return res
        .status(400)
        .send("This date and time is already booked.");
    }

    let imageUrl = null;

    // OPTIONAL IMAGE
    if (req.file) {
      const filePath = `bookings/${Date.now()}-${req.file.originalname}`;

      const { error: uploadError } = await supabase.storage
        .from("booking-images")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (uploadError) throw uploadError;

      imageUrl = supabase.storage
        .from("booking-images")
        .getPublicUrl(filePath).data.publicUrl;
    }

    const { error } = await supabase.from("bookings").insert([{
      name,
      email,
      phone,
      date,
      time,
      request,
      reference_image_url: imageUrl
    }]);

    if (error) throw error;

    res.send("Booking successful!");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// ============================
// GET BOOKINGS
// ============================
app.get("/bookings", async (req, res) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: "Database error" });
  res.json(data);
});

// ============================
// SERVER RUN
// ============================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
