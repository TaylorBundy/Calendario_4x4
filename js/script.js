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
const eleCarga = document.querySelector(".cargaClientes");
const recargar = document.querySelector(".recargar");
const select = document.getElementById("fechas");
const editaPrecio = document.getElementById("editaPrecio").value;
const lala = editaPrecio.split(" ");
const API = "https://calendario-4x4.onrender.com";
const btnModal = document.querySelector("#btnModal");
const plataforma = navigator.userAgent;
const urlObj = new URL(window.location.toString());
const domain = urlObj.hostname;

let urlJSON = null;
let datos = [];
let eventosCalen = [];
let descripciones = [];
let clientes = null;
let fechasInicio = null;
//const cambios2 = [];
const clientesCalendar = [];
const reservas = [];
const modificados = [];
let nuevo;
const datosNuevos = [];
let fechaFin = null;
let existe = null;
let noexiste = null;
let indiceEditando = null;
let indiceNuevo = null;
let indiceAnterior = null;
let idSeleccionado = null;
let nuevoId = null;
let nuevoNumero = null;
let indiceSelect = null;
let idCalendar = null;
let numero = null;
let idcCalendar = null;
let estado = null;
let numeroIDSelect = null;
let origen = null;
let comidaCheck = false;
let señaCheck = false;
let idCard = null;
let idCard2 = null;
let numeroMayor = 0;
let numeroInicial = null;
let dataId = null;
let tarjetaAnterior = null;
let cardAnterior = null;
let cardNueva = null;
let nombreAnterior = null;
let nombreNuevo = null;
let elID;
let elementoEliminar = null;
let timerRecarga = null;
const visibles = [];
const ocultas = [];
const ahora = new Date();
const fechaHoy =
  ahora.getFullYear() +
  "-" +
  String(ahora.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(ahora.getDate()).padStart(2, "0");
let fechaFormateada = null;
//let indiceSelect = null;
const API_KEY = "AIzaSyAVearlKR2iIcQd2eeS8zXqiKB2OITgIxU";
const CALENDAR_ID = "diegomartinbarbosa2@gmail.com";

const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;
let precioMatch;
let moneda;
function procesarDescripcionEvento(texto) {
  if (!texto || texto == null) return;
  //console.log(texto);
  const resultado = {
    vehiculos: null,
    organizadores: null,
    precio: null,
    moneda: null,
    comida: null,
    sena: null,
  };
  const textoLower = (texto || "").toLowerCase();

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
        moneda = "USD";
        resultado.moneda = "USD";
      } else if (moneda.includes("peso")) {
        moneda = "ARS";
        resultado.moneda = "ARS";
      }
    }
  }

  // =========================
  // COMIDA
  // =========================
  // if (/\b(true|s[ií])\b|incluye\s*comida|con\s*comida/i.test(texto)) {
  //   resultado.comida = "Sí";
  // } else if (/\b(false|no)\b|No|no\s*incluye\s*comida/i.test(texto)) {
  //   resultado.comida = "No";
  // }
  // console.log(resultado.comida);
  // if (/\b(false|no)\b|no\s*incluye\s*comida/i.test(texto)) {
  //   resultado.comida = "No";
  // } else if (
  //   /\b(true|s[ií])\b|(?<!no\s)incluye\s*comida|con\s*comida/i.test(texto)
  // ) {
  //   resultado.comida = "Sí";
  // }
  // if (
  //   !texto ||
  //   textoLower.includes("no incluye comida") ||
  //   /\bno\b/.test(textoLower)
  // ) {
  //   resultado.comida = "No";
  // } else if (
  //   textoLower.includes("incluye comida") ||
  //   textoLower.includes("con comida") ||
  //   /\b(si|sí|true)\b/.test(textoLower)
  // ) {
  //   resultado.comida = "Sí";
  // }
  const tieneComida = [
    "desayuno",
    "almuerzo",
    "merienda",
    "cena",
    "comida",
  ].some((palabra) => textoLower.includes(palabra));

  if (
    !texto ||
    textoLower.includes("no incluye comida") ||
    /\bno\b/.test(textoLower) ||
    !tieneComida
  ) {
    resultado.comida = "No";
  } else {
    resultado.comida = "Sí";
  }

  //console.log(resultado.comida);
  // =========================
  // SEÑA
  // =========================
  if (/\b(true|s[ií])\b|incluye\s*seña|con\s*seña/i.test(texto)) {
    resultado.sena = "Sí";
  } else if (/\b(false|no)\b|no\s*seña\s*seña/i.test(texto)) {
    resultado.sena = "No";
  }

  return resultado;
}
const btnOcultas = document.querySelector("#btnOcultas");
btnOcultas.addEventListener("click", () => {
  const visible = lista2.style.display === "grid";

  //lista2.style.display = visible ? "none" : "block";
  if (visible) {
    lista2.style.display = "none";
    mostrarDatos2(lista2, false);
    btnOcultas.textContent = "Mostrar reservas ocultas";
  } else {
    lista2.style.display = "grid";
    mostrarDatos2(lista2, true);
    btnOcultas.textContent = "Ocultar reservas ocultas";
  }

  // btnOcultas.textContent = visible
  //   ? "Mostrar reservas ocultas"
  //   : "Ocultar reservas ocultas";
  // //ocultas.forEach((item) => {
  // mostrarDatos2(lista2, true);
  //});
});
datos.forEach((item) => {
  const ahora = new Date();

  const [anio, mes, dia] = item.fechaFin.split("-");

  const fechaFin = new Date(anio, mes - 1, dia);

  fechaFin.setHours(23, 59, 59, 999);

  if (ahora <= fechaFin) {
    visibles.push(item);
  } else {
    ocultas.push(item);
  }
});

// MOSTRAR U OCULTAR BOTÓN
function muestraBoton() {
  if (ocultas.length === 0) {
    btnOcultas.style.display = "none";
  } else {
    btnOcultas.style.display = "block";
  }
}

function restarDias(fechaInicio, fechaFin, dias) {
  // Si son iguales, devolver la misma fecha
  if (fechaInicio === fechaFin) {
    return fechaFin;
  }

  const nuevaFecha = new Date(fechaFin);

  nuevaFecha.setDate(nuevaFecha.getDate() - dias);

  return nuevaFecha.toISOString().split("T")[0];
}

