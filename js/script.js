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
//let indiceSelect = null;
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
  //console.log(texto);
  // if (/no\s*incluye\s*comida/i.test(texto.toLowerCase())) {
  //   resultado.comida = "No";
  // } else if (/incluye\s*comida|con\s*comida/i.test(texto.toLowerCase())) {
  //   resultado.comida = "Sí";
  // }
  if (/\b(true|s[ií])\b|incluye\s*comida|con\s*comida/i.test(texto)) {
    resultado.comida = "Sí";
  } else if (/\b(false|no)\b|no\s*incluye\s*comida/i.test(texto)) {
    resultado.comida = "No";
  }

  if (/\b(true|s[ií])\b|incluye\s*seña|con\s*seña/i.test(texto)) {
    resultado.sena = "Sí";
  } else if (/\b(false|no)\b|no\s*seña\s*seña/i.test(texto)) {
    resultado.sena = "No";
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

function restarDias(fecha, dias) {
  const nuevaFecha = new Date(fecha);

  nuevaFecha.setDate(nuevaFecha.getDate() - dias);

  return nuevaFecha.toISOString().split("T")[0];
}

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
      const id = ev?.id;
      idCalendar = ev?.id;
      //console.log(idCalendar);
      //console.log(cliente);
      const resultado = restarDias(fechaFin.replace("end: ", ""), 1);

      // console.log(resultado);
      // console.log(
      //   `cliente: ${cliente} - precio: ${precio} - fechaFin: ${fechaFin}`,
      // );
      clientesCalendar.push({
        id: id.toLowerCase().trim(),
        cliente: cliente.toLowerCase().trim(),
        fecha: fechaInicio.toLowerCase().trim(),
        precio: precio.replace("precio: ", "").toLowerCase().trim(),
        moneda: moneda.replace("moneda: ", "").toLowerCase().trim(),
      });
      clientes = nomCli.toLowerCase();
      fechasInicio = fechaInicio.toLowerCase();
      //console.log(clientes);
      // console.log(fechaFin);
      // console.log(vehiculosClientes);
      // console.log(vehiculosOrganizadores);
      //console.log(precio);
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
        cliente: card.querySelector("h2")?.textContent.toLowerCase().trim(),
        fecha: card.querySelector("#fechaInicio")?.textContent.toLowerCase(),
        precio: card
          .querySelector("#precio")
          ?.textContent.replace(`${moneda} `, "")
          .toLowerCase(),
      });
    });
    // reservas.forEach((elemento, index) => {
    //   console.log(elemento);
    // });
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

    nuevoNumero = Number(dataId.split("-")[1]) + 2;
    if (plataforma.includes("Android")) {
      creaTop();
      window.onscroll = function () {
        scrollFunction();
      };
    }

    //console.log(nuevoNumero);
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
  console.log(dato);
  console.log(comidaCheck);
  // if (dato.comida == "No" || dato.comida == "false") {
  //   comidaCheck = false;
  // } else {
  //   comidaCheck = true;
  // }
  // if (dato.sena == "No" || dato.sena == "false") {
  //   señaCheck = false;
  // } else {
  //   señaCheck = true;
  // }
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
  const fechaFin = restarDias(dato.fechaFin.replace("end: ", ""), 1);
  document.getElementById("editaFechaFin").value = fechaFin;
  document.getElementById("editaVehiculosClientes").value = dato.vc;
  document.getElementById("editaVehiculosOrg").value = dato.vo;
  document.getElementById("editaComida").checked = comidaCheck;
  document.getElementById("editaPrecio").value = dato.precio;
  document.getElementById("editaSeña").checked = señaCheck;
  document.getElementById("editaImporteSeña").value = dato.senaRecibida;
  document.querySelector(`.clienteSel`).textContent =
    `Editar Cliente Seleccionado: ${dato.cliente}`;
  actualizar.classList.remove("desactive");
  actualizar.classList.add("active");
  actualizar.disabled = false;
  //console.log(idSeleccionado);

  indiceEditando = index;
  indiceNuevo = indiceEditando;
  //console.log(indiceNuevo);
  const prueba = document.querySelector(`.card-${index}`);
  //console.log(prueba);
  const prueba2 = document.querySelector(`.${idCalendar}`);
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
      console.log(card);
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
  console.log(elementoSelected);
  const elementoSelected1 = document.querySelector(`.card-${indiceAnteriors}`);
  console.log(elementoSelected1);
  const elementoActual = document.querySelector(`.card-${index}`);
  const elementoAnterior = document.querySelector(`.card-${indiceAnteriors}`);
  if (elementoSelected == null) return;
  if (elementoSelected.className.includes("nuevo")) {
    actualizar.textContent = "guardar";
  }

  if (indiceNuevo != indiceAnterior) {
    console.log(`linea390`);
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
    console.log(`linea426`);
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
    // const btnElimina = document.createElement("button");
    // btnElimina.className = "btnelimina";
    // btnElimina.textContent = "Eliminar";
    // btnElimina.id = `card-${index}`;
    // console.log(`cliente: ${d.cliente} - fechaFin: ${d.fechaFin}`);
    radio.type = "radio";
    div.className = `card-${index}`;
    div.id = "card";
    div.dataset.id = `card-${index}`;
    //div.appendChild(divContainer);
    div.innerHTML = `
    <button class="btnelimina" id="${d.id}"> Eliminar </button>
    `;
    const longitud = d.precio;
    if (longitud.length <= 3) {
      moneda = "USD";
    } else if (longitud.length > 3) {
      moneda = "ARS";
    }
    // const valorComida =
    //   d.comida == null
    //     ? ""
    //     : typeof d.comida === "boolean"
    //       ? String(d.comida)
    //       : d.comida;
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

    // const cards = document.querySelectorAll("#card");

    // cards.forEach((card) => {
    //   card.addEventListener("click", () => {
    //     console.log("hola");
    //     // si ya estaba seleccionada → deseleccionar
    //     if (card.dataset.selected === "true") {
    //       card.dataset.selected = "false";
    //       card.classList.remove("selected");
    //       return;
    //     }

    //     // quitar selección anterior
    //     //document.querySelectorAll(`div[id="card"]`).forEach((c) => {
    //     document.querySelectorAll("#card.selected").forEach((c) => {
    //       if (c.className.includes("selected")) {
    //         console.log(c);
    //         c.dataset.selected = "false";
    //         c.classList.remove("selected");
    //       }
    //     });

    //     // seleccionar nueva
    //     card.dataset.selected = "true";
    //     card.classList.add("selected");
    //   });
    // });
    // 👉 CLICK PARA EDITAR
    divContainer.addEventListener("click", (e) => {
      idSeleccionado = d.id;
      console.log(e.target.closest('div[id="card"]'));
      const card = e.target.closest("#card");
      if (!card) return;
      seleccionarCard(card);
      if (card.dataset.selected === "true") {
        // card.dataset.selected = "false";
        // card.classList.remove("selected");
        // return;
        eleEdita.style.background = "#888";
        eleEdita.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        eleEdita.style.background = "#2c2c2c";
        // eleEdita.style.background = "#888";
        // eleEdita.scrollIntoView({
        //   behavior: "smooth",
        //   block: "center",
        // });
      }

      // // si ya estaba seleccionada
      // if (card.dataset.selected === "true") {
      //   card.dataset.selected = "false";
      //   card.classList.remove("selected");
      //   return;
      // }

      // // quitar selección anterior
      // document.querySelectorAll("#card.selected").forEach((c) => {
      //   c.dataset.selected = "false";
      //   c.classList.remove("selected");
      // });

      // // seleccionar nueva
      // card.dataset.selected = "true";
      // card.classList.add("selected");
      // if (div.dataset.selected == "true") {
      //   div.dataset.selected = "false";
      // } else {
      //   div.dataset.selected = "true";
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
      // console.log(d.comida);
      // const valorComida = String(d.comida).trim().toLowerCase();
      // const valorSeña = String(d.sena).trim().toLowerCase();

      // comidaCheck = !(valorComida === "no" || valorComida === "false");
      // señaCheck = !(valorSeña === "No" || valorSeña === "false");
      // if (d.comida === "No" || d.comida === "false") {
      //   comidaCheck = false;
      // } else {
      //   comidaCheck = true;
      // }
      // if (d.sena == "No" || d.sena == "false") {
      //   señaCheck = false;
      // } else {
      //   señaCheck = true;
      // }
      console.log(idSeleccionado);
      console.log(d);
      console.log(index);
      console.log(indiceAnterior);
      estado = "EXISTE";
      // document.querySelectorAll("#card").forEach((card) => {
      //   //console.log(card);
      //   card.classList.remove("selected");
      //   card.dataset.selected = "false";
      // });
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
      const option = select.options[select.selectedIndex];

      //console.log(d.id);
      idSeleccionado = d.id;
      if (btnElimina.textContent == "Eliminar") {
        eliminar();
        console.log("eliminar");
        if (option) {
          option.remove();
        }
      } else if (btnElimina.textContent == "Actualizar") {
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
        editar(nuevo);
        // console.log("actualizar");
        //console.log(nuevo);
        if (option) {
          option.remove();
        }
      }
    });
    //console.log(btnElimina);
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
      // const resultados2 = reservas.filter((d) => {
      //   console.log(d.cliente.toLowerCase());
      //   d.cliente.includes(clientes);
      // });
      // resultados2.forEach((el) => {
      //   console.log(el);
      // });
      // console.log(resultados3);
      //console.log(resultados);
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
        // console.log(clienteExiste);
        // console.log(fechaExiste);
        if (clienteExiste && fechaExiste) return;
      }
    }
  }, 3000);
  const fechaFin = restarDias(d.fechaFin.replace("end: ", ""), 1);

  //console.log(fechaExiste);

  // console.log(clientes);
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
  div.classList.add("nuevo");
  div.dataset.id = `card-${nuevoNumero}`;
  div.id = "card";
  //div.dataset.selected = div.dataset.selected === "true" ? "false" : "true";

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
          ${d.moneda} ${d.precio || ""}
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
    const card = e.target.closest("#card");
    if (!card) return;
    seleccionarCard(card);
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
  document.querySelectorAll("#card").forEach((card) => {
    if (card.className.includes("nuevo")) {
      btnElimina.textContent = "Guardar";
    }
  });
  btnElimina.addEventListener("click", () => {
    idSeleccionado = d.id;
    if (btnElimina.textContent == "Eliminar") {
      eliminar();
    } else if (btnElimina.textContent == "Guardar") {
      console.log(datosNuevos);
      guardar(datosNuevos);
    }
  });
  // const botonEliminar = document.querySelector(`#card-${nuevoNumero}`);
  // console.log(btnElimina);
  const card = document.querySelector(`#card[data-id="card-${nuevoNumero}"]`);
  if (!card) return;
  seleccionarCard(card);
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
    fechaInicio: ev.start.dateTime || ev.start.date,

    fechaFin: ev.end.dateTime || ev.end.date,

    vc: datosExtraidos.vehiculos,
    vo: datosExtraidos.organizadores,
    comida: datosExtraidos.comida || false,
    precio: datosExtraidos.precio,
    moneda: datosExtraidos.moneda,

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
  if (actualizar.textContent === "guardar") {
    // console.log(idSeleccionado);
    guardar(nuevo);
  } else {
    // console.log(idSeleccionado);
    if (btnEliminar.checked) {
      eliminar();
    } else {
      editar(nuevo);
    }
  }
  limpiarFormulario("editaClientes");
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
select.selectedIndex = -1;
// select.addEventListener("mousedown", () => {
//   console.log("Abrió el select");
//   console.log(`selectedindex: ${select.selectedIndex}`);
// });

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
      const reserva2 = clientesCards3.find(
        (card) => card.fecha === calendar.fecha,
      );

      // si no existe → ignorar
      if (!reserva2) return;

      const resultado2 = compararReservas(reserva2, calendar);
      // console.log(resultado2);

      // ✅ IMPORTANTE
      // limpiar cambios por iteración
      const cambios = [];

      Object.entries(resultado2)
        .filter(([_, igual]) => !igual)
        .forEach(([campo]) => {
          cambios.push(campo);
        });

      // si no hay cambios → salir
      if (cambios.length === 0) return;

      cambios2.push({
        cliente: calendar.cliente,
        fecha: calendar.fecha,
        id: calendar.id,
        cambios: cambios,
      });
      // opciones.push({
      //   fecha: calendar.fecha,
      //   cliente: calendar.cliente,
      //   index,
      //   id: calendar.id,
      // });
    });

    // =========================
    // AGREGAR AL SELECT
    // =========================

    if (cambios2.length > 0) {
      //console.log("Cambios detectados:", cambios2);

      cambios2.forEach((cambio, index) => {
        //console.log(cambio);
        idcCalendar = cambio.id;
        // opciones.push({
        //   fecha: cambio.fecha,
        //   cliente: cambio.cliente,
        //   index,
        //   id: idcCalendar,
        // });

        // opciones.forEach((op) => {
        //   agregarOption(select, `${op.fecha} - ${op.cliente}`, op.index, op.id);
        // });
        agregarOption(
          select,
          `${cambio.fecha} - ${cambio.cliente}`,
          index,
          idcCalendar,
        );
        // agregarOption(
        //   select,
        //   `🟡 ${cambio.fecha} - ${cambio.cliente} | Cambios: ${cambio.cambios.join(", ")}`,
        //   index,
        // );
      });
      // opciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      // console.log(opciones);
      // opciones.forEach((op) => {
      //   agregarOption(select, `${op.fecha} - ${op.cliente}`, op.index, op.id);
      // });
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
      const datos = procesarEventoGoogle(ev);
      const cliente = datos.cliente.toLowerCase();
      const fecha = datos.fechaInicio.toLowerCase();
      const precio = datos.precio;
      idcCalendar = datos.id;
      //console.log(cliente);
      //const opciones = [];
      // opciones.length = 0;
      // opciones.push({
      //   fecha: fecha,
      //   cliente: cliente,
      //   index,
      //   id: idcCalendar,
      // });
      //opciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      //console.log(opciones);

      // verificar si existe
      const existe = clientesCards3.some(
        (card) =>
          (card.cliente === cliente && card.fecha === fecha) ||
          card.precio === precio,
      );
      // clientesCards3.forEach((card) => {
      //   console.log({
      //     cardCliente: card.cliente,
      //     cliente,
      //     igualCliente: card.cliente?.toLowerCase().trim() === cliente.trim(),

      //     cardFecha: card.fecha,
      //     fecha,
      //     igualFecha: card.fecha?.toLowerCase().trim() === fecha.trim(),

      //     cardPrecio: card.precio,
      //     precio,
      //     igualPrecio: card.precio == precio,
      //   });
      // });
      // const existe = clientesCards3.some((card) => {
      //   return (
      //     (card.cliente?.toLowerCase().trim() === cliente.trim() &&
      //       card.fecha?.toLowerCase().trim() === fecha.trim()) ||
      //     card.precio == precio
      //   );
      // });
      //console.log(existe);

      // si YA existe → no agregar
      if (existe) return;

      if (cambios2.length > 0) {
        // agregar al select
        // opciones.forEach((op) => {
        //   agregarOption(select, `${op.fecha} - ${op.cliente}`, op.index, op.id);
        // });
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
    // if (cambios2.length > 0) {
    //   // agregar al select
    //   opciones.forEach((op) => {
    //     agregarOption(select, `${op.fecha} - ${op.cliente}`, op.index, op.id);
    //   });
    //   //agregarOption(select, `${fecha} - ${cliente}`, index, idcCalendar);
    // } else {
    //   // console.log("Sin cambios");
    // }
    select.onchange = () => {
      indiceSelect = null;
      numeroIDSelect = null;
      origen = "select";
      // const todosCard = document.querySelectorAll("#card");
      // todosCard.forEach((card) => {
      //   console.log(card);
      //   //card.classList.remove("selected");
      // });

      document.querySelectorAll("#card").forEach((card) => {
        //console.log(card);
        card.classList.remove("selected");
        card.dataset.selected = "false";
      });

      const optionSeleccionado = select.options[select.selectedIndex];
      //console.log(optionSeleccionado.id);
      // console.log(select.value);
      // console.log(select.value);
      const index = select.value;

      // if (indiceAnterior === null) {
      //   indiceAnterior = `card-${index}`;
      // } //else {
      // //indiceAnterior = indiceAnterior;
      // //}
      // if (indiceNuevo === null) {
      //   indiceNuevo = `card-${index}`;
      // }
      // console.log(datos[index]);
      //console.log(eventos);
      //const evento = eventos.find((ev) => ev.id === optionSeleccionado.id);

      //console.log(evento);
      const indexEvento = eventos.findIndex(
        (ev) => ev.id === optionSeleccionado.id,
      );

      //console.log(indexEvento);
      //console.log(datos[index].id);
      //console.log(faltantes);
      //console.log(nuevoNumero);
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
      idSeleccionado = idCalendar;
      // console.log(noexiste);
      // console.log(nuevoNumero);

      // console.log(idCalendar);
      // console.log(numero);

      if (index === "") return;

      // evento original de Google

      const eventoSeleccionado = eventos[indexEvento];
      //console.log(eventoSeleccionado);

      // procesar
      const datosProcesados = procesarEventoGoogle(eventoSeleccionado);
      console.log(datosProcesados);

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
      console.log(valorComida);
      console.log("VALOR:", datosProcesados.comida);
      console.log("TIPO:", typeof datosProcesados.comida);

      // =========================
      // SI NO EXISTE
      // =========================

      if (!reservaExistente) {
        // console.log("NO EXISTE");
        estado = "NO EXISTE";
        // if (indiceAnterior === null) {
        //   indiceAnterior = numero;
        // }
        datosNuevos.push(datosProcesados);
        reservas.push({
          cliente: datosProcesados.cliente.toLowerCase().trim(),
          fecha: datosProcesados.fechaInicio.toLowerCase(),
          precio: datosProcesados.precio,
        });

        mostrarDatosGoogle(datosProcesados, nuevoNumero);
        cargarEnFormulario(datosProcesados, idCalendar, numero);
        eleEdita.style.background = "#888";
        eleEdita.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        return;
      }

      // =========================
      // SI EXISTE
      // =========================
      // const cambio = cambios2[index];
      // const reserva = reservas.find(
      //   (r) =>
      //     r.cliente.trim().toLowerCase() ===
      //       cambio.cliente.trim().toLowerCase() &&
      //     r.fecha.replace("fecha:", "").trim().toLowerCase() ===
      //       cambio.fecha.trim().toLowerCase(),
      // );
      //const datosProcesados = procesarEventoGoogle(eventoSeleccionado);
      //console.log(eventoSeleccionado);
      // const datosProcesados2 = procesarEventoGoogle(datos[index].id);

      // console.log(datosProcesados2);

      // console.log(index);
      // const numero = parseInt(idCalendar.match(/card-(\d+)/)[1]);

      // console.log(numero);
      // const eventoSeleccionado2 = eventos[idCalendar];
      // console.log(eventoSeleccionado2);
      //const datosProcesados2 = procesarEventoGoogle(numero);

      // const optionSeleccionado = select.options[select.selectedIndex];

      // // buscar index del evento
      //console.log(numeroIDSelect);
      //if (indiceSelect === null) {
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
        const botonEliminar = document.querySelector(`#${idSeleccionado}`);
        // console.log(nuevoNumero);
        // resaltar
        if (card) {
          console.log(señaCheck);
          nuevo = {
            id: idSeleccionado,
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
          const fechaFin = restarDias(nuevo.fechaFin, 1);
          datosNuevos.push(nuevo);
          if (nuevo.comida == "false") {
            nuevo.comida = "No";
          }
          if (nuevo.sena == "false") {
            nuevo.sena = "No";
          }
          console.log(nuevo.sena);

          card.querySelector(".elCliente").textContent = nuevo.cliente;
          card.querySelector("#fechaInicio").textContent = nuevo.fechaInicio;
          card.querySelector("#fechaFin").textContent = fechaFin;
          card.querySelector("#vc").textContent = nuevo.vc;
          card.querySelector("#vo").textContent = nuevo.vo;
          card.querySelector("#comida").textContent = nuevo.comida;
          card.querySelector("#precio").textContent =
            `${nuevo.moneda} ${nuevo.precio}`;
          card.querySelector("#seña").textContent = nuevo.sena;
          card.querySelector("#señaRecibida").textContent = nuevo.senaRecibida;
          console.log(card);
          seleccionarCard(card);
          // if (card.className.includes("selected")) {
          //   card.classList.remove("selected");
          //   card.dataset.selected = "false";
          //   //card.classList.add("selected");
          // } else {
          //   card.classList.add("selected");
          //   //card.dataset.selected = "true";
          // }
          //card.classList.add("selected");
          botonEliminar.textContent = "Actualizar";
          actualizar.textContent = "Actualizar";

          // scroll automático
          card.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      } else if (indiceNuevo == indiceAnterior) {
        // console.log(numeroIDSelect);
        //console.log(`indiceA: ${indiceAnterior} - indiceN: ${indiceNuevo}`);
        //console.log(idSeleccionado);
        const card = document.querySelector(`.${numeroIDSelect}`);
        const botonEliminar = document.querySelector(`#${idSeleccionado}`);
        // resaltar
        if (card) {
          console.log(señaCheck);
          console.log(card);
          // console.log(datosProcesados);
          nuevo = {
            id: idSeleccionado,
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
          const fechaFin = restarDias(nuevo.fechaFin, 1);
          datosNuevos.push(nuevo);

          card.querySelector(".elCliente").textContent = nuevo.cliente;
          card.querySelector("#fechaInicio").textContent = nuevo.fechaInicio;
          card.querySelector("#fechaFin").textContent = fechaFin;
          card.querySelector("#vc").textContent = nuevo.vc;
          card.querySelector("#vo").textContent = nuevo.vo;
          card.querySelector("#comida").textContent = nuevo.comida;
          card.querySelector("#precio").textContent =
            `${nuevo.moneda} ${nuevo.precio}`;
          card.querySelector("#seña").textContent = nuevo.sena;
          card.querySelector("#señaRecibida").textContent = nuevo.senaRecibida;
          console.log(card);
          seleccionarCard(card);
          // console.log(nuevo);
          // if (card.dataset.selected == "true") {
          //   card.dataset.selected = "false";
          // } else {
          //   card.dataset.selected = "true";
          // }
          // card.dataset.selected =
          //   card.dataset.selected === "true" ? "false" : "true";
          // if (card.className.includes("selected")) {
          //   card.classList.remove("selected");
          //   card.dataset.selected = "false";
          //   //card.classList.add("selected");
          // } else {
          //   // console.log("sera aca");
          //   card.classList.add("selected");
          //   //card.dataset.selected = "true";
          // }
          //card.classList.add("selected");
          botonEliminar.textContent = "Actualizar";
          actualizar.textContent = "Actualizar";

          // scroll automático
          card.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }

      estado = "EXISTE";
      // console.log(reserva);
      // console.log(indiceSelect);

      //console.log(`indiceA: ${indiceAnterior} - indiceN: ${indiceNuevo}`);
      // const nuevoIDD = parseInt(indiceNuevo.match(/card-(\d+)/)[1]);
      // console.log(`nuevoIDD: ${nuevoIDD}`);
      // if (elementoSelected1.dataset.selected == "true") {
      //   if (elementoSelected1.className.includes("selected")) {
      //     elementoSelected1.classList.remove("selected");
      //     elementoSelected1.dataset.selected = "false";
      //   } else {
      //     elementoSelected1.classList.add("selected");
      //   }
      // }
      // const lalala = document.querySelector(`.card-${indiceSelect}`);
      // lalala.dataset.selected =
      //   lalala.dataset.selected === "true" ? "false" : "true";
      if (indiceAnterior === null) {
        indiceAnterior = numero;
      }
      if (indiceNuevo === null) {
        indiceNuevo = numero;
      }
      eleEdita.style.background = "#2c2c2c";
      cargarEnFormulario(datosProcesados, idCalendar, indiceAnterior);
      // console.log("YA EXISTE");

      //console.log(reservaExistente);
    };

    // select.onchange = () => {
    //   console.log(noexiste);
    //   const index = select.value;

    //   const cambio = cambios2[index];

    //   const reserva = reservas.find(
    //     (r) =>
    //       r.cliente.trim().toLowerCase() ===
    //         cambio.cliente.trim().toLowerCase() &&
    //       r.fecha.replace("fecha:", "").trim().toLowerCase() ===
    //         cambio.fecha.trim().toLowerCase(),
    //   );

    //   console.log(reserva);
    // };
    // select.onchange = () => {
    //   const index = select.value;
    //   if (existe) {
    //     console.log(`no existe: ${index}`);
    //   }
    //   const cambio = cambios2[index];
    //   console.log(clientes);
    //   const eventoSeleccionado = eventos[select.value];
    //   console.log(eventoSeleccionado);
    //   const datosProcesados = procesarEventoGoogle(cambio);

    //   //const cambio = cambios2[index];

    //   //console.log(cambio);
    // };
    // select.onchange = () => {
    //   const eventoSeleccionado = eventos[select.value];
    //   console.log(eventoSeleccionado);
    //   const datosProcesados = procesarEventoGoogle(eventoSeleccionado);
    //   console.log(datosProcesados.cliente);
    //   //clientes = datosProcesados.cliente.toLowerCase();
    //   clientes = noexiste[0].cliente;
    //   fechasInicio = datosProcesados.fechaInicio.toLowerCase();
    //   console.log(`cliente: ${clientes} - fechaInicio: ${fechasInicio}`);

    //   mostrarDatosGoogle(datosProcesados, nuevoNumero);
    // };
  }, 2000);

  // =========================
  // RECORRER EVENTOS
  // =========================

  // eventos.forEach((ev, index) => {
  //   const datos = procesarEventoGoogle(ev);

  //   // NORMALIZAR EVENTO
  //   const evento = {
  //     cliente: String(datos.cliente || "")
  //       .replace("cliente:", "")
  //       .trim()
  //       .toLowerCase(),

  //     fecha: String(datos.fechaInicio || "")
  //       .replace("start:", "")
  //       .trim()
  //       .toLowerCase(),

  //     precio: String(datos.precio || "")
  //       .replace(`${moneda} `, "")
  //       .trim()
  //       .toLowerCase(),

  //     moneda: String(datos.moneda || moneda || "")
  //       .trim()
  //       .toLowerCase(),

  //     comida: Boolean(datos.comida),
  //     reservas: Number(datos.reservas || 0),
  //   };

  //   // =========================
  //   // BUSCAR RESERVA
  //   // =========================

  //   const reservaExistente = clientesCards3.find(
  //     (r) =>
  //       r.cliente === clientesCalendar2.cliente &&
  //       r.fecha === clientesCalendar2.fecha,
  //   );
  //   console.log(reservaExistente);

  //   // =========================
  //   // EVENTO NUEVO
  //   // =========================

  //   if (!reservaExistente) {
  //     modificados.push({
  //       tipo: "nuevo",
  //       datos: evento,
  //     });

  //     agregarOption(
  //       select,
  //       `🟢 NUEVO - ${evento.fecha} - ${evento.cliente}`,
  //       index,
  //     );

  //     return;
  //   }

  //   // =========================
  //   // COMPARAR
  //   // =========================

  //   const resultado = compararReservas(reservaExistente, evento);

  //   const cambios = [];

  //   Object.entries(resultado).forEach(([campo, igual]) => {
  //     if (!igual) {
  //       cambios.push(campo);
  //     }
  //   });

  //   // =========================
  //   // SI NO HAY CAMBIOS
  //   // =========================

  //   if (cambios.length === 0) {
  //     return;
  //   }

  //   // =========================
  //   // MODIFICADO
  //   // =========================

  //   modificados.push({
  //     tipo: "modificado",
  //     anterior: reservaExistente,
  //     nuevo: evento,
  //     cambios,
  //   });

  //   agregarOption(
  //     select,
  //     `🟡 MODIFICADO - ${evento.fecha} - ${evento.cliente}`,
  //     index,
  //   );
  // });

  // // =========================
  // // SIN EVENTOS
  // // =========================

  // if (select.options.length === 0) {
  //   agregarOption(select, "No hay cambios ni eventos nuevos", "", {
  //     disabled: true,
  //     selected: true,
  //   });
  // }

  // // =========================
  // // CHANGE
  // // =========================

  // select.onchange = () => {
  //   const index = select.value;

  //   if (index === "") return;

  //   const eventoSeleccionado = eventos[index];

  //   const datosProcesados = procesarEventoGoogle(eventoSeleccionado);

  //   clientes = datosProcesados.cliente
  //     .replace("cliente:", "")
  //     .trim()
  //     .toLowerCase();

  //   fechasInicio = datosProcesados.fechaInicio
  //     .replace("start:", "")
  //     .trim()
  //     .toLowerCase();

  //   mostrarDatosGoogle(datosProcesados, nuevoNumero);
  // };

  // // debug
  // console.log("MODIFICADOS:", modificados);
  // console.log("NUEVOS:", noexiste);
}

// function mostrarFechas2(eventos) {
//   //console.log(eventos);
//   // const resultados = clientesCalendar.filter((r) =>
//   //   r.cliente.toLowerCase().includes(reservas),
//   // );
//   //console.log(clientes);
//   // const resultados = reservas.filter((r) =>
//   //   r.cliente.toLowerCase().includes(clientesCalendar.cliente),
//   // );
//   // const clientesReservas = reservas.map((c) => c.cliente.toLowerCase());
//   // setTimeout(() => {
//   //   console.log(clientesReservas);
//   // }, 2000);
//   setTimeout(() => {
//     const clientesCalendar2 = clientesCalendar.map((c) => ({
//       cliente: c.cliente.replace("cliente:", "").trim().toLowerCase(),
//       fecha: c.fecha.replace("start:", "").trim().toLowerCase(),
//       precio: c.precio.replace("precio: ", "").trim().toLowerCase(),
//       moneda: c.moneda.trim().toLowerCase(),
//     }));

//     const clientesCards = new Set(
//       reservas.map((c) => c.cliente.trim().toLowerCase()),
//     );

//     const clientesCards3 = reservas.map((c) => ({
//       cliente: c.cliente.toLowerCase(),
//       fecha: c.fecha.replace("fecha:", "").toLowerCase(),
//       precio: c.precio.replace(`${moneda} `, "").trim().toLowerCase(),
//       moneda: moneda.trim().toLowerCase(),
//     }));
//     //console.log(clientesCards3);
//     // if (clientesCards.has(clientesCalendar2)) {
//     //   console.log("YA EXISTE:", clientesCalendar2);
//     // }
//     //console.log(clientesCalendar2);
//     // console.log(clientesCards3);
//     //console.log(moneda);
//     clientesCards3.forEach((calendar) => {
//       console.log(calendar.precio);
//     });
//     clientesCalendar2.forEach((calendar) => {
//       //console.log(`precio Calendario: ${calendar.precio}`);
//       const reserva2 = clientesCards3.find(
//         (card) => card.fecha === calendar.fecha,
//       );
//       if (!reserva2) {
//         modificados.push({
//           tipo: "nuevo",
//           datos: calendar,
//         });

//         return;
//       }

//       // const resultado = compararReservas(reserva2, calendar);

//       // //console.log(resultado);
//       // const cambios = Object.entries(resultado)
//       //   .filter(([_, igual]) => !igual)
//       //   .map(([campo]) => campo);

//       // console.log(cambios);

//       const resultado2 = compararReservas(reserva2, calendar);
//       console.log(resultado2);
//       Object.entries(resultado2)
//         .filter(([_, igual]) => !igual)
//         .forEach(([campo]) => {
//           cambios2.push(campo);
//         });

//       // cambios2.push({ = Object.entries(resultado2)
//       //   .filter(([_, igual]) => !igual)
//       //   .map(([campo]) => campo);

//       // if (cambios2.length > 0) {
//       //   console.log("Cambios detectados:", cambios2);
//       //   //   const datos = procesarEventoGoogle(ev);
//       //   // //console.log(datos);
//       //   // //console.log(index);

//       //   // const cliente = datos.cliente.toLowerCase();

//       //   // const fecha = datos.fechaInicio.toLowerCase();
//       // } else {
//       //   console.log("Sin cambios");
//       // }
//       //console.log(reserva2);
//       // const reserva = clientesCards3.find(
//       //   (card) =>
//       //     card.precio === calendar.precio && card.fecha === calendar.fecha,
//       // );
//       // console.log(reserva);
//       const cambioCliente = reserva2.precio !== calendar.precio;
//       if (cambioCliente) {
//         //console.log(`cambio: ${calendar.cliente}`);
//         modificados.push({
//           tipo: "modificado",
//           anterior: reserva2,
//           nuevo: calendar,
//         });
//       }
//       console.log(modificados);
//       if (clientesCards.has(calendar.cliente)) {
//         //console.log("YA EXISTE:", calendar);
//         return;
//       }
//       existe = clientesCards3.some(
//         (card) =>
//           card.cliente === calendar.cliente && card.fecha === calendar.fecha,
//       );

//       // if (existe) {
//       //   console.log("YA EXISTE:", calendar);
//       //   //return;
//       // } else {
//       //   //console.log("NO EXISTE:", calendar);
//       // }
//     });
//     const faltantes = clientesCalendar2.filter(
//       (calendar) =>
//         !clientesCards3.some(
//           (card) =>
//             card.cliente === calendar.cliente && card.fecha === calendar.fecha,
//         ),
//     );
//     noexiste = faltantes;

//     //console.log(noexiste[0].cliente);
//     //console.log(existe);
//     //if (existe) return;
//     //}, 2000);

//     // resultados.forEach((el) => {
//     //   console.log(el);
//     // });
//     //console.log(resultados);
//     // const clienteExiste = resultados.cliente;
//     // const fechaExiste = resultados.fecha;
//     // console.log(clienteExiste);
//     // console.log(fechaExiste);
//     // // resultados.forEach((ev) => {
//     // //   console.log(ev.cliente);
//     // //   clientes = ev.cliente;
//     // //   fechasInicio = ev.fechaInicio;
//     // // });
//     // //const clienteExiste = resultados[0].cliente;
//     // //const fechaExiste = resultados[0].fecha;
//     // console.log(clientesCalendar);
//     // //console.log(clienteExiste);
//     // //console.log(fechaExiste);
//     // console.log(resultados);
//     //console.log(reservas);
//     //console.log(`cliente: ${clientes} - fecha: ${fechasInicio}`);
//     //console.log(reservas);
//     //const select = document.getElementById("fechas");

//     // Limpiar opciones anteriores
//     //select.innerHTML = "";

//     // eventos.forEach((ev, index) => {
//     //   const fecha = ev.start.dateTime || ev.start.date;

//     //   const option = document.createElement("option");

//     //   option.value = index;
//     //   option.textContent = `${fecha} - ${ev.summary}`;

//     //   select.appendChild(option);
//     // });

//     // recorrer eventos originales
//     eventos.forEach((ev, index) => {
//       const datos = procesarEventoGoogle(ev);
//       //console.log(datos);
//       //console.log(index);

//       const cliente = datos.cliente.toLowerCase();
//       const fecha = datos.fechaInicio.toLowerCase();
//       const precio = datos.precio;
//       console.log(precio);

//       // verificar si existe
//       const existe = clientesCards3.some(
//         (card) =>
//           (card.cliente === cliente && card.fecha === fecha) ||
//           card.precio === precio,
//       );
//       console.log(existe);

//       // si YA existe → no agregar
//       if (existe) return;

//       if (cambios2.length > 0) {
//         console.log("Cambios detectados:", cambios2);
//         agregarOption(select, `${fecha} - ${cliente}`, 0);
//         //if (existe) return;
//         //   const datos = procesarEventoGoogle(ev);
//         // //console.log(datos);
//         // //console.log(index);

//         // const cliente = datos.cliente.toLowerCase();

//         // const fecha = datos.fechaInicio.toLowerCase();
//       } else {
//         console.log("Sin cambios");
//       }

//       // ✅ SOLO FALTANTES
//       // const option = document.createElement("option");

//       // option.value = index;
//       // option.textContent = `${fecha} - ${cliente}`;

//       // select.appendChild(option);
//     });

//     // Cuando cambia la selección
//     select.onchange = () => {
//       const eventoSeleccionado = eventos[select.value];
//       //console.log(eventoSeleccionado);
//       const datosProcesados = procesarEventoGoogle(eventoSeleccionado);
//       //console.log(datosProcesados.cliente);
//       //clientes = datosProcesados.cliente.toLowerCase();
//       clientes = noexiste[0].cliente;
//       fechasInicio = datosProcesados.fechaInicio.toLowerCase();
//       //console.log(`cliente: ${clientes} - fechaInicio: ${fechasInicio}`);

//       mostrarDatosGoogle(datosProcesados, nuevoNumero);
//     };
//   }, 2000);
// }

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
      normalizarNumero(reserva.precio) === normalizarNumero(calendar.precio),

    comida:
      normalizarBoolean(reserva.comida) === normalizarBoolean(calendar.comida),

    reservas:
      normalizarNumero(reserva.reservas) ===
      normalizarNumero(calendar.reservas),
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
function seleccionarCard(card) {
  if (!card) return;

  // si ya estaba seleccionada → deseleccionar
  if (card.dataset.selected === "true") {
    card.dataset.selected = "false";
    card.classList.remove("selected");
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

let a = "";
let b = "";
let scrolll = "";
const inicios = 85;
const target = 20;
let final = "";
//const TargetHeight = document.documentElement.offsetHeight - screen.height;
const TargetHeight = document.documentElement.offsetHeight - window.innerHeight;

function creaTop() {
  //if (location.href.includes('Menu-Cumen-Truck') || location.href.includes('index') || window.location.pathname.includes('index') || location.href.includes('bebidas') || window.location.pathname.includes('bebidas') || window.location.pathname.includes('Menu-Cumen-Truck'))
  //if (location.href.includes('Menu-Cumen-Truck') && location.href.includes('index') || window.location.pathname.includes('Menu-Cumen-Truck') && window.location.pathname.includes('index') || location.href.includes('bebidas') || window.location.pathname.includes('bebidas'))
  /* if (location.href.includes('index') && window.location.pathname.includes('index') || location.href.includes('bebidas') || window.location.pathname.includes('bebidas'))
        var destino = document.querySelector("main");
    else if (window.location.pathname.includes('about')) {
        destino = document.querySelector(".container");
    } */
  // if (window.location.pathname.includes('about')) {
  //     var destino = document.querySelector(".container");
  // } else {
  //     destino = document.querySelector("body");
  // }
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

function isBottomOfPage() {
  //return window.scrollY + window.innerHeight >= Math.round(document.documentElement.scrollHeight);
  return (
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight
  );
}

function topFunction() {
  //const mybutton = document.getElementById("myBtn");
  //document.body.scrollTop = 0; // For Safari
  //document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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

cargarDatos();
