from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

app = FastAPI(title="Sitat App" )


# conn = sqlite3.connect("database.db", check_same_thread=False)

def get_connection():
    return sqlite3.connect("database.db")

with get_connection() as conn:
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        text TEXT NOT NULL
    )
    """)
    conn.commit()



class Notat(BaseModel):
    title:str
    text:str

# class Todo(BaseModel):
#     title:str
#     tasks:list[text:str, done:bool]


@app.post("/notat")
def nytt_notat(data:Notat):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO notes (title, text) VALUES (?,?)",(data.title,data.text))
        conn.commit()

@app.get("/notat")
def hent_notater():
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, title, text FROM notes")
        rows = cur.fetchall()
        return [
            {"id": r[0], "title": r[1], "text": r[2]}
            for r in rows
        ]





@app.get("/notat/{note_id}")
def hent_notat(note_id: int):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, title, text FROM notes WHERE id = ?", (note_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Not found")
        return {"id": row[0], "title": row[1], "text": row[2]}





