function formatearFecha(fecha) {
  // yyyy-mm-dd
  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return fecha;
  }

  const f = new Date(fecha);

  if (isNaN(f.getTime())) {
    return null;
  }

  const year = f.getFullYear();

  const month = String(f.getMonth() + 1).padStart(2, "0");

  const day = String(f.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// fetch(url)
//   .then((res) => res.json())
//   .then((data) => {
//     //console.log(data);
//     // eventosCalen.push(data);
//     // //descripciones.push(data.items);
//     // const items = data.items;
//     // items.forEach((ev) => {
//     //   //console.log(ev);
//     //   const fechaIn = ev?.start.date || ev?.start.dateTime;
//     //   const fechaFn = ev?.end.date || ev?.end.dateTime;
//     //   const nomCli = ev?.summary;
//     //   const descrip = procesarDescripcionEvento(ev?.description) || null;
//     //   const cliente = `cliente: ${nomCli}`;
//     //   const fechaInicio = `start: ${fechaIn}`;
//     //   const detalle = ev?.description || null;
//     //   descripciones.push({
//     //     cliente: nomCli.toLowerCase(),
//     //     descripcion: detalle,
//     //   });
//     //   const fechaFin1 = `end: ${fechaFn}`;
//     //   //console.log(formatearFecha(fechaInicio.replace("start:", "").trim()));
//     //   if (ev?.start.date) {
//     //     //console.log(`si es date:${fechaInicio.replace("start: ", "").trim()}`);
//     //     //console.log(fechaInicio.replace("start:", "").trim());
//     //     fechaFormateada = fechaInicio.replace("start: ", "").trim();
//     //     //fechaFin = fechaFin1.replace("end: ", "").trim();
//     //     fechaFin = restarDias(
//     //       fechaFormateada,
//     //       fechaFin1.replace("end: ", "").trim(),
//     //       1,
//     //     );
//     //     //console.log(fechaFormateada);
//     //     //return;
//     //   } else {
//     //     // console.log(
//     //     //   `si es dateTime:${normalizarFecha(fechaInicio.replace("start: ", "").trim())}`,
//     //     // );
//     //     fechaFormateada = formatearFecha(
//     //       fechaInicio.replace("start: ", "").trim(),
//     //     );
//     //     fechaFin = formatearFecha(fechaFin1.replace("end: ", "").trim());
//     //   }
//     //   //console.log(fechaFormateada);
//     //   //const fechaInicio: ev.start.dateTime || ev.start.date,
//     //   const vehiculosClientes = `vehiculos: ${descrip?.vehiculos}` || null;
//     //   const vehiculosOrganizadores = `vehiculos organizadores: ${descrip?.organizadores}`;
//     //   const comida = `comida: ${descrip?.comida}`;
//     //   const moneda = `moneda: ${descrip?.moneda}`;
//     //   const precio = `precio: ${descrip?.precio}`;
//     //   const id = ev?.id;
//     //   idCalendar = ev?.id;
//     //   clientesCalendar.push({
//     //     id: id.toLowerCase().trim(),
//     //     cliente: cliente.trim(),
//     //     //fecha: fechaInicio.toLowerCase().trim(),
//     //     fecha: fechaFormateada,
//     //     fechaFin: fechaFin,
//     //     //fecha: normalizarFecha(fechaInicio.replace("start:", "").trim()),
//     //     precio: precio.replace("precio: ", "").toLowerCase().trim(),
//     //     moneda: moneda.replace("moneda: ", "").toLowerCase().trim(),
//     //   });
//     //   //console.log(clientesCalendar);
//     //   clientes = nomCli.toLowerCase();
//     //   fechasInicio = fechaInicio.toLowerCase();
//     // });
//     //cargarEventosGoogle(url);
//     //mostrarFechas(data.items);
//   });

async function cargarEventosGoogle(url) {
  try {
    // limpiar antes de recargar
    clientesCalendar.length = 0;
    //descripciones.length = 0;

    // limpiar select
    select.innerHTML = "";

    const res = await fetch(url);

    const data = await res.json();

    eventosCalen.length = 0;
    eventosCalen.push(data);

    const items = data.items || [];

    items.forEach((ev) => {
      const fechaIn = ev?.start.date || ev?.start.dateTime;

      const fechaFn = ev?.end.date || ev?.end.dateTime;

      const nomCli = ev?.summary;

      const descrip = procesarDescripcionEvento(ev?.description) || null;

      const detalle = ev?.description || null;

      descripciones.push({
        cliente: nomCli.toLowerCase(),
        descripcion: detalle,
      });

      let fechaFormateada = "";
      let fechaFin = "";

      // EVENTO TODO EL DIA
      if (ev?.start.date) {
        fechaFormateada = fechaIn;

        fechaFin = restarDias(fechaIn, fechaFn, 1);
      }

      // EVENTO CON HORA
      else {
        fechaFormateada = formatearFecha(fechaIn);

        fechaFin = formatearFecha(fechaFn);
      }

      clientesCalendar.push({
        id: ev?.id.toLowerCase().trim(),

        cliente: `cliente: ${nomCli}`,

        fecha: fechaFormateada,

        fechaFin: fechaFin,

        precio: `${descrip?.precio || ""}`.toLowerCase().trim(),

        moneda: `${descrip?.moneda || ""}`.toLowerCase().trim(),

        comida: `${descrip?.comida || ""}`.toLowerCase().trim(),
      });
    });

    // volver a llenar select
    mostrarFechas(items);
  } catch (error) {
    console.error("Error cargando Google Calendar:", error);
  }
}

function reconstruirReservasDesdeDOM() {
  reservas.length = 0;

  const mapa = {};

  lista.querySelectorAll(".divcontainer").forEach((card) => {
    const card2 = card.closest("[data-card-id]");

    reservas.push({
      cardID: card2.dataset.id,

      cliente: card.querySelector("h2")?.textContent.trim(),

      fecha: card.querySelector("#fechaInicio")?.textContent.toLowerCase(),

      fechaFin: card.querySelector("#fechaFin")?.textContent.toLowerCase(),

      vc: card.querySelector("#vc")?.textContent.toLowerCase(),

      vo: card.querySelector("#vo")?.textContent.toLowerCase(),

      comida: card.querySelector("#comida")?.textContent,

      precio: card
        .querySelector("#precio")
        ?.textContent.replace(`${moneda} `, ""),
    });
  });

  descripciones.forEach((d) => {
    mapa[d.cliente.toLowerCase().trim()] = d.descripcion;
  });

  reservas.forEach((reserva) => {
    reserva.descripcion = mapa[reserva.cliente.toLowerCase().trim()] || "";
  });
}

// window.addEventListener("DOMContentLoaded", () => {
//   fechaFin = null;
//   reconstruirReservasDesdeDOM();
//   setTimeout(() => {
//     // const mapa = {};

//     // // console.log(visibles);
//     // // console.log(ocultas);
//     // //console.log(descripciones);
//     // lista.querySelectorAll(".divcontainer").forEach((card) => {
//     //   const card2 = card.closest("[data-card-id]");
//     //   //console.log(card2.dataset.id);
//     //   reservas.push({
//     //     cardID: card2.dataset.id,
//     //     cliente: card.querySelector("h2")?.textContent.trim(),
//     //     fecha: card.querySelector("#fechaInicio")?.textContent.toLowerCase(),
//     //     fechaFin: card.querySelector("#fechaFin")?.textContent.toLowerCase(),
//     //     vc: card.querySelector("#vc")?.textContent.toLowerCase(),
//     //     vo: card.querySelector("#vo")?.textContent.toLowerCase(),
//     //     comida: card.querySelector("#comida")?.textContent.toLowerCase(),
//     //     //descripcion: descripciones?.descripcion,
//     //     precio: card
//     //       .querySelector("#precio")
//     //       ?.textContent.replace(`${moneda} `, "")
//     //       .toLowerCase(),
//     //   });
//     //   //console.log(reservas);
//     // });
//     // // reservas.forEach((reserva) => {
//     // //   console.log(reserva.cardID);
//     // // });

//     // descripciones.forEach((d) => {
//     //   mapa[d.cliente.toLowerCase().trim()] = d.descripcion;
//     // });
//     // reservas.forEach((reserva) => {
//     //   reserva.descripcion = mapa[reserva.cliente.toLowerCase().trim()] || "";
//     // });

//     document.querySelectorAll("#card").forEach((card) => {
//       card.addEventListener("click", () => {
//         compararCards(card);
//       });
//     });
//     if (plataforma.includes("Android")) {
//       creaTop();
//       window.onscroll = function () {
//         scrollFunction();
//       };
//     }
//     const numeros = obtenerNumeros();
//     numeroInicial = numeros.mayor;

//     //console.log(reservas);
//     lista2.style.display = "none";
//     muestraBoton();
//   }, 2000);
//   cargarDatosDesde("data/data.json");
//   // recargar.addEventListener("click", () => {
//   //   cargarDatos();
//   //   //console.log(datos);
//   // });

//   const ele = eleEdita.querySelectorAll("input");
//   ele.forEach((el) => {
//     if (el.type === "text" || el.type === "number") {
//       if (el.value === "") {
//         //console.log(el);
//         actualizar.disabled = true;
//         actualizar.classList.add("desactive");
//         //actualizar.style.background = "#888";
//         //actualizar.style.cursor = "wait";
//       }
//     }
//   });
//   //console.log(eleEdita);
// });
window.addEventListener("DOMContentLoaded", async () => {
  await cargarEventosGoogle(url);

  reconstruirReservasDesdeDOM();

  document.querySelectorAll("#card").forEach((card) => {
    card.addEventListener("click", () => {
      compararCards(card);
    });
  });
  if (plataforma.includes("Android")) {
    creaTop();
    window.onscroll = function () {
      scrollFunction();
    };
  }
  if (!domain.includes("github.io")) {
    urlJSON = "data/data.json";
  } else {
    urlJSON =
      "https://raw.githubusercontent.com/TaylorBundy/Calendario_4x4/main/data/data.json";
  }
  cargarDatosDesde(urlJSON);
  setTimeout(() => {
    const numeros = obtenerNumeros();
    numeroInicial = numeros.mayor;
  }, 1000);

  //console.log(reservas);
  lista2.style.display = "none";
  muestraBoton();

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
});

function contarRegistrosVisibles(datos) {
  const ahora = new Date();

  return datos.filter((item) => {
    const fechaFinTexto = item.fechaFin;

    const [anio, mes, dia] = fechaFinTexto.split("-");

    const fechaFin = new Date(anio, mes - 1, dia);

    // visible hasta fin del día
    fechaFin.setHours(23, 59, 59, 999);
    if (ahora <= fechaFin) {
      visibles.push(item);
    } else {
      ocultas.push(item);
    }

    return ahora <= fechaFin;
  }).length;
}

// async function cargarJSON(urls = []) {
//   for (const url of urls) {
//     try {
//       const res = await fetch(url);

//       if (res.ok) {
//         return await res.json();
//       }
//     } catch (err) {
//       console.warn(`Error en ${url}`, err);
//     }
//   }

//   throw new Error("No se pudo cargar ningún JSON");
// }

// Cargar datos
// async function cargarDatos2() {
//   const res = await fetch("data/data.json");
//   datos = await res.json();
//   //const total = contarRegistros(datos);
//   const total = contarRegistrosVisibles(datos);
//   //totalReservas.textContent = `Total de reservas: ${total}`;
//   totalReservas.innerHTML = `
//     <span class="reservasTitulos"><strong>Total de reservas:</strong> <span class="reservasVisibles">${total}</span></span>
//     `;
//   mostrarDatos();
//   mostrarDatos2(lista2, true);
// }

// async function cargarDatos3() {
//   datos = await cargarJSON([
//     //"data/data.json",
//     "https://raw.githubusercontent.com/TaylorBundy/Calendario_4x4/main/data/data.json",
//   ]);

//   const total = contarRegistrosVisibles(datos);

//   totalReservas.innerHTML = `
//     <span class="reservasTitulos">
//       <strong>Total de reservas:</strong>
//       <span class="reservasVisibles">${total}</span>
//     </span>
//   `;

//   mostrarDatos();
//   mostrarDatos2(lista2, true);
// }

function cargarEnFormulario(dato, index, indiceAnteriors) {
  //console.log(dato);
  if (comidaCheck == "No") {
    comidaCheck = false;
  } else {
    comidaCheck = true;
  }
  if (señaCheck == "No") {
    señaCheck = false;
  } else {
    señaCheck = true;
  }
  document.getElementById("editaCliente").value = dato.cliente;
  const fecha2 = formatearFecha(dato.fechaInicio) || formatearFecha(dato.fecha);
  document.getElementById("editaFechaInicio").value = fecha2;
  //console.log(dato.fechaFin);
  if (dato.fechaFin > fechaFin) {
    fechaFin = restarDias(
      dato.fechaInicio,
      dato.fechaFin.replace("end: ", ""),
      1,
    );
  }
  document.getElementById("editaFechaFin").value = dato?.fechaFin;
  document.getElementById("editaVehiculosClientes").value = dato?.vc || "";
  document.getElementById("editaVehiculosOrg").value = dato?.vo || "";
  document.getElementById("editaComida").checked = comidaCheck;
  document.getElementById("editaPrecio").value =
    `${moneda} ${dato?.precio || ""}`;
  document.getElementById("editaSeña").checked = señaCheck;
  document.getElementById("editaImporteSeña").value = dato?.senaRecibida || "";
  document.querySelector(`.clienteSel`).textContent =
    `Editar Cliente Seleccionado: ${dato.cliente}`;
  actualizar.classList.remove("desactive");
  actualizar.classList.add("active");
  actualizar.disabled = false;
  //console.log(idSeleccionado);

  indiceEditando = index;
  indiceNuevo = indiceEditando;

  let elementoSelected;
  // console.log(estado);
  // console.log(origen);
  if (origen === "select") {
    document.querySelectorAll("#card").forEach((card) => {
      // console.log(card);
      //card.classList.remove("selected");
      if (card.className.includes("nuevo")) {
        actualizar.textContent = "guardar";
      }
      if (
        card.dataset.selected == "true" &&
        !card.className.includes("nuevo")
      ) {
        actualizar.textContent = "Actualizar";
      }
    });
    elementoSelected = document.querySelector(`.${numeroIDSelect}`);
  } else {
    elementoSelected = document.querySelector(`.card-${indiceAnteriors}`);
  }
  //console.log(elementoSelected);

  const elementoSelected1 = document.querySelector(`.card-${indiceAnteriors}`);
  // console.log(elementoSelected1);
  const elementoActual = document.querySelector(`.card-${index}`);
  const elementoAnterior = document.querySelector(`.card-${indiceAnteriors}`);
  if (elementoSelected == null) return;
  if (elementoSelected.className.includes("nuevo")) {
    actualizar.textContent = "guardar";
  }

  if (indiceNuevo != indiceAnterior) {
    // console.log(`linea390`);
    indiceNuevo = index;
    indiceAnterior = indiceNuevo;
  } else if (indiceNuevo == indiceAnterior) {
    if (
      indiceEditando == indiceAnterior &&
      elementoActual.dataset.selected == "false"
    ) {
      document.querySelector(`.clienteSel`).textContent =
        `Editar Cliente Seleccionado:`;
      limpiarFormulario(eleEdita);
      // console.log("linea525");
      actualizar.classList.remove("active");
      actualizar.classList.add("desactive");
      actualizar.disabled = true;
      if (btnEliminar.checked) {
        btnEliminar.checked = false;
      }
    }
  }
}
function mostrarDatos2(listaDestino, mostrarOcultas = false) {
  //console.log(listaDestino);
  listaDestino.innerHTML = "";

  const ahora = new Date();

  datos
    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
    .forEach((d, index) => {
      const [anio, mes, dia] = d.fechaFin.split("-");

      const fechaFin = new Date(anio, mes - 1, dia);

      fechaFin.setHours(23, 59, 59, 999);

      const estaOculta = ahora > fechaFin;

      // ✅ visibles
      if (!mostrarOcultas && estaOculta) return;

      // ✅ ocultas
      if (mostrarOcultas && !estaOculta) return;

      //   listaDestino.appendChild(div);
      const div = document.createElement("div");
      const divContainer = document.createElement("div");
      divContainer.className = "divcontainer";
      const imgContainer = document.createElement("div");
      imgContainer.className = "imgContainer";
      const imgDiv = document.createElement("img");
      imgDiv.className = "img";
      imgDiv.src = "images/fondo-transparente.webp";
      const radio = document.createElement("input");
      radio.type = "radio";
      div.className = `card-${index}`;
      div.id = "card";
      div.dataset.id = `card-${index}`;
      //div.appendChild(divContainer);
      div.innerHTML = `
    <button class="btnelimina" id="${d.id}">Eliminar</button>
    `;
      const longitud = d?.precio;
      if (longitud.length <= 3) {
        moneda = "USD";
      } else if (longitud.length > 3) {
        moneda = "ARS";
      }
      const valorComida =
        d.comida == null || String(d.comida).trim() === ""
          ? ""
          : typeof d.comida === "boolean"
            ? d.comida
              ? "Sí"
              : "No"
            : ["true", "Sí"].includes(String(d.comida).trim())
              ? "Sí"
              : ["false", "No"].includes(String(d.comida).trim())
                ? "No"
                : "";
      const valorSeña =
        d.sena == null || String(d.sena).trim() === ""
          ? ""
          : typeof d.sena === "boolean"
            ? d.sena
              ? "Sí"
              : "No"
            : ["true", "Sí"].includes(String(d.sena).trim())
              ? "Sí"
              : ["false", "No"].includes(String(d.sena).trim())
                ? "No"
                : "";
      comidaCheck = valorComida.trim();
      //comidaCheck = !(valorComida === "no" || valorComida === "false");
      señaCheck = valorSeña.trim(); //!(valorSeña === "No" || valorSeña === "false");

      divContainer.innerHTML = `
    <!-- <button class="btnelimina" id="${d.id}"> Eliminar </button> -->
    <!-- <div class="divcontainer"> -->
      <h2 class="elCliente"><strong>${d.cliente}</strong></h2><br>
      <span class="datosTitulos"><strong>Fecha Inicio:</strong> <span class="datosVisibles" id="fechaInicio">${d.fechaInicio}</span></span>
      <span class="datosTitulos"><strong>Fecha Fin:</strong> <span class="datosVisibles" id="fechaFin">${d.fechaFin}</span></span>
      <span class="datosTitulos"><strong>Vehículos clientes:</strong> <span class="datosVisibles" id="vc">${d.vc}</span></span>
      <span class="datosTitulos"><strong>Vehículos org:</strong> <span class="datosVisibles" id="vo">${d.vo}</span></span>
      <span class="datosTitulos"><strong>Comida:</strong> <span class="datosVisibles" id="comida">${comidaCheck}</span></span>
      <span class="datosTitulos"><strong>Precio:</strong> <span class="datosVisibles" id="precio">${moneda} ${d.precio}</span></span>
      <span class="datosTitulos"><strong>Seña:</strong> <span class="datosVisibles" id="seña">${señaCheck}</span></span>
      <span class="datosTitulos"><strong>Seña Recibida:</strong> <span class="datosVisibles" id="señaRecibida">${d.senaRecibida}</span></span>
      <!-- </div> -->
    `;
      // 👉 CLICK PARA EDITAR
      divContainer.addEventListener("click", (e) => {
        idSeleccionado = d.id;
        idCard2 = idSeleccionado;
        //console.log(idSeleccionado);
        // console.log(e.target.closest('div[id="card"]'));
        const card = e.target.closest("#card");
        if (!card) return;
        const form = document.querySelector(".editaClientes");
        // console.log(form);
        seleccionarCard(card, eleEdita);
        // if (card.dataset.selected === "true") {
        //   eleEdita.style.background = "#888";
        //   eleEdita.scrollIntoView({
        //     behavior: "smooth",
        //     block: "center",
        //   });
        // } else {
        //   eleEdita.style.background = "#2c2c2c";
        // }
        const clases = div.className;
        const numero = parseInt(clases.match(/card-(\d+)/)[1]);
        // console.log(numero);
        if (indiceAnterior === null) {
          indiceAnterior = numero;
        }
        if (indiceNuevo === null) {
          indiceNuevo = numero;
        }

        estado = "EXISTE";

        //cargarEnFormulario(d, index, indiceAnterior);
        if (card.dataset.selected === "true") {
          eleEdita.style.background = "#888";
          eleEdita.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          cargarEnFormulario(d, globalIndex, indiceAnterior);
        } else {
          eleEdita.style.background = "#2c2c2c";
          //limpiarFormulario(eleEdita);
        }
      });

      div.prepend(divContainer);
      divContainer.prepend(imgContainer);
      imgContainer.appendChild(imgDiv);
      //divContainer.appendChild(div);
      lista2.appendChild(div);

      //console.log(div);

      // lista.insertBefore(document.querySelector(`#card`), divContainer);

      const btnElimina = document.querySelector(`#${d.id}`);
      //console.log(btnElimina);
      btnElimina.addEventListener("click", () => {
        const option = select.options[select.selectedIndex];
        const lala = document.getElementById("editaPrecio").value.split(" ");
        const card = e.target.closest("#card");

        //console.log(d.id);
        idSeleccionado = d.id;
        idCard = idSeleccionado;
        idCard2 = btnElimina.id;
        if (btnElimina.textContent == "Eliminar") {
          elementoEliminar = card;
          (async () => {
            await eliminar();
            recargarEn5Minutos();
            eliminarCard(elementoEliminar);
          })();
          //console.log(d.id);
          // console.log("eliminar");
          if (option) {
            option.remove();
          }
        } else if (btnElimina.textContent == "Actualizar") {
          nuevo = {
            id: idCard2,
            cliente: document.getElementById("editaCliente").value,
            fechaInicio: document.getElementById("editaFechaInicio").value,
            fechaFin: document.getElementById("editaFechaFin").value,
            vc: document.getElementById("editaVehiculosClientes").value,
            vo: document.getElementById("editaVehiculosOrg").value,
            comida: document.getElementById("editaComida").checked,
            precio: lala[1],
            sena: document.getElementById("editaSeña").checked,
            moneda: lala[0],
            senaRecibida: document.getElementById("editaImporteSeña").value,
          };
          //editar(nuevo);
          (async () => {
            const resultado = await editar(nuevo);

            if (resultado.status === "editado correctamente") {
              recargarEn5Minutos();
            }
          })();
          //console.log(idCard2);
          //console.log(nuevo);
          if (option) {
            option.remove();
          }
        }
      });
      //console.log(btnElimina);
    });
  ordenarPorFecha();
  //});
}

// Funcion para agrupar por fecha
function agruparPorFecha(datos) {
  return datos.reduce((acc, item) => {
    const fecha = item.fechaInicio;

    if (!acc[fecha]) {
      acc[fecha] = [];
    }

    acc[fecha].push(item);

    return acc;
  }, {});
}

// Funcion para mostrar datos en el DOM
function mostrarDatos() {
  let globalIndex = 0;
  lista.innerHTML = "";

  datos.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
  const agrupados = agruparPorFecha(datos);
  //console.log(agrupados);

  //datos.forEach((d, index) => {
  Object.entries(agrupados).forEach(([fechaGrupo, items]) => {
    // contenedor grupo
    //console.log(fechaGrupo);
    // const grupo = document.createElement("div");

    // grupo.className = "grupo-fecha";
    // console.log(grupo);

    // // opcional:
    // grupo.dataset.fecha = fechaGrupo;
    let contenedorActual = lista;

    // solo grupos repetidos
    if (items.length > 1) {
      //console.log(items.length);
      const grupo = document.createElement("div");

      grupo.className = "grupo-fecha";

      grupo.dataset.fecha = fechaGrupo;
      grupo.style.gridColumn = `span ${items.length}`;
      const titulo = document.createElement("h3");

      titulo.textContent = fechaGrupo;

      titulo.className = "titulo-fecha";
      const cardsGrupo = document.createElement("div");
      cardsGrupo.className = "cards-grupo";

      grupo.appendChild(titulo);
      grupo.appendChild(cardsGrupo);

      lista.appendChild(grupo);

      contenedorActual = cardsGrupo;
    }

    items.forEach((d, index) => {
      //visibles.push(d);
      //console.log(d.id);
      const div = document.createElement("div");
      const divContainer = document.createElement("div");
      divContainer.className = "divcontainer";
      const imgContainer = document.createElement("div");
      imgContainer.className = "imgContainer";
      const imgDiv = document.createElement("img");
      imgDiv.className = "img";
      imgDiv.src = "images/fondo-transparente.webp";
      const radio = document.createElement("input");
      radio.type = "radio";
      //div.className = `card-${index}`;
      div.className = `card-${globalIndex}`;
      div.id = "card";
      div.dataset.id = `card-${globalIndex}`;
      div.dataset.cardId = `card-${globalIndex}`;
      d.cardId = d.id;
      elID = div.dataset.cardId;
      div.innerHTML = `
    <button class="btnelimina" id="${d.id}">Eliminar</button>
    `;
      const longitud = d?.precio;
      if (longitud.length <= 3) {
        moneda = "USD";
      } else if (longitud.length > 3) {
        moneda = "ARS";
      }
      const valorComida =
        d.comida == null || String(d.comida).trim() === ""
          ? ""
          : typeof d.comida === "boolean"
            ? d.comida
              ? "Sí"
              : "No"
            : ["true", "Sí"].includes(String(d.comida).trim())
              ? "Sí"
              : ["false", "No"].includes(String(d.comida).trim())
                ? "No"
                : "";
      const valorSeña =
        d.sena == null || String(d.sena).trim() === ""
          ? ""
          : typeof d.sena === "boolean"
            ? d.sena
              ? "Sí"
              : "No"
            : ["true", "Sí"].includes(String(d.sena).trim())
              ? "Sí"
              : ["false", "No"].includes(String(d.sena).trim())
                ? "No"
                : "";
      comidaCheck = valorComida.trim();
      //comidaCheck = !(valorComida === "no" || valorComida === "false");
      señaCheck = valorSeña.trim(); //!(valorSeña === "No" || valorSeña === "false");
      const resultado = restarDias(
        d.fechaInicio,
        d.fechaFin.replace("end: ", ""),
        1,
      );
      const fechafinal = d.fechaInicio || d.fecha;

      divContainer.innerHTML = `
    <!-- <button class="btnelimina" id="${d.id}"> Eliminar </button> -->
    <!-- <div class="divcontainer"> -->
      <h2 class="elCliente"><strong>${d.cliente}</strong></h2><br>
      <span class="datosTitulos"><strong>Fecha Inicio:</strong> <span class="datosVisibles" id="fechaInicio">${fechafinal}</span></span>
      <span class="datosTitulos"><strong>Fecha Fin:</strong> <span class="datosVisibles" id="fechaFin">${d.fechaFin}</span></span>
      <span class="datosTitulos"><strong>Vehículos clientes:</strong> <span class="datosVisibles" id="vc">${d.vc}</span></span>
      <span class="datosTitulos"><strong>Vehículos org:</strong> <span class="datosVisibles" id="vo">${d.vo}</span></span>
      <span class="datosTitulos"><strong>Comida:</strong> <span class="datosVisibles" id="comida">${comidaCheck}</span></span>
      <span class="datosTitulos"><strong>Precio:</strong> <span class="datosVisibles" id="precio">${moneda} ${d.precio}</span></span>
      <span class="datosTitulos"><strong>Seña:</strong> <span class="datosVisibles" id="seña">${señaCheck}</span></span>
      <span class="datosTitulos"><strong>Seña Recibida:</strong> <span class="datosVisibles" id="señaRecibida">${d.senaRecibida}</span></span>
      <!-- </div> -->
    `;
      // 👉 CLICK PARA EDITAR
      divContainer.addEventListener("click", (e) => {
        idSeleccionado = d.id;
        //console.log(idSeleccionado);
        idCard2 = idSeleccionado;
        // console.log(e.target.closest('div[id="card"]'));
        //const card = e.target.closest("#card");
        const card = e.target.closest("[data-card-id]");
        elementoEliminar = card;
        if (!card) return;
        const form = document.querySelector(".editaClientes");
        // console.log(form);
        seleccionarCard(card, eleEdita);
        // if (card.dataset.selected === "true") {
        //   eleEdita.style.background = "#888";
        //   eleEdita.scrollIntoView({
        //     behavior: "smooth",
        //     block: "center",
        //   });
        // } else {
        //   eleEdita.style.background = "#2c2c2c";
        //   //limpiarFormulario(eleEdita);
        // }
        const clases = div.className;
        const numero = parseInt(clases.match(/card-(\d+)/)[1]);
        // console.log(numero);
        if (indiceAnterior === null) {
          indiceAnterior = numero;
        }
        if (indiceNuevo === null) {
          indiceNuevo = numero;
        }

        estado = "EXISTE";
        if (card.dataset.selected === "true") {
          eleEdita.style.background = "#888";
          eleEdita.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          cargarEnFormulario(d, globalIndex, indiceAnterior);
        } else {
          eleEdita.style.background = "#2c2c2c";
          //limpiarFormulario(eleEdita);
        }
        //cargarEnFormulario(d, globalIndex, indiceAnterior);
      });
      //globalIndex++;

      div.prepend(divContainer);
      divContainer.prepend(imgContainer);
      imgContainer.appendChild(imgDiv);
      //divContainer.appendChild(div);
      //lista.appendChild(div);
      contenedorActual.appendChild(div);

      const btnElimina = div.querySelector(`.btnelimina`);
      btnElimina.addEventListener("click", (e) => {
        const option = select.options[select.selectedIndex];
        const lala = document.getElementById("editaPrecio").value.split(" ");
        const card = e.target.closest("#card");

        idSeleccionado = d.id;
        idCard = idSeleccionado;
        idCard2 = btnElimina.id;
        if (btnElimina.textContent == "Eliminar") {
          elementoEliminar = card;
          //eliminar();
          (async () => {
            await eliminar();
            recargarEn5Minutos();
            eliminarCard(elementoEliminar);
          })();
          if (option) {
            option.remove();
          }
        } else if (btnElimina.textContent == "Actualizar") {
          nuevo = {
            id: idCard2,
            cliente: document.getElementById("editaCliente").value,
            fechaInicio: document.getElementById("editaFechaInicio").value,
            fechaFin: document.getElementById("editaFechaFin").value,
            vc: document.getElementById("editaVehiculosClientes").value,
            vo: document.getElementById("editaVehiculosOrg").value,
            comida: document.getElementById("editaComida").checked,
            precio: lala[1],
            moneda: lala[0],
            sena: document.getElementById("editaSeña").checked,
            senaRecibida: document.getElementById("editaImporteSeña").value,
          };
          //editar(nuevo);
          (async () => {
            const resultado = await editar(nuevo);

            if (resultado.status === "editado correctamente") {
              recargarEn5Minutos();
            }
          })();
          if (option) {
            option.remove();
          }
        }
      });
      globalIndex++;
      // ACA TERMINA EL FOREACH
    });
    //lista.appendChild(contenedorActual);
    ordenarPorFecha();
  });
}

function mostrarDatosGoogle(d, index = 0) {
  //console.log(d);
  //console.log(d.cliente.toLowerCase());

  // reservas.forEach((el) => {
  //   console.log(el);
  // });
  setTimeout(() => {
    if (clientes === "patagonia 4x4") {
    } else {
      if (estado === "NO EXISTE") return;
      const resultados = reservas.filter((r) => r.cliente.includes(clientes));
      const resultados3 = reservas.some((r) => r.cliente.includes(clientes));
      if (resultados) {
        const clienteExiste = resultados[0].cliente;
        const fechaExiste = resultados[0].fecha;
        //console.log(clienteExiste);
        //console.log(fechaExiste);
        estado = "EXISTE";
        if (clienteExiste && fechaExiste) return;
      }
      if (resultados3) {
        const clienteExiste = reservas.has(resultados3.toLowerCase().trim());
        const fechaExiste = resultados[0].fecha;
        if (clienteExiste && fechaExiste) return;
      }
    }
  }, 3000);
  // const fechaFin = restarDias(
  //   d.fechaInicio,
  //   d.fechaFin.replace("end: ", ""),
  //   1,
  // );
  if (d.fechaFin > fechaFin) {
    fechaFin = restarDias(d.fechaInicio, d.fechaFin.replace("end: ", ""), 1);
  }
  const fecha2 = formatearFecha(d.fechaInicio);

  const div = document.createElement("div");
  const divContainer = document.createElement("div");

  divContainer.className = "divcontainer";

  const imgContainer = document.createElement("div");
  imgContainer.className = "imgContainer";

  const imgDiv = document.createElement("img");
  imgDiv.className = "img";
  imgDiv.src = "images/fondo-transparente.webp";

  div.className = `card-${nuevoNumero}`;

  div.classList.add("nuevo");
  div.dataset.id = `card-${nuevoNumero}`;
  div.id = "card";
  //div.dataset.selected = div.dataset.selected === "true" ? "false" : "true";

  div.innerHTML = `
    <button class="btnelimina" id="card-${numeroMayor}">
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
          ${fecha2 || ""}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Fecha Fin:</strong>
        <span class="datosVisibles" id="fechaFin">
          ${fechaFin || ""}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Vehículos clientes:</strong>
        <span class="datosVisibles" id="vc">
          ${d.vc || ""}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Vehículos org:</strong>
        <span class="datosVisibles" id="vo">
          ${d.vo || ""}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Comida:</strong>
        <span class="datosVisibles" id="comida">
          ${comidaCheck}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Precio:</strong>
        <span class="datosVisibles" id="precio">
          ${d.moneda || "ARS"} ${d.precio || "0"}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Seña:</strong>
        <span class="datosVisibles" id="seña">
          ${señaCheck}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Seña Recibida:</strong>
        <span class="datosVisibles" id="señaRecibida">
          ${d.senaRecibida || ""}
        </span>
      </span>
  `;

  // CLICK EN LA CARD
  divContainer.addEventListener("click", (e) => {
    idSeleccionado = `card-${index}`;
    idCard2 = `card-${numeroMayor}`;
    const card = e.target.closest("#card");
    if (!card) return;

    //console.log(idSeleccionado);
    //const form = document.querySelector(".editaClientes");
    seleccionarCard(card, eleEdita);
    //console.log(idSeleccionado);

    //div.dataset.selected = div.dataset.selected === "true" ? "false" : "true";
    const clases = div.className;
    const numero = parseInt(clases.match(/card-(\d+)/)[1]);
    //console.log(numero);
    if (indiceAnterior === null) {
      indiceAnterior = numero;
    }
    if (indiceNuevo === null) {
      indiceNuevo = numero;
    }

    //cargarEnFormulario(d, index, indiceAnterior);
    if (card.dataset.selected === "true") {
      eleEdita.style.background = "#888";
      eleEdita.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      cargarEnFormulario(d, index, indiceAnterior);
    } else {
      eleEdita.style.background = "#2c2c2c";
      //limpiarFormulario(eleEdita);
    }
  });

  div.prepend(divContainer);

  divContainer.prepend(imgContainer);

  imgContainer.appendChild(imgDiv);

  lista.appendChild(div);

  // BOTÓN ELIMINAR
  const btnElimina = div.querySelector(".btnelimina");

  // btnElimina.addEventListener("click", () => {
  //   idSeleccionado = d.id;
  //   eliminar();
  // });
  //console.log(indiceEditando);
  document.querySelectorAll("#card").forEach((card) => {
    if (card.className.includes("nuevo")) {
      btnElimina.textContent = "Guardar";
    }
  });
  btnElimina.addEventListener("click", (e) => {
    const card = e.target.closest("#card");
    idSeleccionado = d.id;
    //console.log(idCard2);
    if (btnElimina.textContent == "Eliminar") {
      (async () => {
        await eliminar();
        recargarEn5Minutos();
        eliminarCard(card);
      })();
    } else if (btnElimina.textContent == "Guardar") {
      //console.log(nuevo);
      //guardar(nuevo);
      (async () => {
        const resultado = await guardar(nuevo);
        if (resultado.ok === false) {
          console.log("Falló:", resultado.error);
        } else {
          console.log("Respuesta backend:", resultado);
          //esperarBackend(`${API}/health`);
          recargarEn5Minutos();
        }
      })();
    }
  });
  // const botonEliminar = document.querySelector(`#card-${nuevoNumero}`);
  // console.log(btnElimina);
  const card = document.querySelector(`#card[data-id="card-${nuevoNumero}"]`);
  if (!card) return;

  idCard = card.dataset.id;
  //console.log(idCard);
  const form = document.querySelector(".editaClientes");
  const botonEliminar = document.querySelector(`.${idCard} > button`);
  //console.log(botonEliminar);
  const comparados = compararCards(card);
  //console.log(comparados.anterior);
  //console.log(comparados.anterior.querySelector(".elCliente").textContent);
  nombreAnterior = comparados.anterior
    .querySelector(".elCliente")
    .textContent.trim();
  nombreNuevo = comparados.nueva;
  //console.log(nombreNuevo);
  if (nombreAnterior != nombreNuevo && nombreNuevo != null) {
    const conte = comparados.anterior;
    const btnconte = conte.querySelector(".btnelimina");
    if (conte.className.includes("nuevo")) {
      //btnElimina.textContent = "Guardar";
      //console.log("si");
      conte.classList.remove("nuevo");
    }
    if (btnconte.textContent == "Guardar") {
      btnconte.textContent = "Eliminar";
    }

    //conte.textContent = "Eliminar";
    // console.log(btnconte);
    // console.log(
    //   `son distintos: anterior: ${nombreAnterior} - nuevo: ${nombreNuevo}`,
    // );
  }

  seleccionarCard(card, eleEdita);
  ordenarPorFecha();
}

function procesarEventoGoogle(ev) {
  //console.log(ev);
  const descripcion = ev?.description || ev?.descripcion || "";

  const datosExtraidos = procesarDescripcionEvento(descripcion);
  //console.log(datosExtraidos);
  const fechaInicio = ev.start.dateTime || ev.start.date;
  const fechaFin = ev.end.dateTime || ev.end.date;

  return {
    id: ev?.id,
    cliente: ev?.summary || ev?.cliente || "",
    //fechaInicio: ev?.start?.date || ev?.start?.dateTime || ev?.fecha,

    //fechaFin: ev?.end?.dateTime || ev?.end?.date || ev?.fechaFin,
    fechaInicio: normalizarFecha(fechaInicio),
    fechaFin: normalizarFecha(fechaFin),

    vc: datosExtraidos?.vehiculos,
    vo: datosExtraidos?.organizadores,
    comida: datosExtraidos?.comida || false,
    precio: datosExtraidos?.precio,
    moneda: datosExtraidos?.moneda,

    sena: false,
    senaRecibida: "",
    descripcion: descripcion,
  };
}

guarda.addEventListener("click", () => {
  const lala = document.getElementById("editaPrecio").value.split(" ");
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
    precio: lala[1],
    moneda: lala[0],
    sena: document.getElementById("seña").checked,
    senaRecibida: document.getElementById("importeSeña").value,
  };
  //console.log(nuevo);
  //guardar(nuevo);
  (async () => {
    const resultado = await guardar(nuevo);

    if (resultado.ok === false) {
      console.log("Falló:", resultado.error);
    } else {
      console.log("Respuesta backend:", resultado);
      //esperarBackend(`${API}/health`);
      recargarEn5Minutos();
    }
  })();
  limpiarFormulario(eleCarga);
});

