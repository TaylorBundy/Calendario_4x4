const form = document.getElementById("formulario");
const lista = document.getElementById("lista");
const lista2 = document.getElementById("lista2");
const elementos = lista.children;
const cards = Array.from(lista.children);
const totalReservas = document.querySelector(".totalReservas");
const guarda = document.querySelector(".guardar");
const actualizar = document.querySelector(".actualizar");
const botones = document.querySelectorAll("button");
const btnEliminar = document.querySelector("#editaElimina");
const eleEdita = document.querySelector(".editaClientes");
const recargar = document.querySelector(".recargar");
const API = "https://calendario-4x4.onrender.com";

let datos = [];
let clientes = null;
let fechasInicio = null;
const clientesCalendar = [];
const reservas = [];
let existe = null;
let noexiste = null;
let indiceEditando = null;
let indiceNuevo = null;
let indiceAnterior = null;
let idSeleccionado = null;
let nuevoId = null;
let nuevoNumero = null;
let indiceSelect = null;
const API_KEY = "AIzaSyAVearlKR2iIcQd2eeS8zXqiKB2OITgIxU";
const CALENDAR_ID = "diegomartinbarbosa2@gmail.com";

const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;
let precioMatch;
let moneda;
function procesarDescripcionEvento(texto) {
  //console.log(texto);
  const resultado = {
    vehiculos: null,
    organizadores: null,
    precio: null,
    moneda: null,
    comida: null,
  };

  // =========================
  // VEHÍCULOS
  // =========================
  const vehiculosMatch = texto.match(
    /(\d+)\s*veh[ií]culos?(?!\s*organizadores)|vehiculos/i,
  );

  if (vehiculosMatch) {
    resultado.vehiculos = Number(vehiculosMatch[1]);
  }

  // =========================
  // ORGANIZADORES
  // =========================
  const organizadoresMatch = texto.match(
    /(\d+)\s*veh[ií]culos?\s*organizadores/i,
  );

  if (organizadoresMatch) {
    resultado.organizadores = Number(organizadoresMatch[1]);
  }

  // =========================
  // PRECIO
  // =========================
  const precioRegex =
    /(?:precio\s*pactado|precio\s*por\s*veh[ií]culo)?[\s:]*\$?\s*(\d+)\s*(usd|u\$s|d[oó]lares?|dolares|pesos?)?(?:\s*por\s*veh[ií]culo)?/i;
  const patronesPrecio = [
    /(\d+)\s*(usd|u\$s|d[oó]lares?|dolares|pesos?)\s*por\s*veh[ií]culo/i,

    /precio\s*(?:pactado|por\s*veh[ií]culo)?[:\s]*\$?\s*(\d+)/i,

    /\$\s*(\d+)/i,
  ];

  for (const regex of patronesPrecio) {
    const match = texto.match(regex);

    if (match) {
      precioMatch = match;
    }
  }

  if (precioMatch) {
    resultado.precio = Number(precioMatch[1]);

    if (precioMatch[2]) {
      moneda = precioMatch[2].toLowerCase();

      if (
        moneda.includes("usd") ||
        moneda.includes("u$s") ||
        moneda.includes("dólar") ||
        moneda.includes("dolar") ||
        moneda.includes("dolares")
      ) {
        resultado.moneda = "USD";
      } else if (moneda.includes("peso")) {
        resultado.moneda = "ARS";
      }
    }
  }

  // =========================
  // COMIDA
  // =========================
  //console.log(texto);
  if (/no\s*incluye\s*comida/i.test(texto.toLowerCase())) {
    resultado.comida = false;
  } else if (/incluye\s*comida|con\s*comida/i.test(texto.toLowerCase())) {
    resultado.comida = true;
  }

  return resultado;
}

// function obtenerPrecio2(texto) {
//   const regex =
//     /(?:precio\s*pactado|precio\s*por\s*veh[ií]culo)?[\s:]*\$?\s*(\d+)\s*(?:usd|u\$s|d[oó]lares?)?(?:\s*por\s*veh[ií]culo)?/i;

