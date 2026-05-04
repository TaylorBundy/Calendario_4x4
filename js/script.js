const form = document.getElementById("formulario");
const lista = document.getElementById("lista");
const elementos = lista.children;
const totalReservas = document.querySelector(".totalReservas");
const guarda = document.querySelector(".guardar");
const actualizar = document.querySelector(".actualizar");
const botones = document.querySelectorAll("button");
const btnEliminar = document.querySelector("#editaElimina");
const eleEdita = document.querySelector(".editaClientes");
const API = "https://calendario-4x4.onrender.com";

let datos = [];
let indiceEditando = null;
let indiceNuevo = null;
let indiceAnterior = null;
let idSeleccionado = null;
let nuevoId = null;

window.addEventListener("DOMContentLoaded", () => {
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
  totalReservas.textContent = `Total de reservas: ${total}`;
  mostrarDatos();
}

function cargarEnFormulario(dato, index, indiceAnteriors) {
  document.getElementById("editaCliente").value = dato.cliente;
  document.getElementById("editaFecha").value = dato.fecha;
  document.getElementById("editaVehiculosClientes").value = dato.vc;
  document.getElementById("editaVehiculosOrg").value = dato.vo;
  document.getElementById("editaComida").checked = dato.comida;
  document.getElementById("editaPrecio").value = dato.precio;
  document.getElementById("editaSeña").checked = dato.sena;
  document.getElementById("editaImporteSeña").value = dato.senaRecibida;
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
      document.getElementById("editaFecha").value = "";
      document.getElementById("editaVehiculosClientes").value = "";
      document.getElementById("editaVehiculosOrg").value = "";
      document.getElementById("editaComida").checked = false;
      document.getElementById("editaPrecio").value = "";
      document.getElementById("editaSeña").checked = false;
      document.getElementById("editaImporteSeña").value = "";
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
    div.className = `card-${index}`;
    div.id = "card";

    div.innerHTML = `
      <strong>${d.cliente}</strong><br>
      Fecha: ${d.fecha}<br>
      Vehículos clientes: ${d.vc}<br>
      Vehículos org: ${d.vo}<br>
      Comida: ${d.comida ? "Sí" : "No"}<br>
      Precio: $${d.precio}<br>
      Seña: ${d.sena ? "Sí" : "No"}<br>
      Seña Recibida: ${d.senaRecibida}
    `;

    // 👉 CLICK PARA EDITAR
    div.addEventListener("click", () => {
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

    lista.appendChild(div);
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
    fecha: document.getElementById("fecha").value,
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
    fecha: document.getElementById("editaFecha").value,
    vc: document.getElementById("editaVehiculosClientes").value,
    vo: document.getElementById("editaVehiculosOrg").value,
    comida: document.getElementById("editaComida").checked,
    precio: document.getElementById("editaPrecio").value,
    sena: document.getElementById("editaSeña").checked,
    senaRecibida: document.getElementById("editaImporteSeña").value,
  };
  if (btnEliminar.checked) {
    //eliminar();
  } else {
    //editar(nuevo);
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

cargarDatos();