actualizar.addEventListener("click", (e) => {
  const lala = document.getElementById("editaPrecio").value.split(" ");
  nuevo = {
    id: idCard2,
    cliente: document.getElementById("editaCliente").value,
    fechaInicio: document.getElementById("editaFechaInicio").value,
    fechaFin: document.getElementById("editaFechaFin").value,
    vc: document.getElementById("editaVehiculosClientes").value,
    vo: document.getElementById("editaVehiculosOrg").value,
    comida: document.getElementById("editaComida").checked,
    precio: lala[1],
    moneda: lala[0],
    sena: document.getElementById("editaSeña").checked,
    senaRecibida: document.getElementById("editaImporteSeña").value,
  };
  if (actualizar.textContent === "guardar") {
    // console.log(idSeleccionado);
    //guardar(nuevo);
    (async () => {
      const resultado = await guardar(nuevo);

      if (resultado.ok === false) {
        console.log("Falló:", resultado.error);
      } else {
        console.log("Respuesta backend:", resultado);
        //esperarBackend(`${API}/health`);
        recargarEn5Minutos();
      }
    })();
  } else {
    //console.log(idCard2);
    if (btnEliminar.checked) {
      //console.log(elementoEliminar);
      (async () => {
        await eliminar();
        recargarEn5Minutos();
        eliminarCard(elementoEliminar);
      })();
    } else {
      //console.log(nuevo);
      //console.log(lala);
      //editar(nuevo);
      (async () => {
        const resultado = await editar(nuevo);

        if (resultado.status === "editado correctamente") {
          recargarEn5Minutos();
        }
      })();
    }
  }
  limpiarFormulario(eleEdita);
  eleEdita.style.background = "#2c2c2c";
});

