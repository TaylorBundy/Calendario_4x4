const form = document.getElementById("formulario");
const lista = document.getElementById("lista");
const elementos = lista.children;
const totalReservas = document.querySelector(".totalReservas");
const guarda = document.querySelector(".guardar");
const actualizar = document.querySelector(".actualizar");
const botones = document.querySelectorAll("button");
const btnEliminar = document.querySelector("#editaElimina");
const eleEdita = document.querySelector(".editaClientes");
const recargar = document.querySelector(".recargar");
const API = "https://calendario-4x4.onrender.com";

let datos = [];
let indiceEditando = null;
let indiceNuevo = null;
let indiceAnterior = null;
let idSeleccionado = null;
let nuevoId = null;
const API_KEY = "AIzaSyAVearlKR2iIcQd2eeS8zXqiKB2OITgIxU";
const CALENDAR_ID = "diegomartinbarbosa2@gmail.com";

const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log(data.items);
    mostrarFechas(data.items);
  });

window.addEventListener("DOMContentLoaded", () => {
  recargar.addEventListener("click", () => {
    cargarDatos();
    console.log(datos);
  });
  //const eleEdita1 = document.querySelector(".editaClientes");
  const ele = eleEdita.querySelectorAll("input");
  ele.forEach((el) => {
    if (el.type === "text" || el.type === "number") {
      if (el.value === "") {
        //console.log(el);
        actualizar.disabled = true;
        actualizar.classList.add("desactive");
        //actualizar.style.background = "#888";
        //actualizar.style.cursor = "wait";
      }
    }
  });
  //console.log(eleEdita);
});

// Contar Registros
function contarRegistros(array) {
  if (!Array.isArray(array)) return 0;
  return array.length;
}

// Cargar datos
async function cargarDatos() {
  const res = await fetch("data/data.json");
  datos = await res.json();
  const total = contarRegistros(datos);
  //totalReservas.textContent = `Total de reservas: ${total}`;
  totalReservas.innerHTML = `
    <span class="reservasTitulos"><strong>Total de reservas:</strong> <span class="reservasVisibles">${total}</span></span>
    `;
  mostrarDatos();
}

function cargarEnFormulario(dato, index, indiceAnteriors) {
  document.getElementById("editaCliente").value = dato.cliente;
  document.getElementById("editaFechaInicio").value = dato.fechaInicio;
  document.getElementById("editaFechaFin").value = dato.fechaFin;
  document.getElementById("editaVehiculosClientes").value = dato.vc;
  document.getElementById("editaVehiculosOrg").value = dato.vo;
  document.getElementById("editaComida").checked = dato.comida;
  document.getElementById("editaPrecio").value = dato.precio;
  document.getElementById("editaSeña").checked = dato.sena;
  document.getElementById("editaImporteSeña").value = dato.senaRecibida;
  document.querySelector(`.clienteSel`).textContent =
    `Editar Cliente Seleccionado: ${dato.cliente}`;
  actualizar.classList.remove("desactive");
  actualizar.classList.add("active");
  actualizar.disabled = false;
  //console.log(idSeleccionado);

  indiceEditando = index;
  indiceNuevo = indiceEditando;
  const elementoSelected = document.querySelector(`.card-${index}`);
  const elementoSelected1 = document.querySelector(`.card-${indiceAnteriors}`);
  const elementoActual = document.querySelector(`.card-${index}`);
  const elementoAnterior = document.querySelector(`.card-${indiceAnteriors}`);

  if (indiceNuevo != indiceAnterior) {
    indiceNuevo = index;
    indiceAnterior = indiceNuevo;
    if (elementoSelected1.dataset.selected == "true") {
      if (elementoSelected1.className.includes("selected")) {
        elementoSelected1.classList.remove("selected");
        elementoSelected1.dataset.selected = "false";
      } else {
        elementoSelected1.classList.add("selected");
      }
    }
    if (elementoSelected.dataset.selected == "true") {
      if (elementoSelected.className.includes("selected")) {
        elementoSelected.classList.remove("selected");
        elementoSelected.dataset.selected = "false";
      } else {
        elementoSelected.classList.add("selected");
      }
    }
  } else if (indiceNuevo == indiceAnterior) {
    if (elementoSelected1.dataset.selected == "true") {
      if (elementoSelected1.className.includes("selected")) {
        elementoSelected1.classList.remove("selected");
        elementoSelected1.dataset.selected = "false";
        elementoSelected.classList.add("selected");
      } else {
        elementoSelected1.classList.add("selected");
      }
    } else {
      if (elementoSelected1.className.includes("selected")) {
        elementoSelected1.classList.remove("selected");
      }
    }
    if (
      indiceEditando == indiceAnterior &&
      elementoActual.dataset.selected == "false"
    ) {
      document.getElementById("editaCliente").value = "";
      document.getElementById("editaFechaInicio").value = "";
      document.getElementById("editaFechaFin").value = "";
      document.getElementById("editaVehiculosClientes").value = "";
      document.getElementById("editaVehiculosOrg").value = "";
      document.getElementById("editaComida").checked = false;
      document.getElementById("editaPrecio").value = "";
      document.getElementById("editaSeña").checked = false;
      document.getElementById("editaImporteSeña").value = "";
      document.querySelector(`.clienteSel`).textContent =
        `Editar Cliente Seleccionado: `;
      actualizar.classList.remove("active");
      actualizar.classList.add("desactive");
      actualizar.disabled = true;
      if (btnEliminar.checked) {
        btnEliminar.checked = false;
      }
    }
  }
}

