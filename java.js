let oppgaver = [];

// Viser notater
function opprettNotat() {
    document.getElementById("notatBox").style.display = "block"
    document.getElementById("listeBox").style.display = "none"

}

// viser liste boks
function opprettliste() {
    document.getElementById("listeBox").style.display = "block"
    document.getElementById("notatBox").style.display = "none"

}

// lagre notater
async function lagreNotat() {
    const tekst = document.getElementById("notatTekst").value if (!tekst) {
        alert("Skriv noe")
        return;
    }
    
}

await fetch ("http://localhost:5000/notes", {
    method: "post"
    Headers: { "content-type": "application/json"},
    body: JSON. stringify({type: "note", content:tekst})
        
    })
     alert("Notat lagret!");
  document.getElementById("notatTekst").value = "";
  lastNotater();


//legger til oppgaven i listen
function leggTilOppgave() {
  const input = document.getElementById("nyOppgave");
  const tekst = input.value;
  if (!tekst) return;
  oppgaver.push({ text: tekst, done: false });
  input.value = "";
  visOppgaver();
}

// Last alle notater fra databasen
async function lastNotater() {
  const res = await fetch("http://localhost:5000/notes");
  const notater = await res.json();
  const div = document.getElementById("notater");
  div.innerHTML = "";
  notater.forEach(n => {
    if (n.type === "note") {
      div.innerHTML += `
        <div style="border:1px solid #ccc; border-radius:10px; padding:10px; margin:8px 0;">
          <p>${n.content}</p>
          <button onclick="slettNotat(${n.id})">Slett</button>
        </div>`;
    } else {
      const data = JSON.parse(n.content);
      const oppgaveliste = data.tasks.map(t =>
        `<li>${t.done ? "" : "⬜"} ${t.text}</li>`
      ).join("");
      div.innerHTML += `
        <div style="border:1px solid #ccc; border-radius:10px; padding:10px; margin:8px 0;">
          <strong>${data.title || "To-do liste"}</strong>
          <ul>${oppgaveliste}</ul>
          <button onclick="slettNotat(${n.id})">Slett</button>
        </div>`;
    }
  });
}

// Slett notat
async function slettNotat(id) {
  await fetch(`http://localhost:5000/notes/${id}`, { method: "DELETE" });
  lastNotater();
}

// Last notater når siden åpnes
lastNotater();