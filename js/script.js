const form = document.getElementById("formulario");
const lista = document.getElementById("lista");
const lista2 = document.getElementById("lista2");
const elementos = lista.children;
const cards = Array.from(lista.children);
const totalReservas = document.querySelector(".totalReservas");
const guarda = document.querySelector(".guardar");
const actualizar = document.querySelector(".actualizar");
//const probar = document.querySelector(".probar");
const botones = document.querySelectorAll("button");
const btnEliminar = document.querySelector("#editaElimina");
const eleEdita = document.querySelector(".editaClientes");
const eleCarga = document.querySelector(".cargaClientes");
const recargar = document.querySelector(".recargar");
const select = document.getElementById("fechas");
const API = "https://calendario-4x4.onrender.com";
const plataforma = navigator.userAgent;

let datos = [];
let clientes = null;
let fechasInicio = null;
//const cambios2 = [];
const clientesCalendar = [];
const reservas = [];
const modificados = [];
let nuevo;
const datosNuevos = [];
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
  if (/\b(true|s[ií])\b|incluye\s*comida|con\s*comida/i.test(texto)) {
    resultado.comida = "Sí";
  } else if (/\b(false|no)\b|no\s*incluye\s*comida/i.test(texto)) {
    resultado.comida = "No";
  }
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
// visibles.forEach((item) => {
//   mostrarDatos2(lista2, true);
// });

// mostrarDatos2(lista2, true);
// Funcion para restar 1 dia a la fecha obtenida del calendario
// function restarDias2(fecha, dias) {
//   const nuevaFecha = new Date(fecha);

//   nuevaFecha.setDate(nuevaFecha.getDate() - dias);

//   return nuevaFecha.toISOString().split("T")[0];
// }

function restarDias(fechaInicio, fechaFin, dias) {
  // Si son iguales, devolver la misma fecha
  if (fechaInicio === fechaFin) {
    return fechaFin;
  }

  const nuevaFecha = new Date(fechaFin);

  nuevaFecha.setDate(nuevaFecha.getDate() - dias);

  return nuevaFecha.toISOString().split("T")[0];
}

// function formatearFecha2(fecha) {
//   const f = new Date(fecha);

//   // validar fecha inválida
//   if (isNaN(f.getTime())) {
//     return null;
//   }

//   const year = f.getFullYear();

//   const month = String(f.getMonth() + 1).padStart(2, "0");