function mostrarDatos() {
  lista.innerHTML = "";

  datos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  datos.forEach((d, index) => {
    const div = document.createElement("div");
    const divContainer = document.createElement("div");
    divContainer.className = "divcontainer";
    const radio = document.createElement("input");
    // const btnElimina = document.createElement("button");
    // btnElimina.className = "btnelimina";
    // btnElimina.textContent = "Eliminar";
    // btnElimina.id = `card-${index}`;
    radio.type = "radio";
    div.className = `card-${index}`;
    div.id = "card";
    //div.appendChild(divContainer);
    div.innerHTML = `
    <button class="btnelimina" id="${d.id}"> Eliminar </button>
    `;
    divContainer.innerHTML = `
    <!-- <button class="btnelimina" id="${d.id}"> Eliminar </button> -->
    <!-- <div class="divcontainer"> -->
      <h2 class="elCliente"><strong>${d.cliente}</strong></h2><br>
      <span class="datosTitulos"><strong>Fecha Inicio:</strong> <span class="datosVisibles">${d.fechaInicio}</span></span>
      <span class="datosTitulos"><strong>Fecha Fin:</strong> <span class="datosVisibles">${d.fechaFin}</span></span>
      <span class="datosTitulos"><strong>Vehículos clientes:</strong> <span class="datosVisibles">${d.vc}</span></span>
      <span class="datosTitulos"><strong>Vehículos org:</strong> <span class="datosVisibles">${d.vo}</span></span>
      <span class="datosTitulos"><strong>Comida:</strong> <span class="datosVisibles">${d.comida ? "Sí" : "No"}</span></span>
      <span class="datosTitulos"><strong>Precio:</strong> <span class="datosVisibles">$${d.precio}</span></span>
      <span class="datosTitulos"><strong>Seña:</strong> <span class="datosVisibles">${d.sena ? "Sí" : "No"}</span></span>
      <span class="datosTitulos"><strong>Seña Recibida:</strong> <span class="datosVisibles">${d.senaRecibida}</span></span>
      <!-- </div> -->
    `;

    // 👉 CLICK PARA EDITAR
    divContainer.addEventListener("click", () => {
      idSeleccionado = d.id;
      if (div.dataset.selected == "true") {
        div.dataset.selected = "false";
      } else {
        div.dataset.selected = "true";
      }
      const clases = div.className;
      const numero = parseInt(clases.match(/card-(\d+)/)[1]);
      if (indiceAnterior === null) {
        indiceAnterior = numero;
      }
      if (indiceNuevo === null) {
        indiceNuevo = numero;
      }
      cargarEnFormulario(d, index, indiceAnterior);
    });

    //labelElimina.appendChild(radio);
    //div.before(btnElimina);

    div.prepend(divContainer);
    //divContainer.appendChild(div);
    lista.appendChild(div);

    //console.log(div);

    // lista.insertBefore(document.querySelector(`#card`), divContainer);

    const btnElimina = document.querySelector(`#${d.id}`);
    btnElimina.addEventListener("click", () => {
      //console.log(d.id);
      idSeleccionado = d.id;
      eliminar();
    });
    //console.log(btnElimina);
  });
}

