/**
 * uploads-prepare.js — Return an upload path for the current user (Labs upload flow).
 * Client uploads to Supabase Storage at that path using their JWT; then calls uploads-register.
 * Path convention: {user_id}/{upload_id}/{filename}. Secrets server-side only.
 */
import { allowOrigin, json } from "./lib/sc-auth-lib.js";
import { getJwtUser } from "./sc-supabase-lib.js";

const AUTH_ENABLED = process.env.AUTH_ENABLED === "true";
const BUCKET = "uploads";

function sanitizeFilename(name) {
  if (typeof name !== "string") return "audio";
  const base = name.replace(/[/\\]/g, "").trim() || "audio";
  const ext = base.includes(".") ? base.slice(base.lastIndexOf(".")) : "";
  const stem = base.slice(0, base.length - ext.length).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  return (stem + ext) || "audio";
}

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    const origin = allowOrigin(req.headers.get("origin"));
    return new Response("", {
      status: 204,
      headers: {
        "access-control-allow-origin": origin || "*",
        "access-control-allow-headers": "content-type, authorization",
        "access-control-allow-methods": "POST,OPTIONS",
      },
    });
  }

  const origin = allowOrigin(req.headers.get("origin"));
  if (!origin && req.headers.get("origin")) return json(403, { error: "Origin not permitted." }, origin);
  if (req.method !== "POST") return json(405, { error: "Method not allowed" }, origin);

  if (!AUTH_ENABLED) {
    return json(401, { error: "Auth disabled" }, origin);
  }

  const user = getJwtUser(req);
  if (!user) {
    return json(401, { error: "Missing or invalid token" }, origin);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON" }, origin);
  }

  const filename = typeof body.filename === "string" ? body.filename.trim() : "audio";
  const safeName = sanitizeFilename(filename);
  const uploadId = crypto.randomUUID();
  const path = `${user.uid}/${uploadId}/${safeName}`;

  return json(200, { uploadId, path, bucket: BUCKET }, origin);
}
