import { Hono } from "hono";
import { db } from "./db/index";
import { notes } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/", (c) => c.text("✅ Hono Notes API running — try GET /api/notes"));

app.get("/api/notes", (c) => {
  try {
    const allNotes = db.select().from(notes).all();
    return c.json(allNotes);
  } catch (err) {
    console.error("GET /api/notes error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

app.post("/api/notes", async (c) => {
  try {
    const { title, content } = await c.req.json();
    db.insert(notes).values({ title, content, createdAt: Date.now() }).run();
    return c.json({ message: "Note created" }, 201);
  } catch (err) {
    console.error("POST /api/notes error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

app.put("/api/notes/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const { title, content } = await c.req.json();
    db.update(notes).set({ title, content }).where(eq(notes.id, id)).run();
    return c.json({ message: "Note updated" });
  } catch (err) {
    console.error("PUT /api/notes error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

app.delete("/api/notes/:id", (c) => {
  try {
    const id = Number(c.req.param("id"));
    db.delete(notes).where(eq(notes.id, id)).run();
    return c.json({ message: "Note deleted" });
  } catch (err) {
    console.error("DELETE /api/notes error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};