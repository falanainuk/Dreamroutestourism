import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://tlppbrfdswunmuydumjx.supabase.co';
const supabaseKey = 'sb_publishable_abUSzR2FqwnBEu9Znu2T5g_N6AB3cUN';
const supabase = createClient(supabaseUrl, supabaseKey);

const dbPath = path.join(__dirname, "db.json");
const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// Fix the local uploads path - replace with a public Unsplash image
data.services = data.services.map((s: any) => ({
  ...s,
  image: s.image?.startsWith('/uploads/') 
    ? 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop'
    : s.image
}));

const result = await supabase.from('app_data').upsert({ id: 1, data });

if (result.error) {
  console.error("❌ Seed failed:", result.error.message);
} else {
  console.log("✅ Supabase seeded successfully with your full database!");
}