//   const match = texto.match(regex);

//   return match ? Number(match[1]) : null;
// }

// function obtenerPrecio(texto) {
//   const patrones = [
//     /(\d+)\s*d[oó]lares?\s*por\s*veh[ií]culo/i,
//     /precio\s*por\s*veh[ií]culo[:\s]*\$?\s*(\d+)/i,
//     /precio\s*pactado[:\s]*\$?\s*(\d+)/i,
//   ];

//   for (const regex of patrones) {
//     const match = texto.match(regex);

//     if (match) {
//       return Number(match[1]);
//     }
//   }

//   return null;
// }

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    //console.log(data);
    const items = data.items;
    items.forEach((ev) => {
      const fechaIn = ev?.start.date;
      const fechaFn = ev?.end.date;
      const nomCli = ev?.summary;
      const descrip = procesarDescripcionEvento(ev?.description);
      const cliente = `cliente: ${nomCli}`;
      const fechaInicio = `start: ${fechaIn}`;
      const fechaFin = `end: ${fechaFn}`;
      const vehiculosClientes = `vehiculos: ${descrip.vehiculos}`;
      const vehiculosOrganizadores = `vehiculos organizadores: ${descrip.organizadores}`;
      const comida = `comida: ${descrip.comida}`;
      const moneda = `moneda: ${descrip.moneda}`;
      const precio = `precio: ${descrip.precio}`;
      //console.log(cliente);
      //console.log(fechaInicio);
      clientesCalendar.push({
        cliente: cliente.toLowerCase(),
        fecha: fechaInicio.toLowerCase(),
      });
      clientes = nomCli.toLowerCase();
      fechasInicio = fechaInicio.toLowerCase();
      console.log(clientes);
      // console.log(fechaFin);
      // console.log(vehiculosClientes);
      // console.log(vehiculosOrganizadores);
      // console.log(precio);
      // console.log(moneda);
      // console.log(comida);
      //console.log(`descripcion: ${ev?.description}`);
      //console.log(descrip);
    });
    mostrarFechas(data.items);
  });

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    lista.querySelectorAll(".divcontainer").forEach((card) => {
      //console.log(card.querySelector("h2"));
      reservas.push({
        cliente: card.querySelector("h2")?.textContent.trim().toLowerCase(),
        fecha: card
          .querySelector("#fechaInicio")
          ?.textContent.trim()
          .toLowerCase(),
      });
    });
    // const elementos = lista.children;
    // const todosLista = lista.querySelectorAll("#card");
    // todosLista.forEach((el) => {
    //   const nombreClase = el.className;

    //   //console.log(nombreClase.split("-"));
    // });
    // for (let i = 0; i < elementos.length; i++) {
    //   console.log(elementos[i].className);
    // }
    // if (elementos.length > 0) {
    //   const ultimo = elementos[elementos.length - 1];
    //   console.log(ultimo.className);
    // }
    const ultimo = lista.lastElementChild;
    const dataId = ultimo.dataset.id;
    //const nomCliente = lista.querySelectorAll(".divcontainer");
    //const fechasss = lista.querySelectorAll("#fechaInicio");
    //const clientes2 = nomCliente;
    // clientes2.forEach((elemento, index) => {
    //   const cliente = elemento.querySelector("h2").textContent;
    //   const fecha = elemento.querySelector("#fechaInicio").textContent;
    //   clientes = cliente;
    //   console.log(`cliente: ${cliente} - fecha: ${fecha}`);
    //   // console.log(fecha);
    //   // console.log(cliente);
    //   //console.log(el.textContent);
    // });
    //console.log(clientes);
    // fechasss.forEach((el) => {
    //   console.log(el.textContent);
    // });

    nuevoNumero = Number(dataId.split("-")[1]) + 1;
    //console.log(clientesCalendar);
  }, 2000);
  // clientes.forEach((el) => {
  //   console.log(el);
  // });

  recargar.addEventListener("click", () => {
    cargarDatos();
    //console.log(datos);
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

  datos.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  datos.forEach((d, index) => {
    const div = document.createElement("div");
    const divContainer = document.createElement("div");
    divContainer.className = "divcontainer";
    const imgContainer = document.createElement("div");
    imgContainer.className = "imgContainer";
    const imgDiv = document.createElement("img");
    imgDiv.className = "img";
    imgDiv.src = "images/fondo-transparente.webp";
    const radio = document.createElement("input");
    // const btnElimina = document.createElement("button");
    // btnElimina.className = "btnelimina";
    // btnElimina.textContent = "Eliminar";
    // btnElimina.id = `card-${index}`;
    radio.type = "radio";
    div.className = `card-${index}`;
    div.id = "card";
    div.dataset.id = `card-${index}`;
    //div.appendChild(divContainer);
    div.innerHTML = `
    <button class="btnelimina" id="${d.id}"> Eliminar </button>
    `;
    divContainer.innerHTML = `
    <!-- <button class="btnelimina" id="${d.id}"> Eliminar </button> -->
    <!-- <div class="divcontainer"> -->
      <h2 class="elCliente"><strong>${d.cliente}</strong></h2><br>
      <span class="datosTitulos"><strong>Fecha Inicio:</strong> <span class="datosVisibles" id="fechaInicio">${d.fechaInicio}</span></span>
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
      //console.log(numero);
      if (indiceAnterior === null) {
        indiceAnterior = numero;
      }
      if (indiceNuevo === null) {
        indiceNuevo = numero;
      }
      //console.log(idSeleccionado);
      cargarEnFormulario(d, index, indiceAnterior);
    });

    //labelElimina.appendChild(radio);
    //div.before(btnElimina);

    div.prepend(divContainer);
    divContainer.prepend(imgContainer);
    imgContainer.appendChild(imgDiv);
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

function mostrarDatosGoogle(d, index = 0) {
  console.log(d);

  // reservas.forEach((el) => {
  //   console.log(el);
  // });
  setTimeout(() => {
    const resultados = reservas.filter((r) =>
      r.cliente.toLowerCase().includes(clientes),
    );
    const resultados2 = reservas.filter((r) => {
      console.log(r.cliente.toLowerCase());
      r.cliente.toLowerCase().includes(clientes);
    });
    // resultados.forEach((el) => {
    //   console.log(el);
    // });
    console.log(resultados2);
    console.log(resultados);
    if (resultados) {
      const clienteExiste = resultados[0].cliente;
      const fechaExiste = resultados[0].fecha;
      console.log(clienteExiste);
      console.log(fechaExiste);
      if (clienteExiste && fechaExiste) return;
    }
  }, 3000);

  //console.log(fechaExiste);

  console.log(clientes);
  // const existe = reservas.filter((r) => {
  //   console.log(r.cliente);
  //   r.cliente === d.cliente.toLowerCase();
  // });
  // console.log(existe);
  // if (existe) {
  //   console.log(existe);
  // }
  //if (clientes && fechasInicio) return;
  //nuevoNumero = nuevoNumero + 1;
  //console.log(d.cliente);
  //lista.innerHTML = "";
  // lista.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  const div = document.createElement("div");
  const divContainer = document.createElement("div");

  divContainer.className = "divcontainer";

  const imgContainer = document.createElement("div");
  imgContainer.className = "imgContainer";

  const imgDiv = document.createElement("img");
  imgDiv.className = "img";
  imgDiv.src = "images/fondo-transparente.webp";

  div.className = `card-${nuevoNumero}`;
  div.dataset.id = `card-${nuevoNumero}`;
  div.id = "card";

  div.innerHTML = `
    <button class="btnelimina" id="card-${nuevoNumero}">
      Eliminar
    </button>
  `;

  divContainer.innerHTML = `
      <h2 class="elCliente">
        <strong>${d.cliente || ""}</strong>
      </h2><br>

      <span class="datosTitulos">
        <strong>Fecha Inicio:</strong>
        <span class="datosVisibles" id="fechaInicio">
          ${d.fechaInicio || ""}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Fecha Fin:</strong>
        <span class="datosVisibles">
          ${d.fechaFin || ""}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Vehículos clientes:</strong>
        <span class="datosVisibles">
          ${d.vc || ""}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Vehículos org:</strong>
        <span class="datosVisibles">
          ${d.vo || ""}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Comida:</strong>
        <span class="datosVisibles">
          ${d.comida ? "Sí" : "No"}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Precio:</strong>
        <span class="datosVisibles">
          $${d.precio || ""}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Seña:</strong>
        <span class="datosVisibles">
          ${d.sena ? "Sí" : "No"}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Seña Recibida:</strong>
        <span class="datosVisibles">
          ${d.senaRecibida || ""}
        </span>
      </span>
  `;

  // CLICK EN LA CARD
  divContainer.addEventListener("click", () => {
    idSeleccionado = `card-${index}`;
    //console.log(idSeleccionado);

    div.dataset.selected = div.dataset.selected === "true" ? "false" : "true";
    const clases = div.className;
    const numero = parseInt(clases.match(/card-(\d+)/)[1]);
    //console.log(numero);
    if (indiceAnterior === null) {
      indiceAnterior = numero;
    }
    if (indiceNuevo === null) {
      indiceNuevo = numero;
    }

    cargarEnFormulario(d, index, indiceAnterior);
  });

  div.prepend(divContainer);

  divContainer.prepend(imgContainer);

  imgContainer.appendChild(imgDiv);

  lista.appendChild(div);

  // BOTÓN ELIMINAR
  const btnElimina = div.querySelector(".btnelimina");

  btnElimina.addEventListener("click", () => {
    idSeleccionado = d.id;
    eliminar();
  });
  ordenarPorFecha();
}

function procesarEventoGoogle(ev) {
  const descripcion = ev.description || "";

  const datosExtraidos = procesarDescripcionEvento(descripcion);

  return {
    id: ev.id,
    cliente: ev.summary || "",
    fechaInicio: ev.start.dateTime || ev.start.date,

    fechaFin: ev.end.dateTime || ev.end.date,

    vc: datosExtraidos.vehiculos,
    vo: datosExtraidos.organizadores,
    comida: datosExtraidos.comida,
    precio: datosExtraidos.precio,

    sena: false,
    senaRecibida: "",
  };
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
    //console.log(datos);
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

function mostrarFechas2(eventos) {
  const select = document.getElementById("fechas");

  eventos.forEach((ev) => {
    const fecha = ev.start.dateTime || ev.start.date;

    const option = document.createElement("option");
    option.value = fecha;
    option.textContent = `${fecha} - ${ev.summary}`;

    select.appendChild(option);
  });
}
const select = document.getElementById("fechas");
select.selectedIndex = -1;
// select.addEventListener("mousedown", () => {
//   console.log("Abrió el select");
//   console.log(`selectedindex: ${select.selectedIndex}`);
// });

function mostrarFechas(eventos) {
  //console.log(eventos);
  // const resultados = clientesCalendar.filter((r) =>
  //   r.cliente.toLowerCase().includes(reservas),
  // );
  //console.log(clientes);
  // const resultados = reservas.filter((r) =>
  //   r.cliente.toLowerCase().includes(clientesCalendar.cliente),
  // );
  // const clientesReservas = reservas.map((c) => c.cliente.toLowerCase());
  // setTimeout(() => {
  //   console.log(clientesReservas);
  // }, 2000);
  setTimeout(() => {
    const clientesCalendar2 = clientesCalendar.map((c) => ({
      cliente: c.cliente.replace("cliente:", "").trim().toLowerCase(),
      fecha: c.fecha.replace("start:", "").trim().toLowerCase(),
    }));

    const clientesCards3 = reservas.map((c) => ({
      cliente: c.cliente.replace("cliente:", "").trim().toLowerCase(),
      fecha: c.fecha.replace("fecha:", "").trim().toLowerCase(),
    }));
    // console.log(clientesCalendar2);
    // console.log(clientesCards3);
    clientesCalendar2.forEach((calendar) => {
      existe = clientesCards3.some(
        (card) =>
          card.cliente === calendar.cliente && card.fecha === calendar.fecha,
      );

      if (existe) {
        //console.log("YA EXISTE:", calendar);
        return;
      } else {
        //console.log("NO EXISTE:", calendar);
      }
    });
    const faltantes = clientesCalendar2.filter(
      (calendar) =>
        !clientesCards3.some(
          (card) =>
            card.cliente === calendar.cliente && card.fecha === calendar.fecha,
        ),
    );
    noexiste = faltantes;

    //console.log(noexiste);
    //console.log(existe);
    //if (existe) return;
    //}, 2000);

    // resultados.forEach((el) => {
    //   console.log(el);
    // });
    //console.log(resultados);
    // const clienteExiste = resultados.cliente;
    // const fechaExiste = resultados.fecha;
    // console.log(clienteExiste);
    // console.log(fechaExiste);
    // // resultados.forEach((ev) => {
    // //   console.log(ev.cliente);
    // //   clientes = ev.cliente;
    // //   fechasInicio = ev.fechaInicio;
    // // });
    // //const clienteExiste = resultados[0].cliente;
    // //const fechaExiste = resultados[0].fecha;
    // console.log(clientesCalendar);
    // //console.log(clienteExiste);
    // //console.log(fechaExiste);
    // console.log(resultados);
    //console.log(reservas);
    //console.log(`cliente: ${clientes} - fecha: ${fechasInicio}`);
    //console.log(reservas);
    //const select = document.getElementById("fechas");

    // Limpiar opciones anteriores
    //select.innerHTML = "";

    // eventos.forEach((ev, index) => {
    //   const fecha = ev.start.dateTime || ev.start.date;

    //   const option = document.createElement("option");

    //   option.value = index;
    //   option.textContent = `${fecha} - ${ev.summary}`;

    //   select.appendChild(option);
    // });

    // recorrer eventos originales
    eventos.forEach((ev, index) => {
      const datos = procesarEventoGoogle(ev);
      //console.log(datos);
      //console.log(index);

      const cliente = datos.cliente.trim().toLowerCase();

      const fecha = datos.fechaInicio.trim().toLowerCase();

      // verificar si existe
      const existe = clientesCards3.some(
        (card) => card.cliente === cliente && card.fecha === fecha,
      );

      // si YA existe → no agregar
      //if (existe) return;

      // ✅ SOLO FALTANTES
      const option = document.createElement("option");

      option.value = index;
      option.textContent = `${fecha} - ${cliente}`;

      select.appendChild(option);
    });

    // Cuando cambia la selección
    select.onchange = () => {
      const eventoSeleccionado = eventos[select.value];
      //console.log(eventoSeleccionado);
      const datosProcesados = procesarEventoGoogle(eventoSeleccionado);
      //console.log(datosProcesados.cliente);
      clientes = datosProcesados.cliente.toLowerCase();
      fechasInicio = datosProcesados.fechaInicio.toLowerCase();
      console.log(`cliente: ${clientes} - fechaInicio: ${fechasInicio}`);

      mostrarDatosGoogle(datosProcesados, nuevoNumero);
    };
  }, 2000);
}

function ordenarPorFecha() {
  const cards = Array.from(lista.children);

  cards.sort((a, b) => {
    const fechaA = new Date(a.querySelector("#fechaInicio").textContent);
    const fechaB = new Date(b.querySelector("#fechaInicio").textContent);

    return fechaA - fechaB;
  });

  // volver a insertar ordenados
  cards.forEach((card) => lista.appendChild(card));
}

//console.log(reservas);

cargarDatos();