// async function guardar2(contenido) {
//   try {
//     const res = await fetch(`${API}/save`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         path: "data/data.json",
//         content: contenido,
//       }),
//     });
//     const data = await res.json();
//     if (res.ok && data.status === "registro agregado") {
//       // console.log("Guardado correctamente");
//       await cargarDatosDesde(urlJSON);
//       //await cargarDatos(); // 👈 recargás la lista
//       //console.log(datos);
//     } else {
//       console.error("Error al guardar", data);
//     }
//     data.logs.forEach((l) => console.log(l));

//     alert("Guardado");
//   } catch (err) {
//     console.error(err);
//   }
// }

async function guardar(contenido) {
  try {
    const res = await fetch(`${API}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: "data/data.json",
        content: contenido,
      }),
    });

    // Intentar leer la respuesta
    let data;

    try {
      data = await res.json();
    } catch {
      throw new Error("El servidor devolvió una respuesta inválida");
    }

    // Error HTTP
    if (!res.ok) {
      throw new Error(
        data?.message || data?.error || `Error HTTP ${res.status}`,
      );
    }

    // Mostrar logs del backend
    if (Array.isArray(data.logs)) {
      data.logs.forEach((l) => console.log(l));
    }

    // Validar resultado esperado
    if (data.status !== "registro agregado") {
      throw new Error(data?.message || `Respuesta inesperada: ${data.status}`);
    }

    await cargarDatosDesde(urlJSON);

    console.log("Guardado correctamente");

    return data; // 👈 devuelve toda la respuesta del backend
  } catch (err) {
    console.error("Error al guardar:", err);

    alert(err.message || "Error desconocido");

    return {
      ok: false,
      error: err.message,
    };
  }
}

async function editar(contenido) {
  //console.log(idCard2);
  try {
    const res = await fetch(`${API}/editar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "data/data.json",
        id: idCard2,
        content: contenido,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      await cargarDatosDesde(urlJSON);
    }

    //data.logs.forEach((l) => console.log(l));

    alert("Editado");
  } catch (err) {
    console.error(err);
  }
}

