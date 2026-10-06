import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cookieParser from "cookie-parser";
import { google } from "googleapis";
import dotenv from "dotenv";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db.json');

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://tlppbrfdswunmuydumjx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_abUSzR2FqwnBEu9Znu2T5g_N6AB3cUN';
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // --- DATABASE SETUP ---
  const uploadsDir = path.join(__dirname, "uploads");
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const defaultData = {
    settings: {
      siteName: "Dream Route Tourism",
      description: "Premium cinematic travel and tourism interface.",
      currency: "USD",
      heroImage: "https://images.unsplash.com/photo-1506953823976-52e1bdc0149a?q=80&w=2070&auto=format&fit=crop",
      logo: "",
      socials: {
        instagram: "https://instagram.com",
        twitter: "https://twitter.com",
        facebook: "https://facebook.com"
      }
    },
    services: [
      { id: "1", title: "Global Visa Services", description: "Hassle-free visa processing for over 150 countries with a 98% success rate.", price: 150 },
      { id: "2", title: "Premium Flight Booking", description: "Exclusive access to private charters and premium cabin deals globally.", price: 500 },
      { id: "3", title: "Luxury Accommodation", description: "Hand-picked resorts and boutique hotels evaluated for extreme comfort.", price: 300 }
    ],
    destinations: [
       { id: "1", name: "Maldives", country: "Tropical Paradise", price: 2499, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8" },
       { id: "2", name: "Paris", country: "France", price: 1850, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
       { id: "3", name: "Dubai", country: "UAE", price: 1200, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c" },
       { id: "4", name: "Serengeti", country: "Tanzania", price: 3100, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801" }
    ]
  };

  async function getDbData() {
    // 1. Try Supabase first
    try {
      const { data, error } = await supabase.from('app_data').select('data').eq('id', 1).single();
      if (!error && data && Object.keys(data.data || {}).length > 0) {
        return data.data;
      }
      if (error) console.warn("Supabase read error:", error.message);
    } catch(e) {
      console.error("Supabase exception:", e);
    }

    // 2. Fall back to local db.json if it exists
    if (fs.existsSync(dbPath)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        if (Object.keys(fileData).length > 0) {
          console.log("Falling back to local db.json");
          return fileData;
        }
      } catch(e) {
        console.error("db.json read error:", e);
      }
    }

    // 3. Last resort: use hardcoded defaults
    console.log("Using hardcoded default data");
    return defaultData;
  }

  async function saveDbData(newData: any) {
    // Always write to local db.json as backup
    try {
      fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2));
    } catch(e) {
      console.error("Failed to write local db.json", e);
    }

    // Also save to Supabase
    try {
      const { error } = await supabase.from('app_data').upsert({ id: 1, data: newData });
      if (error) console.error("Failed to save to Supabase:", error);
    } catch(e) {
      console.error("Exception saving to Supabase:", e);
    }
  }

  // Seed default data if database is empty on start
  getDbData().then(async (data) => {
    if (data === defaultData) {
      console.log("Seeding initial data to Supabase...");
      await saveDbData(defaultData);
    }
  });

  // --- GOOGLE DRIVE LOGIC ---
  async function getDriveAuth() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!email || !key) return null;
    return new google.auth.JWT(email, undefined, key, [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file"
    ]);
  }

  async function syncToDrive(data: any) {
    const auth = await getDriveAuth();
    if (!auth) return;
    
    const drive = google.drive({ version: 'v3', auth });
    const fileName = 'dream-route-db.json';
    
    try {
      const search = await drive.files.list({ q: `name = '${fileName}'`, fields: 'files(id)' });
      const fileId = search.data.files?.[0]?.id;

      const media = {
        mimeType: 'application/json',
        body: JSON.stringify(data, null, 2)
      };

      if (fileId) {
        await drive.files.update({ fileId, media });
      } else {
        await drive.files.create({ requestBody: { name: fileName, mimeType: 'application/json' }, media });
      }
    } catch (e) {
      console.error("Drive sync error:", e);
    }
  }

  async function uploadToDrive(filePath: string, fileName: string) {
    const auth = await getDriveAuth();
    if (!auth) return null;
    const drive = google.drive({ version: 'v3', auth });

    try {
      const res = await drive.files.create({
        requestBody: { name: fileName, mimeType: 'image/jpeg' },
        media: { mimeType: 'image/jpeg', body: fs.createReadStream(filePath) },
        fields: 'id, webViewLink'
      });
      
      await drive.permissions.create({
        fileId: res.data.id!,
        requestBody: { role: 'reader', type: 'anyone' }
      });

      return `https://lh3.googleusercontent.com/u/0/d/${res.data.id}`; 
    } catch (e) {
      console.error("Drive upload error:", e);
      return null;
    }
  }

  // --- API ROUTES ---

  const isAuthorized = (req: any, res: any, next: any) => {
    if (req.cookies.admin_session === "is_admin") {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  };

  app.get("/api/data", async (req, res) => {
    res.json(await getDbData());
  });

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === (process.env.ADMIN_PASSWORD || "admin_password")) {
      res.cookie("admin_session", "is_admin", { 
        httpOnly: true, 
        maxAge: 86400000,
        sameSite: 'none',
        secure: true
      });
      return res.json({ success: true });
    }
    res.status(401).json({ success: false, message: "Invalid credentials" });
  });

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("admin_session", { sameSite: 'none', secure: true });
    res.json({ success: true });
  });

  app.get("/api/admin/check", (req, res) => {
    if (req.cookies.admin_session === "is_admin") {
      return res.json({ isAdmin: true });
    }
    res.json({ isAdmin: false });
  });

  app.post("/api/admin/update", isAuthorized, async (req, res) => {
    const newData = req.body;
    await saveDbData(newData);
    await syncToDrive(newData);
    res.json({ success: true });
  });

  app.post("/api/admin/sync-reviews", isAuthorized, async (req, res) => {
    const apiKey = process.env.SERPAPI_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;
    if (!apiKey || !placeId) {
      return res.status(400).json({ error: "SerpApi key or Place ID not configured in .env" });
    }

    try {
      const response = await fetch(`https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${placeId}&api_key=${apiKey}`);
      const data: any = await response.json();
      
      if (!data.reviews || data.reviews.length === 0) {
        return res.status(404).json({ error: "No reviews found or invalid Place ID." });
      }

      const formattedReviews = data.reviews.slice(0, 10).map((r: any) => ({
        id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: r.user?.name || "Google User",
        avatar: r.user?.thumbnail || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        rating: r.rating,
        date: r.date || "recently",
        badge: "Verified Google Review",
        service: "General",
        comment: r.snippet || "Left a rating."
      }));

      const dbData = await getDbData();
      dbData.reviews = formattedReviews;
      await saveDbData(dbData);
      await syncToDrive(dbData);
      
      res.json({ success: true, reviews: formattedReviews });
    } catch (error: any) {
      console.error("Failed to sync reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews from SerpApi." });
    }
  });

  app.post("/api/admin/upload", isAuthorized, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let url = "";

    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      try {
        url = await uploadToDrive(req.file.path, req.file.originalname) || "";
      } catch (e) {
        console.error("Drive upload failed, falling back to local:", e);
      }
    }

    if (!url) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      const targetPath = path.join(__dirname, "uploads", fileName);
      
      try {
        fs.renameSync(req.file.path, targetPath);
        url = `/uploads/${fileName}`;
      } catch (e) {
        console.error("Local rename failed:", e);
        const base64 = fs.readFileSync(req.file.path, { encoding: 'base64' });
        url = `data:${req.file.mimetype};base64,${base64}`;
        fs.unlinkSync(req.file.path);
      }
    } else {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    res.json({ url });
  });

  // --- ENQUIRY / CRM ROUTES ---

  app.post("/api/enquiries", async (req, res) => {
    const enquiry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body,
      status: "new"
    };

    const data = await getDbData();
    if (!data.enquiries) data.enquiries = [];
    data.enquiries.unshift(enquiry);
    await saveDbData(data);

    console.log(`[MOCK EMAIL] Confirmation sent to: ${enquiry.email}`);
    res.json({ success: true });
  });

  app.get("/api/admin/enquiries", isAuthorized, async (req, res) => {
    const data = await getDbData();
    res.json(data.enquiries || []);
  });

  app.post("/api/admin/enquiries/delete", isAuthorized, async (req, res) => {
    const { id } = req.body;
    const data = await getDbData();
    data.enquiries = (data.enquiries || []).filter((e: any) => e.id !== id);
    await saveDbData(data);
    res.json({ success: true });
  });

  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("API Error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Internal Server Error"
    });
  });

  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
