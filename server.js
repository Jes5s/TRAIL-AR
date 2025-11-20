import 'dotenv/config'; 
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// CREATE BOOKING
app.post("/book", async (req, res) => {
  const { name, email, phone, date, time, request } = req.body;
  if (!name || !email || !phone || !date || !time)
    return res.status(400).send("Please fill in all required fields.");

  // Prevent overlapping bookings
  const { data: existing } = await supabase
    .from("bookings")
    .select("*")
    .eq("date", date)
    .eq("time", time);

  if (existing.length > 0)
    return res.status(400).send("This date and time is already booked. Please choose another.");

  const { error } = await supabase.from("bookings").insert([
    { name, email, phone, date, time, request },
  ]);

  if (error) return res.status(500).send("Database error.");
  res.send("Booking successful!");
});

// GET BOOKINGS
app.get("/bookings", async (req, res) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: "Database error" });
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
