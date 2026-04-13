document.getElementById(notatbox)

function opprettNotat(){
    document.getElementById("notatbox").style.display = "block";
}






function createTodo() {
  const container = document.getElementById('app'); 

  container.innerHTML = `
    <h2>Ny To do liste</h2>

    <input id="todoTitle" placeholder="Tittel" />

    <div id="tasks"></div>

    <input id="newTask" placeholder="Ny oppgave" />
    <button onclick="addTask()">Legg til oppgave</button>

    <br><br>
    <button onclick="saveTodo()">Lagre</button>
  `;
}

async function saveTodo() {
  const title = document.getElementById('todoTitle').value;

  await fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'todo',
      title: title,
      tasks: tasks
    })
  });

}
// Vis notat
function opprettNotat() {
  document.getElementById("notatBox").style.display = "block";
  document.getElementById("listeBox").style.display = "none";
}

// Vis liste
function opprettListe() {
  document.getElementById("listeBox").style.display = "block";
  document.getElementById("notatBox").style.display = "none";
}

// Lagre notat
async function lagreNotat() {
  const tekst = document.getElementById("notatTekst").value;

  if (!tekst) {
    alert("Skriv noe først!");
    return;
  }

  await fetch("http://localhost:3000/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "note",
      content: tekst
    })
  });

  alert("Notat lagret!");
  document.getElementById("notatTekst").value = "";
}



let oppgaver = [];

// Legg til notat
function leggTilnotat() {
  const input = document.getElementById("nynotat");
  const tekst = input.value;

  if (!tekst) return;

  oppgaver.push({ text: tekst, done: false });
  input.value = "";

  visnotater();
}

// Vis 
function visnotater() {
  const div = document.getElementById("tasks");
  if (!div) return;

  div.innerHTML = "";

  notater.forEach((oppgave, index) => {
    div.innerHTML += `
      <div>
        <input type="checkbox" onchange="toggleOppgave(${index})">
        ${notater.text}
      </div>
    `;
  });
}


function togglenotater(i) {
 notater[i].done = !notater[i].done;
}


async function lagreListe() {
  const tittel = document.getElementById("todoTittel")?.value || "";

  if (oppgaver.length === 0) {
    alert("Legg til minst en notat");
    return;
  }

  await fetch("http://localhost:3000/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "todo",
      title: tittel,
      tasks: oppgaver
    })
  });

  alert("Liste lagret!");

  notater = [];
  visnotater();
}