//   const day = String(f.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

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

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    //console.log(data);
    const items = data.items;
    items.forEach((ev) => {
      const fechaIn = ev?.start.date || ev?.start.dateTime;
      const fechaFn = ev?.end.date;
      const nomCli = ev?.summary;
      const descrip = procesarDescripcionEvento(ev?.description) || null;
      const cliente = `cliente: ${nomCli}`;
      const fechaInicio = `start: ${fechaIn}`;
      //console.log(fechaInicio);
      //console.log(formatearFecha(fechaInicio.replace("start:", "").trim()));
      if (ev?.start.date) {
        //console.log(fechaInicio.replace("start:", "").trim());
        fechaFormateada = fechaInicio.replace("start:", "").trim();
        //console.log(fechaFormateada);
        return;
      } else {
        fechaFormateada = formatearFecha(
          fechaInicio.replace("start:", "").trim(),
        );
        //console.log(fechaFormateada);
        //console.log(ev?.start.dateTime);
        //const fechaaaa = ev.start.dateTime;
        //console.log(fechaaaa.getFullYear());

        // const fechaFormateada =
        //   fechaaaa.getFullYear() +
        //   "-" +
        //   String(fechaaaa.getMonth() + 1).padStart(2, "0") +
        //   "-" +
        //   String(fechaaaa.getDate()).padStart(2, "0");
        // console.log(fechaFormateada);
      }

      //const fechaInicio: ev.start.dateTime || ev.start.date,
      const fechaFin = `end: ${fechaFn}`;
      const vehiculosClientes = `vehiculos: ${descrip?.vehiculos}` || null;
      const vehiculosOrganizadores = `vehiculos organizadores: ${descrip?.organizadores}`;
      const comida = `comida: ${descrip?.comida}`;
      const moneda = `moneda: ${descrip?.moneda}`;
      const precio = `precio: ${descrip?.precio}`;
      const id = ev?.id;
      idCalendar = ev?.id;
      // const resultado = restarDias(
      //   fechaInicio,
      //   fechaFin.replace("end: ", ""),
      //   1,
      // );
      clientesCalendar.push({
        id: id.toLowerCase().trim(),
        cliente: cliente.toLowerCase().trim(),
        //fecha: fechaInicio.toLowerCase().trim(),
        fecha: fechaFormateada,
        precio: precio.replace("precio: ", "").toLowerCase().trim(),
        moneda: moneda.replace("moneda: ", "").toLowerCase().trim(),
      });
      //console.log(clientesCalendar);
      clientes = nomCli.toLowerCase();
      fechasInicio = fechaInicio.toLowerCase();
    });
    mostrarFechas(data.items);
  });

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // console.log(visibles);
    // console.log(ocultas);
    lista.querySelectorAll(".divcontainer").forEach((card) => {
      //console.log(card.querySelector("h2"));
      reservas.push({
        cliente: card.querySelector("h2")?.textContent.toLowerCase().trim(),
        fecha: card.querySelector("#fechaInicio")?.textContent.toLowerCase(),
        precio: card
          .querySelector("#precio")
          ?.textContent.replace(`${moneda} `, "")
          .toLowerCase(),
      });
    });
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
    const numeros = obtenerNumeros();
    numeroInicial = numeros.mayor;
    //console.log(reservas);
    muestraBoton();
  }, 2000);

  recargar.addEventListener("click", () => {
    cargarDatos();
    //console.log(datos);
  });
  // probar.addEventListener("click", () => {
  //   console.log(idCard2);
  //   console.log(`nuevo: ${nuevoNumero} - mayor: ${numeroMayor}`);
  //   lista.querySelectorAll("#card").forEach((card) => {
  //     //console.log(card.querySelector("h2"));
  //     console.log(card.dataset.id);
  //   });
  // });
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
// function contarRegistros(array) {
//   if (!Array.isArray(array)) return 0;
//   return array.length;
// }

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

// Cargar datos
async function cargarDatos() {
  const res = await fetch("data/data.json");
  datos = await res.json();
  //const total = contarRegistros(datos);
  const total = contarRegistrosVisibles(datos);
  //totalReservas.textContent = `Total de reservas: ${total}`;
  totalReservas.innerHTML = `
    <span class="reservasTitulos"><strong>Total de reservas:</strong> <span class="reservasVisibles">${total}</span></span>
    `;
  mostrarDatos();
}

