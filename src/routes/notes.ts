// src/routes/notes.ts
import express from "express";
import {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../db/helpers";

const router = express.Router();

// Get all notes
router.get("/", async (req, res) => {
  const allNotes = listNotes();
  res.json(allNotes);
});

// Create a new note
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  await createNote(title, content);
  res.status(201).json({ message: "Note created" });
});

// Update a note
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;
  await updateNote(id, { title, content });
  res.json({ message: "Note updated" });
});

// Delete a note
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await deleteNote(id);
  res.json({ message: "Note deleted" });
});

export default router;