async function eliminar() {
  //console.log(idCard2);
  try {
    const res = await fetch(`${API}/eliminar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: "data/data.json",
        id: idCard2,
      }),
    });

    //   const data = await res.json();

    //   if (res.ok) {
    //     elementoEliminar.remove();
    //     await cargarDatosDesde(urlJSON);
    //   }
    //   console.log("STATUS:", res.status);
    //   //console.log(data);
    // } catch (err) {
    //   console.error(err);
    // }
    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      return;
    }
    elementoEliminar.remove();

    //await esperarBackend(`${API}/health`);

    await cargarDatosDesde(urlJSON);
  } catch (err) {
    console.error(err);
  }
}

function limpiarFormulario(contenedor) {
  console.log("Limpiando formulario:", contenedor);
  if (!contenedor) return;

  const inputs = contenedor.querySelectorAll("input");

  inputs.forEach((input) => {
    if (input.type === "checkbox" || input.type === "radio") {
      input.checked = false;
    } else {
      input.value = "";
    }
  });
}

function eliminarCard(card) {
  console.log("Eliminando card:", card);
  card.remove();
}

setInterval(async () => {
  const res = await fetch(`${API}/logs`);
  const logs = await res.json();

  //console.clear();
  logs.forEach((l) => console.log(l));
}, 5000);

function compararFechas(fecha1, fecha2) {
  const f1 = new Date(fecha1);
  const f2 = new Date(fecha2);

  // limpiar horas
  f1.setHours(0, 0, 0, 0);
  f2.setHours(0, 0, 0, 0);

  // iguales
  if (f1.getTime() === f2.getTime()) {
    return 0;
  }

  // fecha1 mayor
  if (f1 > f2) {
    return 1;
  }

  // fecha1 menor
  return -1;
}
select.selectedIndex = -1;

function mostrarFechas(eventos) {
  //console.log(eventos);
  const opciones = [];
  setTimeout(() => {
    // limpiar select
    //select.innerHTML = "";

    const clientesCalendar2 = clientesCalendar
      .map((c) => ({
        cliente: c.cliente.replace("cliente:", "").trim(),

        //fecha: c.fecha.replace("start:", "").trim().toLowerCase(),
        fecha: c.fecha,
        fechaFin: c.fechaFin,

        precio: c.precio.replace("precio: ", "").trim().toLowerCase(),

        moneda: c.moneda.trim().toLowerCase(),
        id: c.id.trim().toLowerCase(),
        comida: c.comida,
        //}));
      }))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    //console.log(clientesCalendar2);

    const clientesCards3 = reservas.map((c) => ({
      cliente: c.cliente.trim(),

      fecha: c.fecha.replace("fecha:", "").trim().toLowerCase(),
      fechaFin: c.fechaFin,

      //precio: c.precio.replace(`${moneda} `, "").trim().toLowerCase(),
      precio: c.precio
        .replace(/(usd|ars)\s*/gi, "")
        .trim()
        .toLowerCase(),

      moneda: moneda.trim().toLowerCase(),
      comida: c.comida.trim().toLowerCase(),
    }));
    //console.log(clientesCards3);

    // limpiar array
    const cambios2 = [];

    clientesCalendar2.forEach((calendar, index) => {
      //console.log(calendar);
      // const reserva2 = clientesCards3.find(
      //   (card) => card.fecha === calendar.fecha,
      // );
      const reserva2 = clientesCards3.find(
        (card) =>
          card.fecha === calendar.fecha &&
          card.fechaFin === calendar.fechaFin &&
          card.cliente === calendar.cliente &&
          card.comida === calendar.comida,
      );
      //console.log(reserva2);
      // ✅ evitar duplicados
      // const yaExiste = cambios2.some(
      //   (item) =>
      //     item.fecha === calendar.fecha && item.cliente === calendar.cliente,
      // );

      // if (yaExiste) return;
      // si no existe → ignorar
      //if (!reserva2) return;
      if (!reserva2) {
        cambios2.push({
          cliente: calendar.cliente,
          fecha: calendar.fecha,
          fechaFin: calendar.fechaFin,
          id: calendar.id,
          comida: calendar.comida,
          cambios: ["no_existe"],
        });

        return;
      }

      const resultado2 = compararReservas(reserva2, calendar);
      //console.log(resultado2);

      // ✅ IMPORTANTE
      // limpiar cambios por iteración
      const cambios = [];

      Object.entries(resultado2)
        .filter(([_, igual]) => !igual)
        .forEach(([campo]) => {
          cambios.push(campo);
        });
      //console.log(cambios2);
      // si no hay cambios → salir
      if (cambios.length === 0) return;

      cambios2.push({
        cliente: calendar.cliente,
        fecha: calendar.fecha,
        fechaFin: calendar.fechaFin,
        comida: calendar.comida,
        id: calendar.id,
        cambios: cambios,
      });
    });

    // =========================
    // AGREGAR AL SELECT
    // =========================

    if (cambios2.length > 0) {
      cambios2.forEach((cambio, index) => {
        //console.log(cambio);
        //cambio.fecha = formatearFecha(cambio.fecha.trim());
        const fechaComparada = compararFechas(cambio.fecha, fechaHoy);

        // menor a hoy → ignorar
        if (fechaComparada === -1) {
          return;
        }
        idcCalendar = cambio.id;
        agregarOption(
          select,
          `${cambio.fecha} - ${cambio.cliente}`,
          index,
          idcCalendar,
        );
        //}
      });
    } else {
      // console.log("Sin cambios");
    }
    const faltantes = clientesCalendar2.filter(
      (calendar) =>
        !clientesCards3.some(
          (card) =>
            card.cliente === calendar.cliente &&
            card.fecha === calendar.fecha &&
            card.fechaFin === calendar.fechaFin,
        ),
    );
    faltantes.forEach((ev, index) => {
      clientes = ev.cliente;
    });
    const existeFaltante = clientesCalendar2.some(
      (calendar) =>
        !clientesCards3.some(
          (card) =>
            card.cliente === calendar.cliente &&
            card.fecha === calendar.fecha &&
            card.fechaFin === calendar.fechaFin,
        ),
    );

    noexiste = faltantes;
    eventos.forEach((ev, index) => {
      //console.log(ev);
      const datos = procesarEventoGoogle(ev);
      //console.log(datos);
      const cliente = datos.cliente;
      const fecha = datos.fechaInicio.toLowerCase();
      //const fecha = normalizarFecha(datos.fechaInicio.toLowerCase());
      const fecha2 = formatearFecha(datos.fechaInicio);
      //console.log(fecha);
      //console.log(fecha2);
      //console.log(fechaFormateada);
      const precio = datos.precio;
      idcCalendar = datos.id;

      // verificar si existe
      const existe = clientesCards3.some(
        (card) =>
          (card.cliente === cliente && normalizarFecha(card.fecha) === fecha) ||
          card.precio === precio,
      );
      //console.log(existe);

      // si YA existe → no agregar
      if (existe) return;
      const yaExisteOption = [...select.options].some(
        (opt) => opt.textContent === `${fecha} - ${cliente}`,
      );

      if (yaExisteOption) return;

      if (cambios2.length > 0) {
        // fechaFormateada = formatearFecha(fecha.replace("start:", "").trim());
        //console.log(fechaFormateada);
        // console.log(fecha);
        const fechaComparada = compararFechas(fecha, fechaHoy);

        // menor a hoy → ignorar
        // if (fechaComparada === -1) {
        //   return;
        // }
        //console.log(formatearFecha(fecha));

        agregarOption(
          select,
          `${fecha} - ${cliente}`,
          nuevoNumero,
          idcCalendar,
        );
      } else {
        // console.log("Sin cambios");
      }
    });
    select.onchange = () => {
      const option = select.options[select.selectedIndex];
      indiceSelect = null;
      numeroIDSelect = null;
      origen = "select";

      document.querySelectorAll("#card").forEach((card) => {
        card.classList.remove("selected");
        card.dataset.selected = "false";
      });

      const optionSeleccionado = select.options[select.selectedIndex];

      const index = select.value;

      const indexEvento = eventos.findIndex(
        (ev) => ev.id === optionSeleccionado.id,
      );

      if (existeFaltante) {
        if (index == nuevoNumero) {
          idCalendar = `card-${nuevoNumero}`;
          numero = idCalendar;
        } else {
          idCalendar = datos[index].id;
          numero = parseInt(idCalendar.match(/card-(\d+)/)[1]);
        }
      } else {
        idCalendar = datos[index].id;
        numero = parseInt(idCalendar.match(/card-(\d+)/)[1]);
      }
      //console.log(idCalendar);
      idSeleccionado = idCalendar;

      if (index === "") return;

      // evento original de Google

      const eventoSeleccionado = eventos[indexEvento];
      //console.log(eventoSeleccionado.end);

      // procesar
      const datosProcesados = procesarEventoGoogle(eventoSeleccionado);
      //console.log(datosProcesados.id);

      // normalizar
      const cliente = datosProcesados.cliente
        .replace("cliente:", "")
        .trim()
        .toLowerCase();

      const fecha = datosProcesados.fechaInicio
        .replace("start:", "")
        .trim()
        .toLowerCase();

      // buscar en reservas
      const reservaExistente = reservas.find(
        (r) =>
          r.cliente.trim().toLowerCase() === cliente &&
          normalizarFecha(
            r.fecha.replace("fecha:", "").trim().toLowerCase(),
          ) === fecha,
      );
      //console.log(reservaExistente);
      //const valorComida = String(datosProcesados.comida).trim().toLowerCase();
      const valorComida =
        datosProcesados.comida === null ||
        String(datosProcesados.comida).trim() === ""
          ? ""
          : typeof datosProcesados.comida === "boolean"
            ? datosProcesados.comida
              ? "Sí"
              : "No"
            : ["true", "Sí"].includes(String(datosProcesados.comida).trim())
              ? "Sí"
              : ["false", "No"].includes(String(datosProcesados.comida).trim())
                ? "No"
                : "";
      const valorSeña =
        datosProcesados.sena == null ||
        String(datosProcesados.sena).trim() === ""
          ? ""
          : typeof datosProcesados.sena === "boolean"
            ? datosProcesados.sena
              ? "Sí"
              : "No"
            : ["true", "Sí"].includes(String(datosProcesados.sena).trim())
              ? "Sí"
              : ["false", "No"].includes(String(datosProcesados.sena).trim())
                ? "No"
                : "";
      comidaCheck = valorComida.trim();
      //comidaCheck = !(valorComida === "no" || valorComida === "false");
      señaCheck = valorSeña.trim(); //!(valorSeña === "No" || valorSeña === "false");
      // console.log(valorComida);
      // console.log("VALOR:", datosProcesados.comida);
      // console.log("TIPO:", typeof datosProcesados.comida);

      // =========================
      // SI NO EXISTE
      // =========================

      if (!reservaExistente) {
        // console.log("NO EXISTE");
        estado = "NO EXISTE";
        idCard2 = `card-${numeroMayor}`;
        //let fechaFin;
        // if (indiceAnterior === null) {
        //   indiceAnterior = numero;
        // }
        //console.log(eventos);
        if (eventoSeleccionado?.end.date) {
          fechaFin = restarDias(
            datosProcesados?.fechaInicio,
            datosProcesados?.fechaFin,
            1,
          );
        } else {
          fechaFin = datosProcesados?.fechaFin;
        }
        //console.log(fechaFin);
        const fecha2 = formatearFecha(datosProcesados.fechaInicio);

        //datosNuevos.push(nuevo);
        // reservas.push({
        //   cliente: datosProcesados.cliente.toLowerCase().trim(),
        //   fecha: datosProcesados.fechaInicio.toLowerCase(),
        //   precio: datosProcesados.precio,
        // });

        const todos1 = lista.querySelectorAll("#card");
        const total = todos1.length;
        //console.log(total);
        //console.log(datosNuevos);
        const numeros = obtenerNumeros();
        const ultimo = lista.lastElementChild;
        const dataId2 = ultimo.dataset.id;
        //console.log(Number(dataId2.split("-")[1]) + 1);
        //console.log(obtenerNumeros(nuevoNumero));
        const numeros2 = Number(dataId2.split("-")[1]) + 1;
        //console.log(numeros[1]);
        if (total > numeros2) {
          nuevoNumero = total;
          numeroMayor = numeroMayor + 1;
        }
        nuevo = {
          id: idCard2,
          cardID: `card-${nuevoNumero}`,
          cliente: datosProcesados?.cliente,
          fechaInicio: fecha2,
          fechaFin: fechaFin,
          vc: datosProcesados?.vc,
          vo: datosProcesados?.vo,
          comida: comidaCheck,
          precio: datosProcesados?.precio,
          moneda: datosProcesados?.moneda,
          sena: señaCheck,
          senaRecibida: datosProcesados?.senaRecibida,
          descripcion: datosProcesados?.descripcion,
        };
        tarjetaAnterior = `card-${nuevoNumero}`;
        mostrarDatosGoogle(datosProcesados, nuevoNumero);
        cargarEnFormulario(datosProcesados, idCalendar, numero);
        reservas.push(
          nuevo,
          //desc: datosProcesados,
        );
        eleEdita.style.background = "#888";
        eleEdita.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // if (option) {
        //   option.remove();
        // }
        //console.log(tarjetaAnterior);

        //console.log(`nuevo: ${numeros.nuevo2} - mayor: ${numeros.mayor}`);
        tarjetaAnterior = null;
        return;
      }
      //obtenerNumeros();
      //obtenerNumeros(nuevoNumero, numeroMayor);

      indiceSelect = index;
      //}
      numeroIDSelect = `card-${indiceSelect}`;
      //console.log(numeroIDSelect);
      // } else {
      //   indiceSelect =
      // }
      const indexEvento2 = eventos.findIndex(
        (ev) => ev.id === optionSeleccionado.id,
      );

      if (indiceNuevo != indiceAnterior) {
        // console.log(numeroIDSelect);
        // buscar card
        indiceNuevo = index;
        // console.log(`indiceA: ${indiceAnterior} - indiceN: ${indiceNuevo}`);
        const card = document.querySelector(`.${numeroIDSelect}`);
        //const botonEliminar = document.querySelector(`#${idSeleccionado}`);
        // console.log(nuevoNumero);
        // resaltar
        if (card) {
          idCard = obtenerIdCardPorCliente(
            cliente,
            datosProcesados.fechaInicio,
          );
          //console.log(idCard);
          const card2 = document.querySelector(`.${idCard}`);
          compararCards(card2);
          card2.click();
          const botonEliminar = document.querySelector(`.${idCard} > button`);
          idCard2 = botonEliminar.id;
          // console.log(señaCheck);
          const fechaFin = restarDias(
            datosProcesados.fechaInicio,
            datosProcesados.fechaFin,
            1,
          );
          const fecha2 = formatearFecha(datosProcesados.fechaInicio);
          nuevo = {
            id: idCard2,
            cliente: datosProcesados.cliente,
            fechaInicio: fecha2,
            fechaFin: fechaFin,
            vc: datosProcesados.vc,
            vo: datosProcesados.vo,
            comida: comidaCheck,
            precio: datosProcesados.precio,
            moneda: datosProcesados.moneda,
            sena: señaCheck,
            senaRecibida: datosProcesados.senaRecibida,
          };

          //datosNuevos.push(nuevo);
          if (nuevo.comida == "false") {
            nuevo.comida = "No";
          }
          if (nuevo.sena == "false") {
            nuevo.sena = "No";
          }
          // console.log(nuevo.sena);

          card2.querySelector(".elCliente").textContent = nuevo.cliente;
          card2.querySelector("#fechaInicio").textContent = fecha2;
          card2.querySelector("#fechaFin").textContent = fechaFin;
          card2.querySelector("#vc").textContent = nuevo.vc;
          card2.querySelector("#vo").textContent = nuevo.vo;
          card2.querySelector("#comida").textContent = nuevo.comida;
          card2.querySelector("#precio").textContent =
            `${nuevo.moneda} ${nuevo.precio}`;
          card2.querySelector("#seña").textContent = nuevo.sena;
          card2.querySelector("#señaRecibida").textContent = nuevo.senaRecibida;
          // console.log(card);
          const form = document.querySelector("editaClientes");
          seleccionarCard(card2, eleEdita);

          botonEliminar.textContent = "Actualizar";
          actualizar.textContent = "Actualizar";

          // scroll automático
          card2.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        // if (option) {
        //   option.remove();
        // }
      } else if (indiceNuevo == indiceAnterior) {
        const card = document.querySelector(`.${numeroIDSelect}`);
        // resaltar
        if (card) {
          idCard = obtenerIdCardPorCliente(
            cliente,
            datosProcesados.fechaInicio,
          );
          //console.log(idCard);
          const card2 = document.querySelector(`.${idCard}`);
          compararCards(card2);
          card2.click();
          const botonEliminar = document.querySelector(`.${idCard} > button`);
          //console.log(botonEliminar);
          idCard2 = botonEliminar.id;
          const fechaFin = restarDias(
            datosProcesados.fechaInicio,
            datosProcesados.fechaFin,
            1,
          );
          const fecha2 = formatearFecha(datosProcesados.fechaInicio);
          nuevo = {
            id: idCard2,
            cliente: datosProcesados.cliente,
            fechaInicio: fecha2,
            fechaFin: fechaFin,
            vc: datosProcesados.vc,
            vo: datosProcesados.vo,
            comida: comidaCheck,
            precio: datosProcesados.precio,
            moneda: datosProcesados.moneda,
            sena: señaCheck,
            senaRecibida: datosProcesados.senaRecibida,
          };
          //const fechaFin = restarDias(nuevo.fechaInicio, nuevo.fechaFin, 1);
          //datosNuevos.push(nuevo);

          card2.querySelector(".elCliente").textContent = nuevo.cliente;
          card2.querySelector("#fechaInicio").textContent = fecha2;
          card2.querySelector("#fechaFin").textContent = fechaFin;
          card2.querySelector("#vc").textContent = nuevo.vc;
          card2.querySelector("#vo").textContent = nuevo.vo;
          card2.querySelector("#comida").textContent = nuevo.comida;
          card2.querySelector("#precio").textContent =
            `${nuevo.moneda} ${nuevo.precio}`;
          card2.querySelector("#seña").textContent = nuevo.sena;
          card2.querySelector("#señaRecibida").textContent = nuevo.senaRecibida;

          // console.log(card2);
          const form = document.querySelector(".editaClientes");
          seleccionarCard(card2, eleEdita);
          botonEliminar.textContent = "Actualizar";
          actualizar.textContent = "Actualizar";
          elementoEliminar = card2;

          // scroll automático
          card2.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          if (card2.dataset.selected === "true") {
            limpiarFormulario(eleEdita);
          }
        }
      }

      estado = "EXISTE";
      if (indiceAnterior === null) {
        indiceAnterior = numero;
      }
      if (indiceNuevo === null) {
        indiceNuevo = numero;
      }

      eleEdita.style.background = "#2c2c2c";

      //cargarEnFormulario(nuevo, idCalendar, indiceAnterior);
      if (elementoEliminar.dataset.selected === "true") {
        eleEdita.style.background = "#888";
        eleEdita.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        cargarEnFormulario(nuevo, idCalendar, indiceAnterior);
      } else {
        eleEdita.style.background = "#2c2c2c";
        //limpiarFormulario(eleEdita);
      }
      if (option) {
        //console.log("es aca?");
        option.remove();
      }
    };
  }, 2000);
}
// Funcion para ordenar por fecha
// function ordenarPorFecha2() {
//   const cards = Array.from(lista.children);

