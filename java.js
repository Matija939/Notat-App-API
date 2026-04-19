let oppgaver = [];

function opprettNotat() {
  document.getElementById("notatBox").style.display = "block";
  document.getElementById("listeBox").style.display = "none";
}

function opprettListe() {
  document.getElementById("listeBox").style.display = "block";
  document.getElementById("notatBox").style.display = "none";
}

async function lagreNotat() {
  const tekst = document.getElementById("notatTekst").value;
  if (!tekst) {
    alert("Skriv noe først!");
    return;
  }
  await fetch("http://192.168.20.80:5000/notat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Notat", text: tekst })
  });
  alert("Notat lagret!");
  document.getElementById("notatTekst").value = "";
  lastNotater();
}

function leggTilOppgave() {
  const input = document.getElementById("nyOppgave");
  const tekst = input.value;
  if (!tekst) return;
  oppgaver.push({ text: tekst, done: false });
  input.value = "";
  visOppgaver();
}

function visOppgaver() {
  const div = document.getElementById("tasks");
  if (!div) return;
  div.innerHTML = "";
  oppgaver.forEach((oppgave, index) => {
    div.innerHTML += `
      <div>
        <input type="checkbox" ${oppgave.done ? "checked" : ""} onchange="toggleOppgave(${index})">
        ${oppgave.text}
      </div>
    `;
  });
}

function toggleOppgave(i) {
  oppgaver[i].done = !oppgaver[i].done;
}

async function lagreListe() {
  const tittel = document.getElementById("todoTittel")?.value || "To-do liste";
  if (oppgaver.length === 0) {
    alert("Legg til minst én oppgave!");
    return;
  }
  await fetch("http://192.168.20.80:5000/notat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: tittel,
      text: JSON.stringify(oppgaver)
    })
  });
  alert("Liste lagret!");
  oppgaver = [];
  visOppgaver();
  lastNotater();
}

async function lastNotater() {
  const res = await fetch("http://192.168.20.80:5000/notat");
  const notater = await res.json();
  const div = document.getElementById("notater");
  div.innerHTML = "";
  notater.forEach(n => {
    let innhold = "";
    try {
      const tasks = JSON.parse(n.text);
      const liste = tasks.map(t =>
        `<li>${t.done ? "✅" : "⬜"} ${t.text}</li>`
      ).join("");
      innhold = `<strong>${n.title}</strong><ul>${liste}</ul>`;
    } catch {
      innhold = `<strong>${n.title}</strong><p>${n.text}</p>`;
    }
    div.innerHTML += `
      <div style="border:1px solid #ccc; border-radius:10px; padding:10px; margin:8px 0;">
        ${innhold}
        <button onclick="slettNotat(${n.id})">Slett</button>
      </div>`;
  });
}

async function slettNotat(id) {
  await fetch(`http://192.168.20.80:5000/notat/${id}`, { method: "DELETE" });
  lastNotater();
}

lastNotater();