let nuevo;
guarda.addEventListener("click", () => {
  if (elementos.length > 0) {
    const ultimo = elementos[elementos.length - 1];
    const numero = parseInt(ultimo.className.match(/card-(\d+)/)[1]);
    nuevoId = numero + 1;
  }
  nuevo = {
    id: `card-${nuevoId}`,
    cliente: document.getElementById("cliente").value,
    fechaInicio: document.getElementById("fechaInicio").value,
    fechaFin: document.getElementById("fechaFin").value,
    vc: document.getElementById("vehiculosClientes").value,
    vo: document.getElementById("vehiculosOrg").value,
    comida: document.getElementById("comida").checked,
    precio: document.getElementById("precio").value,
    sena: document.getElementById("seña").checked,
    senaRecibida: document.getElementById("importeSeña").value,
  };
  guardar(nuevo);
  limpiarFormulario("cargaClientes");
});

actualizar.addEventListener("click", (e) => {
  nuevo = {
    id: idSeleccionado,
    cliente: document.getElementById("editaCliente").value,
    fechaInicio: document.getElementById("editaFechaInicio").value,
    fechaFin: document.getElementById("editaFechaFin").value,
    vc: document.getElementById("editaVehiculosClientes").value,
    vo: document.getElementById("editaVehiculosOrg").value,
    comida: document.getElementById("editaComida").checked,
    precio: document.getElementById("editaPrecio").value,
    sena: document.getElementById("editaSeña").checked,
    senaRecibida: document.getElementById("editaImporteSeña").value,
  };
  if (btnEliminar.checked) {
    eliminar();
  } else {
    editar(nuevo);
  }
  limpiarFormulario("editaClientes");
});

async function guardar(contenido) {
  const res = await fetch(`${API}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "data/data.json",
      content: contenido,
    }),
  });
  const data = await res.json();
  if (res.ok && data.status === "registro agregado") {
    console.log("Guardado correctamente");
    await cargarDatos(); // 👈 recargás la lista
    console.log(datos);
  } else {
    console.error("Error al guardar", data);
  }
  data.logs.forEach((l) => console.log(l));

  alert("Guardado");
}

async function editar(contenido) {
  const res = await fetch(`${API}/editar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "data/data.json",
      id: idSeleccionado,
      content: contenido,
    }),
  });
  const data = await res.json();

  data.logs.forEach((l) => console.log(l));

  alert("Editado");
}

async function eliminar() {
  await fetch(`${API}/eliminar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: "data/data.json",
      id: idSeleccionado,
    }),
  });
}

function limpiarFormulario(formId) {
  const form = document.querySelector(`.${formId}`);
  //console.log(form);

  if (!form) return;

  const elementos = form.querySelectorAll("input, select, textarea");

  elementos.forEach((el) => {
    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = false;
    } else {
      el.value = "";
    }
  });
}

setInterval(async () => {
  const res = await fetch(`${API}/logs`);
  const logs = await res.json();

  //console.clear();
  logs.forEach((l) => console.log(l));
}, 5000);

function mostrarFechas(eventos) {
  const select = document.getElementById("fechas");

  eventos.forEach((ev) => {
    const fecha = ev.start.dateTime || ev.start.date;

    const option = document.createElement("option");
    option.value = fecha;
    option.textContent = `${fecha} - ${ev.summary}`;

    select.appendChild(option);
  });
}

cargarDatos();