//   cards.sort((a, b) => {
//     const fechaA = new Date(a.querySelector("#fechaInicio").textContent);
//     const fechaB = new Date(b.querySelector("#fechaInicio").textContent);

//     return fechaA - fechaB;
//   });

//   // volver a insertar ordenados
//   cards.forEach((card) => lista.appendChild(card));
// }

// function ordenarPorFecha3() {
//   const hoy = new Date();

//   // quitar horas para comparar solo fechas
//   hoy.setHours(0, 0, 0, 0);

//   const cards = Array.from(lista.children).filter((card) => {
//     const fechaFinTexto = card.querySelector("#fechaFin").textContent;

//     const fechaFin = new Date(fechaFinTexto);

//     fechaFin.setHours(0, 0, 0, 0);

//     // ✅ mostrar solo si fechaFin es MAYOR que hoy
//     return fechaFin > hoy;
//   });

//   // ordenar por fechaInicio
//   cards.sort((a, b) => {
//     const fechaA = new Date(a.querySelector("#fechaInicio").textContent);

//     const fechaB = new Date(b.querySelector("#fechaInicio").textContent);

//     return fechaA - fechaB;
//   });

//   // limpiar lista
//   lista.innerHTML = "";

//   // volver a insertar ordenadas
//   cards.forEach((card) => {
//     lista.appendChild(card);
//   });
// }

function ordenarPorFecha() {
  const ahora = new Date();

  const cards = Array.from(lista.children).filter((card) => {
    const fechaFinTexto = card.querySelector("#fechaFin").textContent;

    // crear fecha fin
    const fechaFin = new Date(fechaFinTexto);
    //console.log(fechaFin);

    // ✅ poner hora límite
    fechaFin.setHours(23, 59, 0, 0);

    // mostrar mientras NO haya pasado
    return ahora < fechaFin;
  });

  cards.sort((a, b) => {
    const fechaA = new Date(a.querySelector("#fechaInicio").textContent);

    const fechaB = new Date(b.querySelector("#fechaInicio").textContent);

    return fechaA - fechaB;
  });

  lista.innerHTML = "";

  cards.forEach((card) => {
    lista.appendChild(card);
  });
}

function ordenarPorFecha55({
  contenedor,
  selectorCards = ".eventoCard",
  selectorFecha = "#fechaFin",
  ocultarVencidas = true,
  ordenAscendente = true,
}) {
  if (!contenedor) return;

  const ahora = new Date();

  // =========================
  // OBTENER CARDS
  // =========================

  //const cards = Array.from(contenedor.children);
  // =========================
  // SOLO CARDS
  // =========================

  const cards = Array.from(contenedor.querySelectorAll(selectorCards));

  // =========================
  // FILTRAR
  // =========================

  let filtradas = cards;

  if (ocultarVencidas) {
    filtradas = cards.filter((card) => {
      const elFecha = card.querySelector(selectorFecha);

      if (!elFecha) return false;

      const fechaTexto = elFecha.textContent.trim();

      const fecha = new Date(fechaTexto);

      fecha.setHours(23, 59, 59, 999);

      return ahora <= fecha;
    });
  }

  // =========================
  // ORDENAR
  // =========================

  filtradas.sort((a, b) => {
    const fechaA = new Date(a.querySelector(selectorFecha).textContent.trim());

    const fechaB = new Date(b.querySelector(selectorFecha).textContent.trim());

    return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
  });

  // =========================
  // LIMPIAR CONTENEDOR
  // =========================
  cards.forEach((card) => card.remove());

  //contenedor.innerHTML = "";

  // =========================
  // REINSERTAR
  // =========================

  filtradas.forEach((card) => {
    contenedor.appendChild(card);
  });
}

// Funcion para comparar reservas con calendario
function compararReservas(reserva, calendar) {
  //console.log(reserva);
  //console.log(calendar);
  if (!reserva) return;
  const normalizarTexto = (texto) =>
    String(texto || "")
      .trim()
      .toLowerCase();

  const normalizarFecha = (fecha) =>
    String(fecha || "")
      .trim()
      .toLowerCase();

  const normalizarNumero = (numero) => Number(numero || 0);

  const normalizarBoolean = (valor) => Boolean(valor);

  return {
    id: calendar.id,
    cliente:
      normalizarTexto(reserva.cliente) === normalizarTexto(calendar.cliente),

    fechaInicio:
      normalizarFecha(reserva.fechaInicio) ===
      normalizarFecha(calendar.fechaInicio),

    fechaFin:
      normalizarFecha(reserva.fechaFin) === normalizarFecha(calendar.fechaFin),

    precio:
      normalizarNumero(reserva?.precio) === normalizarNumero(calendar?.precio),

    comida:
      normalizarBoolean(reserva.comida) === normalizarBoolean(calendar?.comida),

    reservas:
      normalizarNumero(reserva.reservas) ===
      normalizarNumero(calendar?.reservas),
  };
}