function cargarEnFormulario(dato, index, indiceAnteriors) {
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
  document.getElementById("editaFechaInicio").value = dato.fechaInicio;
  const fechaFin = restarDias(
    dato.fechaInicio,
    dato.fechaFin.replace("end: ", ""),
    1,
  );
  document.getElementById("editaFechaFin").value = fechaFin;
  document.getElementById("editaVehiculosClientes").value = dato?.vc || "";
  document.getElementById("editaVehiculosOrg").value = dato?.vo || "";
  document.getElementById("editaComida").checked = comidaCheck;
  document.getElementById("editaPrecio").value = dato?.precio || "0";
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
  //console.log(indiceNuevo);
  //const prueba = document.querySelector(`.card-${index}`);
  //console.log(prueba);
  //const prueba2 = document.querySelector(`.${idCalendar}`);
  //console.log(prueba2);
  // if (prueba != prueba2) {
  //   console.log("son diferentes");
  // } else {
  //   console.log("son iguales");
  // }
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
    // document.querySelectorAll("#card").forEach((card) => {
    //   console.log(card);
    //   //card.classList.remove("selected");
    //   // if (card.className.includes("nuevo")) {
    //   //   actualizar.textContent = "guardar";
    //   // }
    // });
    // const cards = document.querySelectorAll("#card");

    // cards.forEach((card) => {
    //   //card.addEventListener("click", () => {
    //   console.log("hola");
    //   // si ya estaba seleccionada → deseleccionar
    //   if (card.dataset.selected === "true") {
    //     card.dataset.selected = "false";
    //     card.classList.remove("selected");
    //     return;
    //   }

    //   // quitar selección anterior
    //   document.querySelectorAll(`div[id="card"]`).forEach((c) => {
    //     console.log(c);
    //     c.dataset.selected = "false";
    //     c.classList.remove("selected");
    //   });

    //   // seleccionar nueva
    //   card.dataset.selected = "true";
    //   card.classList.add("selected");
    //   //});
    // });
  }
  // if (estado === "EXISTE") {
  //   elementoSelected = document.querySelector(`.${idCalendar}`);
  // } else {
  //   elementoSelected = document.querySelector(`.${idCalendar}`);
  // }
  //const elementoSelected = document.querySelector(`.${idCalendar}`);
  // console.log(elementoSelected);
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
    // if (elementoSelected1.dataset.selected == "true") {
    //   if (elementoSelected1.className.includes("selected")) {
    //     elementoSelected1.classList.remove("selected");
    //     elementoSelected1.dataset.selected = "false";
    //   } else {
    //     elementoSelected1.classList.add("selected");
    //   }
    // }
    // if (elementoSelected.dataset.selected == "true") {
    //   if (elementoSelected.className.includes("selected")) {
    //     elementoSelected.classList.remove("selected");
    //     elementoSelected.dataset.selected = "false";
    //   } else {
    //     elementoSelected.classList.add("selected");
    //   }
    // }

    // if (elementoSelected.className.includes("selected")) {
    //   if (!elementoSelected.dataset.selected) {
    //     // console.log(elementoSelected.dataset);
    //     elementoSelected.dataset.selected = "true";
    //   } else {
    //     elementoSelected.dataset.selected = "false";
    //   }
    //   // if (elementoSelected.className.includes("selected")) {
    //   //   elementoSelected.classList.remove("selected");
    //   //   elementoSelected.dataset.selected = "false";
    //   // } else {
    //   //   elementoSelected.classList.add("selected");
    //   // }
    // } else {
    //   elementoSelected.dataset.selected = "false";
    // }
  } else if (indiceNuevo == indiceAnterior) {
    // console.log(`linea426`);
    // if (elementoSelected1.dataset.selected == "true") {
    //   if (elementoSelected1.className.includes("selected")) {
    //     elementoSelected1.classList.remove("selected");
    //     elementoSelected1.dataset.selected = "false";
    //     elementoSelected.classList.add("selected");
    //   } else {
    //     elementoSelected1.classList.add("selected");
    //   }
    // } else {
    //   if (elementoSelected1.className.includes("selected")) {
    //     elementoSelected1.classList.remove("selected");
    //   }
    // }
    if (
      indiceEditando == indiceAnterior &&
      elementoActual.dataset.selected == "false"
    ) {
      // document.getElementById("editaCliente").value = "";
      // document.getElementById("editaFechaInicio").value = "";
      // document.getElementById("editaFechaFin").value = "";
      // document.getElementById("editaVehiculosClientes").value = "";
      // document.getElementById("editaVehiculosOrg").value = "";
      // document.getElementById("editaComida").checked = false;
      // document.getElementById("editaPrecio").value = "";
      // document.getElementById("editaSeña").checked = false;
      // document.getElementById("editaImporteSeña").value = "";
      // document.querySelector(`.clienteSel`).textContent =
      //   `Editar Cliente Seleccionado: `;
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

      //   const div = document.createElement("div");

      //   div.className = `card-${index}`;
      //   div.id = "card";
      //   div.innerHTML = `
      // <!-- <button class="btnelimina" id="${d.id}"> Eliminar </button> -->
      // <!-- <div class="divcontainer"> -->
      //   <h2 class="elCliente"><strong>${d.cliente}</strong></h2><br>
      //   <span class="datosTitulos"><strong>Fecha Inicio:</strong> <span class="datosVisibles" id="fechaInicio">${d.fechaInicio}</span></span>
      //   <span class="datosTitulos"><strong>Fecha Fin:</strong> <span class="datosVisibles" id="fechaFin">${d.fechaFin}</span></span>
      //   <span class="datosTitulos"><strong>Vehículos clientes:</strong> <span class="datosVisibles" id="vc">${d.vc}</span></span>
      //   <span class="datosTitulos"><strong>Vehículos org:</strong> <span class="datosVisibles" id="vo">${d.vo}</span></span>
      //   <span class="datosTitulos"><strong>Comida:</strong> <span class="datosVisibles" id="comida">${comidaCheck}</span></span>
      //   <span class="datosTitulos"><strong>Precio:</strong> <span class="datosVisibles" id="precio">${moneda} ${d.precio}</span></span>
      //   <span class="datosTitulos"><strong>Seña:</strong> <span class="datosVisibles" id="seña">${señaCheck}</span></span>
      //   <span class="datosTitulos"><strong>Seña Recibida:</strong> <span class="datosVisibles" id="señaRecibida">${d.senaRecibida}</span></span>
      //   <!-- </div> -->
      // `;

      //   // div.innerHTML = `
      //   //   <button class="btnelimina" id="${d.id}">
      //   //     Eliminar
      //   //   </button>

      //   //   <div class="divcontainer">
      //   //     <h2 class="elCliente">
      //   //       <strong>${d.cliente}</strong>
      //   //     </h2>

      //   //     <span class="datosTitulos">
      //   //       <strong>Fecha Inicio:</strong>
      //   //       <span class="datosVisibles" id="fechaInicio">
      //   //         ${d.fechaInicio}
      //   //       </span>
      //   //     </span>

      //   //     <span class="datosTitulos">
      //   //       <strong>Fecha Fin:</strong>
      //   //       <span class="datosVisibles" id="fechaFin">
      //   //         ${d.fechaFin}
      //   //       </span>
      //   //     </span>
      //   //   </div>
      //   // `;

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
        if (card.dataset.selected === "true") {
          eleEdita.style.background = "#888";
          eleEdita.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else {
          eleEdita.style.background = "#2c2c2c";
        }
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

        cargarEnFormulario(d, index, indiceAnterior);
      });

      div.prepend(divContainer);
      divContainer.prepend(imgContainer);
      imgContainer.appendChild(imgDiv);
      //divContainer.appendChild(div);
      lista2.appendChild(div);

      //console.log(div);

      // lista.insertBefore(document.querySelector(`#card`), divContainer);

      const btnElimina = document.querySelector(`#${d.id}`);
      console.log(btnElimina);
      btnElimina.addEventListener("click", () => {
        const option = select.options[select.selectedIndex];

        //console.log(d.id);
        idSeleccionado = d.id;
        idCard = idSeleccionado;
        idCard2 = btnElimina.id;
        if (btnElimina.textContent == "Eliminar") {
          eliminar();
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
            precio: document.getElementById("editaPrecio").value,
            sena: document.getElementById("editaSeña").checked,
            senaRecibida: document.getElementById("editaImporteSeña").value,
          };
          editar(nuevo);
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

function mostrarDatos() {
  lista.innerHTML = "";

  datos.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  datos.forEach((d, index) => {
    //visibles.push(d);
    //console.log(d);
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
    const resultado = restarDias(
      d.fechaInicio,
      d.fechaFin.replace("end: ", ""),
      1,
    );

    divContainer.innerHTML = `
    <!-- <button class="btnelimina" id="${d.id}"> Eliminar </button> -->
    <!-- <div class="divcontainer"> -->
      <h2 class="elCliente"><strong>${d.cliente}</strong></h2><br>
      <span class="datosTitulos"><strong>Fecha Inicio:</strong> <span class="datosVisibles" id="fechaInicio">${d.fechaInicio}</span></span>
      <span class="datosTitulos"><strong>Fecha Fin:</strong> <span class="datosVisibles" id="fechaFin">${resultado}</span></span>
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
      const card = e.target.closest("#card");
      if (!card) return;
      const form = document.querySelector(".editaClientes");
      // console.log(form);
      seleccionarCard(card, eleEdita);
      if (card.dataset.selected === "true") {
        eleEdita.style.background = "#888";
        eleEdita.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        eleEdita.style.background = "#2c2c2c";
      }
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

      cargarEnFormulario(d, index, indiceAnterior);
    });

    div.prepend(divContainer);
    divContainer.prepend(imgContainer);
    imgContainer.appendChild(imgDiv);
    //divContainer.appendChild(div);
    lista.appendChild(div);

    //console.log(div);

    // lista.insertBefore(document.querySelector(`#card`), divContainer);

    const btnElimina = document.querySelector(`#${d.id}`);
    btnElimina.addEventListener("click", () => {
      const option = select.options[select.selectedIndex];

      //console.log(d.id);
      idSeleccionado = d.id;
      idCard = idSeleccionado;
      idCard2 = btnElimina.id;
      if (btnElimina.textContent == "Eliminar") {
        eliminar();
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
          precio: document.getElementById("editaPrecio").value,
          sena: document.getElementById("editaSeña").checked,
          senaRecibida: document.getElementById("editaImporteSeña").value,
        };
        editar(nuevo);
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
  const fechaFin = restarDias(
    d.fechaInicio,
    d.fechaFin.replace("end: ", ""),
    1,
  );

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
          ${d.fechaInicio || ""}
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

    cargarEnFormulario(d, index, indiceAnterior);
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
  btnElimina.addEventListener("click", () => {
    idSeleccionado = d.id;
    //console.log(idCard2);
    if (btnElimina.textContent == "Eliminar") {
      eliminar();
    } else if (btnElimina.textContent == "Guardar") {
      //console.log(nuevo);
      guardar(nuevo);
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
  // console.log(ev);
  const descripcion = ev.description || "";

  const datosExtraidos = procesarDescripcionEvento(descripcion);
  //console.log(datosExtraidos);

  return {
    id: ev.id,
    cliente: ev.summary || "",
    fechaInicio: ev?.start.dateTime || ev.start.date,

    fechaFin: ev.end.dateTime || ev.end.date,

    vc: datosExtraidos?.vehiculos,
    vo: datosExtraidos?.organizadores,
    comida: datosExtraidos?.comida || false,
    precio: datosExtraidos?.precio,
    moneda: datosExtraidos?.moneda,

    sena: false,
    senaRecibida: "",
  };
}

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
  //console.log(nuevo);
  guardar(nuevo);
  limpiarFormulario(eleCarga);
});

actualizar.addEventListener("click", (e) => {
  nuevo = {
    id: idCard2,
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
  if (actualizar.textContent === "guardar") {
    // console.log(idSeleccionado);
    guardar(nuevo);
  } else {
    //console.log(idCard2);
    if (btnEliminar.checked) {
      eliminar();
    } else {
      editar(nuevo);
    }
  }
  limpiarFormulario(eleEdita);
  eleEdita.style.background = "#2c2c2c";
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
    // console.log("Guardado correctamente");
    await cargarDatos(); // 👈 recargás la lista
    //console.log(datos);
  } else {
    console.error("Error al guardar", data);
  }
  data.logs.forEach((l) => console.log(l));

  alert("Guardado");
}

async function editar(contenido) {
  //console.log(idCard2);
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

  data.logs.forEach((l) => console.log(l));

  alert("Editado");
}

// async function eliminar() {
//   console.log(`${API}/eliminar`);
//   await fetch(`http://127.0.0.1:5000/eliminar`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       path: "data/data.json",
//       id: idCard2,
//     }),
//   });
// }
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

    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

// function limpiarFormulario2(formId) {
//   const form = document.querySelector(`${formId}`);
//   // console.log(form);
//   //form.reset();

//   if (!form) return;

//   const elementos = form.querySelectorAll("input, select, textarea");

//   elementos.forEach((el) => {
//     if (el.type === "checkbox" || el.type === "radio") {
//       el.checked = false;
//     } else {
//       el.value = "";
//     }
//   });
// }

function limpiarFormulario(contenedor) {
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

setInterval(async () => {
  const res = await fetch(`${API}/logs`);
  const logs = await res.json();

  //console.clear();
  logs.forEach((l) => console.log(l));
}, 5000);

// function mostrarFechas2(eventos) {
//   const select = document.getElementById("fechas");

//   eventos.forEach((ev) => {
//     const fecha = ev.start.dateTime || ev.start.date;

//     const option = document.createElement("option");
//     option.value = fecha;
//     option.textContent = `${fecha} - ${ev.summary}`;

//     select.appendChild(option);
//   });
// }
//const select = document.getElementById("fechas");
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
        cliente: c.cliente.replace("cliente:", "").trim().toLowerCase(),

        fecha: c.fecha.replace("start:", "").trim().toLowerCase(),

        precio: c.precio.replace("precio: ", "").trim().toLowerCase(),

        moneda: c.moneda.trim().toLowerCase(),
        id: c.id.trim().toLowerCase(),
        //}));
      }))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    //console.log(clientesCalendar2);

    const clientesCards3 = reservas.map((c) => ({
      cliente: c.cliente.trim().toLowerCase(),

      fecha: c.fecha.replace("fecha:", "").trim().toLowerCase(),

      //precio: c.precio.replace(`${moneda} `, "").trim().toLowerCase(),
      precio: c.precio
        .replace(/(usd|ars)\s*/gi, "")
        .trim()
        .toLowerCase(),

      moneda: moneda.trim().toLowerCase(),
    }));
    //console.log(clientesCards3);

    // limpiar array
    const cambios2 = [];

    clientesCalendar2.forEach((calendar, index) => {
      // const reserva2 = clientesCards3.find(
      //   (card) => card.fecha === calendar.fecha,
      // );
      const reserva2 = clientesCards3.find(
        (card) =>
          card.fecha === calendar.fecha && card.cliente === calendar.cliente,
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
          id: calendar.id,
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
        id: calendar.id,
        cambios: cambios,
      });
    });

    // =========================
    // AGREGAR AL SELECT
    // =========================

    if (cambios2.length > 0) {
      //console.log("Cambios detectados:", cambios2);
      //console.log(cambios2);
      // const ahora = new Date();

      // const fecha =
      //   ahora.getFullYear() +
      //   "-" +
      //   String(ahora.getMonth() + 1).padStart(2, "0") +
      //   "-" +
      //   String(ahora.getDate()).padStart(2, "0");

      //console.log(fecha);

      cambios2.forEach((cambio, index) => {
        cambio.fecha = formatearFecha(cambio.fecha.trim());
        //console.log(cambio.fecha);
        //const fechaComparada = compararFechas(fecha, cambio.fecha);
        //console.log(fechaComparada);
        //console.log(compararFechas(fecha, cambio.fecha));
        // if (fecha > cambio.fecha) {
        //   console.log(cambio.fecha);
        //   return;
        // }
        //if (fechaComparada === 1) {
        //return;
        //} else if (fechaComparada === 0) {
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
            card.cliente === calendar.cliente && card.fecha === calendar.fecha,
        ),
    );
    faltantes.forEach((ev, index) => {
      clientes = ev.cliente;
    });
    const existeFaltante = clientesCalendar2.some(
      (calendar) =>
        !clientesCards3.some(
          (card) =>
            card.cliente === calendar.cliente && card.fecha === calendar.fecha,
        ),
    );

    noexiste = faltantes;
    eventos.forEach((ev, index) => {
      //console.log(ev);
      const datos = procesarEventoGoogle(ev);
      //console.log(datos.fechaInicio);
      const cliente = datos.cliente.toLowerCase();
      const fecha = datos.fechaInicio.toLowerCase();
      const fecha2 = formatearFecha(datos.fechaInicio);
      //console.log(fecha2);
      //console.log(fechaFormateada);
      const precio = datos.precio;
      idcCalendar = datos.id;

      // verificar si existe
      const existe = clientesCards3.some(
        (card) =>
          (card.cliente === cliente && card.fecha === fecha2) ||
          card.precio === precio,
      );
      //console.log(existe);

      // si YA existe → no agregar
      if (existe) return;
      const yaExisteOption = [...select.options].some(
        (opt) => opt.textContent === `${fecha2} - ${cliente}`,
      );

      if (yaExisteOption) return;

      if (cambios2.length > 0) {
        // fechaFormateada = formatearFecha(fecha.replace("start:", "").trim());
        // console.log(fechaFormateada);
        // console.log(fecha);
        const fechaComparada = compararFechas(fecha2, fechaHoy);

        // menor a hoy → ignorar
        if (fechaComparada === -1) {
          return;
        }
        //console.log(formatearFecha(fecha));

        agregarOption(
          select,
          `${fecha2} - ${cliente}`,
          nuevoNumero,
          idcCalendar,
        );
      } else {
        // console.log("Sin cambios");
      }
    });
    select.onchange = () => {
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
      //console.log(eventoSeleccionado);

      // procesar
      const datosProcesados = procesarEventoGoogle(eventoSeleccionado);
      //console.log(datosProcesados);

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
          r.fecha.replace("fecha:", "").trim().toLowerCase() === fecha,
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
        // if (indiceAnterior === null) {
        //   indiceAnterior = numero;
        // }
        nuevo = {
          id: idCard2,
          cliente: cliente,
          fechaInicio: fecha,
          fechaFin: datosProcesados.fechaFin,
          vc: datosProcesados?.vc,
          vo: datosProcesados?.vo,
          comida: comidaCheck,
          precio: datosProcesados?.precio,
          moneda: datosProcesados?.moneda,
          sena: señaCheck,
          senaRecibida: datosProcesados?.senaRecibida,
        };
        //datosNuevos.push(nuevo);
        reservas.push({
          cliente: datosProcesados.cliente.toLowerCase().trim(),
          fecha: datosProcesados.fechaInicio.toLowerCase(),
          precio: datosProcesados.precio,
        });
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

        tarjetaAnterior = `card-${nuevoNumero}`;
        //console.log(tarjetaAnterior);
        // document.querySelectorAll("#card").forEach((card) => {
        //   //card.addEventListener("click", () => {
        //   compararCards(card);
        //   //});
        // });
        // const card2 = document.querySelector(`#${tarjetaAnterior}`);
        // card2.addEventListener("click", () => {
        //   compararCards(card2);
        // });
        mostrarDatosGoogle(datosProcesados, nuevoNumero);
        cargarEnFormulario(datosProcesados, idCalendar, numero);
        eleEdita.style.background = "#888";
        eleEdita.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        //console.log(`nuevo: ${numeros.nuevo2} - mayor: ${numeros.mayor}`);
        tarjetaAnterior = null;
        return;
      }
      //obtenerNumeros();
      //obtenerNumeros(nuevoNumero, numeroMayor);

      indiceSelect = index;
      //}
      numeroIDSelect = `card-${indiceSelect}`;
      // console.log(numeroIDSelect);
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
          nuevo = {
            id: idCard2,
            cliente: datosProcesados.cliente,
            fechaInicio: datosProcesados.fechaInicio,
            fechaFin: datosProcesados.fechaFin,
            vc: datosProcesados.vc,
            vo: datosProcesados.vo,
            comida: comidaCheck,
            precio: datosProcesados.precio,
            moneda: datosProcesados.moneda,
            sena: señaCheck,
            senaRecibida: datosProcesados.senaRecibida,
          };
          const fechaFin = restarDias(nuevo.fechaInicio, nuevo.fechaFin, 1);
          //datosNuevos.push(nuevo);
          if (nuevo.comida == "false") {
            nuevo.comida = "No";
          }
          if (nuevo.sena == "false") {
            nuevo.sena = "No";
          }
          // console.log(nuevo.sena);

          card2.querySelector(".elCliente").textContent = nuevo.cliente;
          card2.querySelector("#fechaInicio").textContent = nuevo.fechaInicio;
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
          nuevo = {
            id: idCard2,
            cliente: datosProcesados.cliente,
            fechaInicio: datosProcesados.fechaInicio,
            fechaFin: datosProcesados.fechaFin,
            vc: datosProcesados.vc,
            vo: datosProcesados.vo,
            comida: comidaCheck,
            precio: datosProcesados.precio,
            moneda: datosProcesados.moneda,
            sena: señaCheck,
            senaRecibida: datosProcesados.senaRecibida,
          };
          const fechaFin = restarDias(nuevo.fechaInicio, nuevo.fechaFin, 1);
          //datosNuevos.push(nuevo);

          card2.querySelector(".elCliente").textContent = nuevo.cliente;
          card2.querySelector("#fechaInicio").textContent = nuevo.fechaInicio;
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
      cargarEnFormulario(datosProcesados, idCalendar, indiceAnterior);
    };
  }, 2000);
}
// Funcion para ordenar por fecha
function ordenarPorFecha2() {
  const cards = Array.from(lista.children);

  cards.sort((a, b) => {
    const fechaA = new Date(a.querySelector("#fechaInicio").textContent);
    const fechaB = new Date(b.querySelector("#fechaInicio").textContent);

    return fechaA - fechaB;
  });

  // volver a insertar ordenados
  cards.forEach((card) => lista.appendChild(card));
}

function ordenarPorFecha3() {
  const hoy = new Date();

  // quitar horas para comparar solo fechas
  hoy.setHours(0, 0, 0, 0);

  const cards = Array.from(lista.children).filter((card) => {
    const fechaFinTexto = card.querySelector("#fechaFin").textContent;

    const fechaFin = new Date(fechaFinTexto);

    fechaFin.setHours(0, 0, 0, 0);

    // ✅ mostrar solo si fechaFin es MAYOR que hoy
    return fechaFin > hoy;
  });

  // ordenar por fechaInicio
  cards.sort((a, b) => {
    const fechaA = new Date(a.querySelector("#fechaInicio").textContent);

    const fechaB = new Date(b.querySelector("#fechaInicio").textContent);

    return fechaA - fechaB;
  });

  // limpiar lista
  lista.innerHTML = "";

  // volver a insertar ordenadas
  cards.forEach((card) => {
    lista.appendChild(card);
  });
}

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

// Funcion para comparar reservas con calendario
function compararReservas(reserva, calendar) {
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
    card.dataset.selected = "false";
    card.classList.remove("selected");
    limpiarFormulario(eleEdita);
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
  dataId = ultimo.dataset.id;

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
  nuevoNumero = Number(dataId.split("-")[1]) + 1;
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

cargarDatos();
