// src/index.ts
import { Hono } from "hono";
import { db } from "./db/index";
import { notes } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/", (c) => c.text("✅ Hono Notes API running — try GET /api/notes"));

app.get("/api/notes", (c) => {
  const allNotes = db.select().from(notes).all();
  return c.json(allNotes);
});

app.post("/api/notes", async (c) => {
  const { title, content } = await c.req.json();
  db.insert(notes).values({ title, content, createdAt: Date.now() }).run();
  return c.json({ message: "Note created" }, 201);
});

app.put("/api/notes/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const { title, content } = await c.req.json();
  db.update(notes).set({ title, content }).where(eq(notes.id, id)).run();
  return c.json({ message: "Note updated" });
});

app.delete("/api/notes/:id", (c) => {
  const id = Number(c.req.param("id"));
  db.delete(notes).where(eq(notes.id, id)).run();
  return c.json({ message: "Note deleted" });
});

// ----------- THIS IS WHAT BUN NEEDS -----------
export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};