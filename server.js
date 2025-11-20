import 'dotenv/config'; 
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Home route
app.get("/", (req, res) => 
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

// ============================
// CREATE BOOKING
// ============================
app.post("/book", async (req, res) => {
  const { name, email, phone, date, time, request } = req.body;

  if (!name || !email || !phone || !date || !time) {
    return res.status(400).send("Please fill in all required fields.");
  }

  // Check for duplicate booking
  const { data: existing = [], error: checkError } = await supabase
    .from("bookings")
    .select("*")
    .eq("date", date)
    .eq("time", time);

  if (checkError) {
    console.error(checkError);
    return res.status(500).send("Database error.");
  }

  if (existing.length > 0) {
    return res
      .status(400)
      .send("This date and time is already booked. Please choose another.");
  }

  // Insert new booking
  const { error } = await supabase.from("bookings").insert([
    { name, email, phone, date, time, request }
  ]);

  if (error) {
    console.error(error);
    return res.status(500).send("Database error.");
  }

  res.send("Booking successful!");
});

// ============================
// GET ALL BOOKINGS
// ============================
app.get("/bookings", async (req, res) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }

  res.json(data);
});

// ============================
// SERVER RUN
// ============================
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
