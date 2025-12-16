// src/db/helpers.ts
import { db } from "./index";
import { notes } from "./schema";
import { eq } from "drizzle-orm";

export function listNotes() {
  return db.select().from(notes).all();
}

export function createNote(title: string, content?: string) {
  return db.insert(notes).values({
    title,
    content,
    createdAt: Date.now(),
  }).run();
}

export function updateNote(id: number, data: { title?: string; content?: string }) {
  return db.update(notes).set(data).where(eq(notes.id, id)).run();
}

export function deleteNote(id: number) {
  return db.delete(notes).where(eq(notes.id, id)).run();
}