// Funcion para agregar items al select
function agregarOption(select, texto, valor, idc, options = {}) {
  //console.log(valor);
  // agregar placeholder solo una vez
  if (!select.dataset.placeholderAgregado) {
    const placeholder = document.createElement("option");

    placeholder.textContent = "Seleccione una fecha:";
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;

    select.prepend(placeholder);

    select.dataset.placeholderAgregado = "true";
  }
  const option = document.createElement("option");

  option.textContent = texto;
  option.value = valor;
  option.id = idc;

  // opcionales
  if (options.disabled) {
    option.disabled = true;
  }

  if (options.selected) {
    option.selected = true;
  }

  if (options.className) {
    option.className = options.className;
  }

  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      option.dataset[key] = value;
    });
  }

  select.appendChild(option);

  return option;
}

// Funcion para seleccionar una card y resaltarla
function seleccionarCard(card, formulario) {
  if (!card) return;

  // si ya estaba seleccionada → deseleccionar
  if (card.dataset.selected === "true") {
    limpiarFormulario(eleEdita);
    card.dataset.selected = "false";
    card.classList.remove("selected");
    //console.log(eleEdita);

    document.querySelector(`.clienteSel`).textContent =
      `Editar Cliente Seleccionado:`;
    return;
  }

  // quitar selección anterior
  document.querySelectorAll("#card.selected").forEach((c) => {
    c.dataset.selected = "false";
    c.classList.remove("selected");
  });

  // seleccionar nueva
  card.dataset.selected = "true";
  card.classList.add("selected");
}
// Funcion para obtener el ID de cada card
function obtenerIdCardPorCliente(cliente, fechaBuscada) {
  const cards = document.querySelectorAll("#card");

  for (const card of cards) {
    const nombre = card
      .querySelector(".elCliente")
      .textContent.trim()
      .toLowerCase();
    const fecha = card
      .querySelector("#fechaInicio")
      .textContent.trim()
      .toLowerCase();

    if (
      nombre === cliente.trim().toLowerCase() &&
      fecha === fechaBuscada.trim().toLowerCase()
    ) {
      return card.dataset.id;
    }
  }

  return null;
}

// Funcion para obtener el ultimo id de la card, y el ultimo id del boton eliminar
function obtenerNumeros() {
  const ultimo = lista.lastElementChild;
  const ultimo2 = lista2.lastElementChild;
  dataId = ultimo.dataset.id;
  //const dataId2 = ultimo2.dataset.id;
  let nuevoNumero2 = 0;
  // 🔹 Obtener número de lista principal
  if (ultimo?.dataset?.id) {
    nuevoNumero = Number(ultimo.dataset.id.split("-")[1]) + 1;
  }
  // 🔹 Validar lista2
  if (ultimo2?.dataset?.id) {
    nuevoNumero2 = Number(ultimo2.dataset.id.split("-")[1]) + 1;

    // usar el mayor entre ambos
    //if (nuevoNumero2 > nuevoNumero) {
    nuevoNumero = nuevoNumero + nuevoNumero2;
    //}
  }

  document.querySelectorAll("#card").forEach((card) => {
    const botonEliminar = card.querySelector("button");

    if (!botonEliminar?.id) return;

    const match = botonEliminar.id.match(/card-(\d+)/);

    if (!match) return;

    const numero = parseInt(match[1]);
    //console.log(numero);

    if (numero > numeroMayor) {
      numeroMayor = numero;
    }
  });
  //numeroInicial = numeroMayor + 1;
  //nuevoNumero = Number(dataId.split("-")[1]) + 1;
  //const nuevoNumero2 = Number(dataId2.split("-")[1]) + 1;
  //console.log(numeroInicial);

  if (numeroMayor != numeroInicial) {
    numeroMayor = numeroMayor + 1;
  }
  //console.log(numeroMayor);
  //console.log(`nuevo: ${nuevoNumero} - mayor: ${numeroMayor}`);
  //return [nuevoNumero, numeroMayor];
  return {
    nuevo2: nuevoNumero,
    mayor: numeroMayor,
  };
}

let a = "";
let b = "";
let scrolll = "";
const inicios = 85;
const target = 20;
let final = "";
//const TargetHeight = document.documentElement.offsetHeight - screen.height;
const TargetHeight = document.documentElement.offsetHeight - window.innerHeight;
// Funcion para crear boton de top
function creaTop() {
  var destino = document.querySelector("body");
  if (destino == undefined) alert("No existe el bloque destino");
  else {
    var nodoTop = document.createElement("div");
    nodoTop.className = "top";
    destino.appendChild(nodoTop);
    var nodo1 = document.querySelector(".top");
    var nodoButton = document.createElement("button");
    nodoButton.id = "myBtn";
    nodoButton.addEventListener("click", topFunction);
    nodo1.appendChild(nodoButton);
  }
}

function scrollFunction() {
  const mybutton = document.getElementById("myBtn");
  const topp = document.querySelector(".top");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrolll = window.scrollY;
    mybutton.style.display = "block";
    if (isBottomOfPage()) {
      topp.style.bottom = 85 + "px";
    } else if (
      scrolll <=
      Math.max(document.documentElement.scrollHeight) - window.innerHeight
    ) {
      final = inicios - (TargetHeight - scrolll);
      if (final > target && final <= inicios) {
        topp.style.bottom = Math.max(target, final) + "px";
      } else {
        topp.style.bottom = 20 + "px";
      }
    }
  } else {
    mybutton.style.display = "none";
  }
}
// Funcion para determinar cuando llegamos al final de la pagina
function isBottomOfPage() {
  //return window.scrollY + window.innerHeight >= Math.round(document.documentElement.scrollHeight);
  return (
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight
  );
}

function topFunction() {
  if ("scrollTo" in window) {
    // Verifica si el navegador soporta scrollTo
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    // Fallback para navegadores más antiguos
    let currentScroll =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
      window.requestAnimationFrame(topFunction);
      window.scrollTo(0, currentScroll - currentScroll / 8); // Efecto suave manual
    }
  }
}

function compararCards(cardActual) {
  const clienteNuevo = cardActual.querySelector(".elCliente").textContent;

  //console.log(clienteNuevo.trim());

  if (cardAnterior) {
    const clienteAnterior =
      cardAnterior.querySelector(".elCliente").textContent;

    //console.log("Anterior:", clienteAnterior.trim());
    //console.log("Nuevo:", clienteNuevo.trim());
    //cardNueva = clienteNuevo.trim();
    cardNueva = clienteNuevo.trim();
    if (clienteAnterior.trim() !== clienteNuevo.trim()) {
      //cardAnterior = clienteAnterior.trim();

      console.log("Cambió de cliente");
      return { anterior: cardAnterior, nueva: cardNueva };
    }
  } else {
    cardNueva = null;
  }

  //cardAnterior = cardActual.querySelector(".elCliente").textContent;
  cardAnterior = cardActual;
  return { anterior: cardAnterior, nueva: cardNueva };
}

//cargarDatos();
//cargarDatosDesde("data/data.json");

function renderizarCards({
  datos = [],
  contenedor,
  transformar = null,
  onClick = null,
  clickable = false,
  revisa = false,
  origen = null,
}) {
  //console.log(datos);
  if (!contenedor) return;

  //contenedor.innerHTML = "";

  datos.forEach((item, index) => {
    //console.log(item);
    // =========================
    // TRANSFORMAR ITEM
    // =========================

    const data = transformar ? transformar(item, index) : item;
    //console.log(data);

    // =========================
    // DEFAULTS
    // =========================

    const NoDisponible = "No Disponible";

    const titulo = data.titulo || "Sin título";

    const fechaInicio = data.fechaInicio || "Sin fecha";

    const fechaFin = data.fechaFin || "Sin fecha";

    const descripcion = data.descripcion || "";

    const vehiculosClientes = data.vehiculosClientes ?? NoDisponible;

    const vehiculosOrganizadores = data.vehiculosOrganizadores ?? NoDisponible;

    const comida = data.comida ?? NoDisponible;

    const precio = data.precio ?? NoDisponible;

    moneda = data.moneda ?? "";
    let elPre;
    if (origen === "reservas") {
      if (precio.includes("ARS") || precio.includes("USD")) {
        elPre = precio;
      } else {
        moneda = "USD";
        elPre = `${moneda} ${precio}`;
      }
    } else if (origen === "calendario") {
      elPre = `${moneda} ${precio}`;
    }
    nuevo = {
      cliente: titulo,
      fechaInicio: fechaInicio,
      fechaFin: data.fechaFin,
      vc: data.vehiculosClientes,
      vo: data.vehiculosOrganizadores,
      comida: data.comida,
      precio: data.precio,
      moneda: data.moneda,
      sena: document.getElementById("editaSeña").checked,
      senaRecibida: document.getElementById("editaImporteSeña").value,
    };

    // =========================
    // CARD
    // =========================

    //const cardContainer = document.createElement("div");
    const card = document.createElement("div");

    card.className = "eventoCard";

    card.innerHTML = `
    
      <div class="eventoTitulo">
        <h2 class="elCliente">
          ${titulo}
        </h2>
      </div>

      <span class="datosTitulos">
        <strong>Fecha Inicio:</strong>

        <span class="datosVisibles">
          ${formatearFecha(fechaInicio)}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Fecha Fin:</strong>

        <span class="datosVisibles" id="fechaFin">
          ${formatearFecha(fechaFin)}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Vehiculos Organizadores:</strong>

        <span class="datosVisibles">
          ${vehiculosOrganizadores}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Vehiculos Clientes:</strong>

        <span class="datosVisibles">
          ${vehiculosClientes}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Precio Acordado:</strong>

        <span class="datosVisibles">
          ${elPre}
        </span>
      </span>

      <span class="datosTitulos">
        <strong>Incluye Comida:</strong>

        <span class="datosVisibles">
          ${comida}
        </span>
      </span>

      <div class="eventoDescripcion">
        <label>Descripción:</label>

        ${descripcion}
      </div>

    `;

    // =========================
    // AUTO REDUCIR H2
    // =========================

    const h2 = card.querySelector(".elCliente");

    const palabras = h2.textContent.trim().split(/\s+/);

    if (palabras.length > 3) {
      h2.style.fontSize = "18px";
    }

    // =========================
    // CLICK
    // =========================
    // const elti = document.querySelector(".cardContainerReservas");
    // console.log(elti);
    // if (elti.textContent === "Eventos desde Calendario") {
    //   console.log(card);
    // }
    if (revisa) {
      const datosProcesados = procesarEventoGoogle(item);
      //console.log(datosProcesados);
    }
    if (clickable) {
      card.classList.add("sinHover");
      card.addEventListener("click", () => {
        //console.log(item.cardID);
        const cardOriginal = document.querySelector(`.${item.cardID}`);

        if (!cardOriginal) return;
        // remover resaltado anterior
        // document.querySelectorAll(".selected").forEach((el) => {
        //   el.classList.remove("selected");
        // });

        // // resaltar
        // cardOriginal.classList.add("selected");

        // // scroll automático
        // cardOriginal.scrollIntoView({
        //   behavior: "smooth",
        //   block: "center",
        // });
        seleccionarCard(cardOriginal, eleEdita);
        cardOriginal.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        if (cardOriginal.dataset.selected === "true") {
          eleEdita.style.background = "#888";
          // eleEdita.scrollIntoView({
          //   behavior: "smooth",
          //   block: "center",
          // });
        } else {
          eleEdita.style.background = "#2c2c2c";
        }
        //   const indexEvento = item.findIndex(
        //   (ev) => ev.id === optionSeleccionado.id,
        // );
        const datosProcesados = procesarEventoGoogle(item);
        const valorComida =
          datosProcesados.comida === null ||
          String(datosProcesados.comida).trim() === ""
            ? ""
            : typeof datosProcesados.comida === "boolean"
              ? datosProcesados.comida
                ? "Sí"
                : "No"
              : ["true", "Sí"].includes(String(datosProcesados.comida).trim())
                ? "Sí"
                : ["false", "No"].includes(
                      String(datosProcesados.comida).trim(),
                    )
                  ? "No"
                  : "";
        const valorSeña =
          datosProcesados.sena == null ||
          String(datosProcesados.sena).trim() === ""
            ? ""
            : typeof datosProcesados.sena === "boolean"
              ? datosProcesados.sena
                ? "Sí"
                : "No"
              : ["true", "Sí"].includes(String(datosProcesados.sena).trim())
                ? "Sí"
                : ["false", "No"].includes(String(datosProcesados.sena).trim())
                  ? "No"
                  : "";
        comidaCheck = valorComida.trim();
        //comidaCheck = !(valorComida === "no" || valorComida === "false");
        señaCheck = valorSeña.trim(); //!(valorSeña === "No" || valorSeña === "false");
        //console.log(datosProcesados.cliente);
        cargarEnFormulario(datosProcesados, index, indiceAnterior);
        //console.log("Item seleccionado:", item);
        cerrarModalEventos();

        if (onClick) {
          onClick(item, index, card);
        }
      });
    } else {
      card.classList.remove("sinHover");
      card.style.cursor = "not-allowed";
    }
    //contenedor.appendChild(cardContainer);
    contenedor.appendChild(card);
  });
}

