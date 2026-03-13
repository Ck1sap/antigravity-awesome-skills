/**
 * Build-time env injection for Netlify.
 * Replaces %%AUTH_ENABLED%%, %%SUPABASE_URL%%, %%SUPABASE_ANON_KEY%%
 * in index.html with values from process.env (set in Netlify UI).
 * Uses process.cwd() so the file we edit is the one Netlify will publish (base dir).
 * Run from base (prototypes/residency-plus): node scripts/inject-env.js
 */
const fs = require("fs");
const path = require("path");

const indexPath = path.join(process.cwd(), "index.html");
let html = fs.readFileSync(indexPath, "utf8");

function val(name, fallback) {
  const v = (process.env[name] ?? fallback);
  return typeof v === "string" ? v.trim() : v;
}
function authEnabledValue() {
  const v = (val("AUTH_ENABLED", "") || "").toLowerCase();
  return (v === "true" || v === "1" || v === "yes") ? "true" : (process.env.AUTH_ENABLED == null ? "%%AUTH_ENABLED%%" : "false");
}

const authVal = authEnabledValue();
const supabaseUrl = val("SUPABASE_URL", "%%SUPABASE_URL%%");
const supabaseKey = val("SUPABASE_ANON_KEY", "%%SUPABASE_ANON_KEY%%");

html = html.replace(/%%AUTH_ENABLED%%/g, authVal);
html = html.replace(/%%SUPABASE_URL%%/g, supabaseUrl);
html = html.replace(/%%SUPABASE_ANON_KEY%%/g, supabaseKey);
fs.writeFileSync(indexPath, html);