function cerrarModalEventos() {
  const overlay = document.querySelector("#modalEventosOverlay");
  overlay.style.display = "none";
}

(function () {
  const titulosClientesModal = document.querySelector(
    "#listaEventosModal > div h2",
  );
  setTimeout(() => {
    // =========================
    // CONFIG
    // =========================

    // Combinación:
    // CTRL + SHIFT + E
    const HOTKEY = {
      ctrl: false,
      shift: true,
      key: "L",
    };

    // Array global con eventos
    // Debe existir en tu página
    // Ej:
    // window.eventosCalendario = [...]
    window.eventosCalendario = eventosCalen[0].items;
    //console.log(eventosCalen[0]);
    const EVENTOS = window.eventosCalendario || [];

    // =========================
    // ESTILOS
    // =========================

    const style = document.createElement("style");

    document.head.appendChild(style);

    // =========================
    // MODAL
    // =========================

    const overlay = document.createElement("div");

    overlay.id = "modalEventosOverlay";

    overlay.innerHTML = `
  
    <div id="modalEventos">

      <button id="cerrarModalEventos">
        Cerrar
      </button>

      <h2 class="tituloModal">
        Eventos del Calendario
      </h2>

      <div id="listaEventosModal"></div>

    </div>

  `;

    document.body.appendChild(overlay);
    const btnCerrarModal = document.querySelector("#cerrarModalEventos");

    // =========================
    // FUNCIONES
    // =========================

    function abrirModalEventos() {
      let vehiculosClientes;
      let vehiculosOrganizadores;
      let comida;
      let moneda;
      let precio;

      const lista = document.querySelector("#listaEventosModal");

      lista.innerHTML = "";

      if (!EVENTOS.length) {
        lista.innerHTML = `
        <p>No hay eventos cargados.</p>
      `;
      } else {
        //console.log(reservas);
        let contenedorCards;
        let tituloContenedorCards;
        if (EVENTOS) {
          contenedorCards = document.createElement("div");
          contenedorCards.className = "cardContainerEventos";
          tituloContenedorCards = document.createElement("h2");
          tituloContenedorCards.className = "tituloEventos";
          tituloContenedorCards.textContent = "Eventos desde Calendario";
          contenedorCards.appendChild(tituloContenedorCards);

          //lista.appendChild(cardContainer);
        }
        lista.appendChild(contenedorCards);

        renderizarCards({
          datos: EVENTOS,

          contenedor: contenedorCards,
          clickable: false,
          revisa: true,
          origen: "calendario",

          transformar: (ev) => {
            const descrip = procesarDescripcionEvento(ev?.description);
            if (ev?.start.date) {
              //console.log("Evento de día completo");
              //console.log(ev?.start.date);
              fechaFin = restarDias(ev?.start?.date, ev?.end?.date, 1);
            } else {
              //console.log("Evento con hora específica");
              //console.log(ev?.start.dateTime);
              fechaFin = ev?.end?.dateTime;
            }

            //console.log(fechaFin);

            return {
              titulo: ev?.summary,

              fechaInicio: ev?.start?.dateTime || ev?.start?.date,

              //fechaFin: ev?.end?.dateTime || ev?.end?.date,
              fechaFin: fechaFin,

              descripcion: ev?.description,

              vehiculosClientes: descrip?.vehiculos,

              vehiculosOrganizadores: descrip?.organizadores,

              comida: descrip?.comida,

              precio: descrip?.precio,

              moneda: descrip?.moneda,
            };
          },

          onClick: (ev) => {
            console.log(ev);
          },
        });
        ordenarPorFecha55({
          contenedor: contenedorCards,
        });
        if (reservas) {
          contenedorCards = document.createElement("div");
          contenedorCards.className = "cardContainerReservas";
          tituloContenedorCards = document.createElement("h2");
          tituloContenedorCards.className = "tituloReservas";
          tituloContenedorCards.textContent = "Eventos desde Reservas";
          contenedorCards.appendChild(tituloContenedorCards);
          //lista.appendChild(cardContainer);
          nuevo = null;
        }
        lista.appendChild(contenedorCards);
        renderizarCards({
          datos: reservas,

          contenedor: contenedorCards,
          clickable: true,
          revisa: false,
          origen: "reservas",

          transformar: (d) => ({
            titulo: d.cliente,

            fechaInicio: d.fecha,

            fechaFin: d.fechaFin,

            descripcion: d.descripcion,

            vehiculosClientes: d.vc,

            vehiculosOrganizadores: d.vo,

            comida: d.comida,

            precio: d.precio,

            moneda: d.moneda,
          }),
        });
        ordenarPorFecha55({
          contenedor: contenedorCards,
        });
      }

      overlay.style.display = "flex";
      document.querySelectorAll("#listaEventosModal > div h2").forEach((h2) => {
        const palabras = h2.textContent.trim().split(/\s+/);

        if (palabras.length > 3) {
          h2.style.fontSize = "1.4em";
        }
      });
    }

    function cerrarModalEventos() {
      overlay.style.display = "none";
    }

    // =========================
    // EVENTOS
    // =========================

    document
      .querySelector("#cerrarModalEventos")
      .addEventListener("click", cerrarModalEventos);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        cerrarModalEventos();
      }
    });

    if (plataforma.includes("Android")) {
      btnCerrarModal.textContent = "X";
      btnModal.style.display = "block";
      btnModal.addEventListener("click", () => {
        abrirModalEventos();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();

        abrirModalEventos();
      }
    });

    //console.log("Modal de eventos cargado. CTRL + SHIFT + E");
  }, 2000);
})();

// document.addEventListener("keydown", (e) => {
//   if (e.shiftKey && e.key.toLowerCase() === "j") {
//     e.preventDefault();

//     abrirModalEventos();
//   }
// });

function normalizarFecha(fecha) {
  if (!fecha) return "";

  // si viene con T (datetime)
  if (fecha.includes("T")) {
    return fecha.split("T")[0];
  }
  //console.log(fecha.trim());
  return fecha.trim();
}

// const modalJson = document.getElementById("modalJson");

// function abrirModalEventos() {
//   modalJson.classList.remove("hidden");
// }

// function cerrarModalEventos() {
//   modalJson.classList.add("hidden");
// }

// document
//   .getElementById("cerrarModalJson")
//   .addEventListener("click", cerrarModalEventos);

// // cerrar tocando afuera
// modalJson.addEventListener("click", (e) => {
//   if (e.target === modalJson) {
//     cerrarModalEventos();
//   }
// });

// // SHIFT + J
// document.addEventListener("keydown", (e) => {
//   if (e.shiftKey && e.key.toLowerCase() === "j") {
//     e.preventDefault();

//     abrirModalEventos();
//   }
// });

// // botones
// document.querySelectorAll(".btnJson").forEach((btn) => {
//   btn.addEventListener("click", async () => {
//     const tipo = btn.dataset.tipo;

//     try {
//       if (tipo === "local") {
//         console.log("Cargando LOCAL");

//         await cargarDatosDesde("data/data.json");
//       }

//       if (tipo === "github") {
//         console.log("Cargando GITHUB");

//         await cargarDatosDesde(
//           "https://raw.githubusercontent.com/TaylorBundy/Calendario_4x4/main/data/data.json",
//         );
//       }

//       cerrarModalEventos();
//     } catch (error) {
//       console.error(error);
//     }
//   });
// });

// async function cargarDatosDesde(url) {
//   const res = await fetch(url);

//   if (!res.ok) {
//     throw new Error("No se pudo cargar el JSON");
//   }

//   datos = await res.json();

//   const total = contarRegistrosVisibles(datos);

//   totalReservas.innerHTML = `
//     <span class="reservasTitulos">
//       <strong>Total de reservas:</strong>
//       <span class="reservasVisibles">${total}</span>
//     </span>
//   `;

//   mostrarDatos();
//   mostrarDatos2(lista2, true);
// }

function crearModalJSON() {
  // evitar duplicados
  if (document.getElementById("modalJson")) return;

  const modal = document.createElement("div");

  modal.id = "modalJson";

  modal.innerHTML = `
    <div class="modalContenido">

      <div class="modalHeader">
        <h2>Cargar JSON</h2>

        <button id="cerrarModalJson">✕</button>
      </div>

      <div class="modalBody">

        <button class="btnJson" data-tipo="local">
          📁 Cargar JSON Local
        </button>

        <button class="btnJson" data-tipo="github">
          🌐 Cargar JSON GitHub
        </button>

      </div>

    </div>
  `;

  // estilos inline
  Object.assign(modal.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0,0,0,.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "999999",
    backdropFilter: "blur(5px)",
  });

  const contenido = modal.querySelector(".modalContenido");

  Object.assign(contenido.style, {
    width: "400px",
    background: "#1e1e1e",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 0 30px rgba(0,0,0,.5)",
    color: "white",
    animation: "aparecer .18s ease",
  });

  const header = modal.querySelector(".modalHeader");

  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  });

  const body = modal.querySelector(".modalBody");

  Object.assign(body.style, {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  });

  modal.querySelectorAll(".btnJson").forEach((btn) => {
    Object.assign(btn.style, {
      padding: "14px",
      border: "none",
      borderRadius: "10px",
      background: "#2c2c2c",
      color: "white",
      cursor: "pointer",
      fontSize: "15px",
      transition: ".2s",
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.background = "#3a3a3a";
      btn.style.transform = "scale(1.02)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.background = "#2c2c2c";
      btn.style.transform = "scale(1)";
    });
  });

  // cerrar
  modal.querySelector("#cerrarModalJson").addEventListener("click", () => {
    modal.remove();
  });

  // click afuera
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // botones
  modal.querySelectorAll(".btnJson").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const tipo = btn.dataset.tipo;

      try {
        reservas.length = 0;
        select.innerHTML = "";
        delete select.dataset.placeholderAgregado;
        if (tipo === "local") {
          await cargarDatosDesde("data/data.json");
          await cargarEventosGoogle(url);
        }

        if (tipo === "github") {
          await cargarDatosDesde(
            "https://raw.githubusercontent.com/TaylorBundy/Calendario_4x4/main/data/data.json",
          );
          await cargarEventosGoogle(url);
        }
        modal.remove();
      } catch (error) {
        console.error(error);
      }
    });
  });

  document.body.appendChild(modal);
}

document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "j") {
    e.preventDefault();

    if (!domain.includes("github.io")) {
      //urlJSON = "data/data.json";
      crearModalJSON();
    } else {
      (async () => {
        await cargarEventosGoogle(url);
      })();
      return;
    }
    //crearModalJSON();
  }
});

async function cargarDatosDesde(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("No se pudo cargar el JSON");
  }

  datos = await res.json();
  //console.log(datos);
  reservas.push(...datos);

  const total = contarRegistrosVisibles(datos);

  totalReservas.innerHTML = `
    <span class="reservasTitulos">
      <strong>Total de reservas:</strong>
      <span class="reservasVisibles">${total}</span>
    </span>
  `;

  mostrarDatos();
  mostrarDatos2(lista2, true);
  reconstruirReservasDesdeDOM();
  //reservas.push(datos);
}

// function esperarBackend(url) {
//   const intervalo = setInterval(async () => {
//     try {
//       const res = await fetch(url);

//       if (res.ok) {
//         clearInterval(intervalo);

//         console.log("Backend online");

//         location.reload();
//       }
//     } catch (err) {
//       console.log("Backend todavía iniciando...");
//     }
//   }, 5000);
// }

// function recargarEn5Minutos() {
//   clearTimeout(timerRecarga);

//   timerRecarga = setTimeout(
//     () => {
//       location.reload();
//     },
//     5 * 60 * 1000,
//   );
// }
function recargarEn5Minutos() {
  clearTimeout(timerRecarga);

  console.log("Recarga programada para dentro de 2 minutos");

  timerRecarga = setTimeout(
    () => {
      console.log("Recargando...");
      //location.reload();
      cargarDatosDesde(urlJSON);
      (async () => {
        await cargarEventosGoogle(url);
      })();
    },
    2 * 60 * 1000,
  );
}
