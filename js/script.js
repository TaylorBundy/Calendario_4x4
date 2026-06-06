// ================================================================================
// Variables de los elementos
// ================================================================================
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
const img = document.querySelector(".imgElimina");
const eleEdita = document.querySelector(".editaClientes");
const eleCarga = document.querySelector(".cargaClientes");
const recargar = document.querySelector(".recargar");
const select = document.getElementById("fechas");
const editaPrecio = document.getElementById("editaPrecio").value;
const lala = editaPrecio.split(" ");
const btnModal = document.querySelector("#btnModal");
const btnOcultas = document.querySelector("#btnOcultas");
select.selectedIndex = -1;
const todasCards = document.querySelectorAll("#card");
const contenedorReservas = document.querySelector(".reservasContainer");

const plataforma = navigator.userAgent;
const urlObj = new URL(window.location.toString());
const domain = urlObj.hostname;

// ================================================================================
// Variables para los eventos obtenidos de google calendar
// ================================================================================
let eventosAnteriores = [];
let primeraCarga = true;
let datos = [];
let eventosCalen = [];
let descripciones = [];
let intervaloCalendario = null;
let verificacionesSinCambios = 0;

const API = "https://calendario-4x4.onrender.com";
let urlJSON = null;
let urlImgGuardar =
  "https://cdn-user-icons.flaticon.com/233151/233151078/1780043782244.svg?token=exp=1780044694~hmac=d74b04b0362edc479cfa0013111c5e51";

let clientes = [];
let fechasInicio = null;
//const cambios2 = [];
const clientesCalendar = [];
const reservas = [];
const modificados = [];
let nuevo;
let idFaltante;
let ultimoID;
const datosNuevos = [];
let fechaFin = null;
let existe = null;
let noexiste = null;
let globalIndex = 0;
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
let origenJSON = null;
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
let tarjetaSeleccionada = null;
let textoTooltip = null;
const visibles = [];
const ocultas = [];
let a = "";
let b = "";
let scrolll = "";
const inicios = 85;
const target = 20;
let final = "";
let alertaEmitida = false;
let audioHabilitado = false;
const audioAlerta = document.querySelector("#alerta"); //new Audio("sounds/alarma.ogg");
const audioAlertaGoogle = new Audio("sounds/notify.mp3");
let intervaloAlarma = null;
let alarmaRepetida = 0;
const reservasManana = [];
let volvemosVerificar = false;
//const TargetHeight = document.documentElement.offsetHeight - screen.height;
const TargetHeight = document.documentElement.offsetHeight - window.innerHeight;
const ahora = new Date();
const fechaHoy =
  ahora.getFullYear() +
  "-" +
  String(ahora.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(ahora.getDate()).padStart(2, "0");
let fechaFormateada = null;
let horaActual = new Date().toLocaleTimeString("es-AR");

//let indiceSelect = null;
const API_KEY = "AIzaSyAVearlKR2iIcQd2eeS8zXqiKB2OITgIxU";
const CALENDAR_ID = "diegomartinbarbosa2@gmail.com";

const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;
let precioMatch = null;
let moneda;
const TITULOS = {
  cliente: "Ingrese el nombre del cliente u organizador.",
  fechaInicio: `Ingrese la fecha de inicio de la excursión.`,
  fechaFin: `Ingrese la fecha final de la excursión.`,
  vehiculosClientes: `Ingrese la cantidad de vehículos.`,
  vehiculosOrg: `Ingrese la cantidad de vehículos organizadores.`,
  precio: `Ingrese el precio acordado.`,
  importeSeña: `Ingrese el importe de la seña recibida.`,
  comida: `Seleccionar si incluye comida.`,
  seña: `Seleccionar si deja seña.`,
  guardar: `Click para guardar cliente nuevo.`,
  editaCliente: `Introduzca el nombre nuevo del cliente para actualizar.`,
  editaFechaInicio: `Ingrese la fecha de inicio de la excursión.`,
  editaFechaFin: `Ingrese la fecha final de la excursión.`,
  editaVehiculosClientes: `Ingrese la cantidad de vehículos. Si no hay cambios, deje el mismo número que antes.`,
  editaVehiculosOrg: `Ingrese la cantidad de vehículos. Si no hay cambios, deje el mismo número que antes.`,
  editaPrecio: `Ingrese el precio acordado. Si no hay cambios, deje el mismo número que antes.`,
  editaComida: `Seleccionar si incluye comida. Si no hay cambios, deje la misma opción que antes.`,
  editaSeña: `Seleccionar si deja seña. Si no hay cambios, deje la misma opción que antes.`,
  editaImporteSeña: `Ingrese el importe de la seña recibida. Si no hay cambios, deje el mismo número que antes.`,
  editaElimina: `Click para eliminar esta reserva. Se eliminará permanentemente del calendario y no se podrá recuperar. Use esta opción solo si está seguro de que desea eliminar la reserva.`,
};

// ================================================================================
// Funcion para procesar la descripción del evento y extraer información relevante
// ================================================================================
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
  // const vehiculosMatch = texto.match(
  //   /(\d+)\s*veh[ií]culos?(?!\s*organizadores)|vehiculos/i,
  // );
  const vehiculosMatch = texto.match(
    /(\d+)\s*(?:veh[ií]culos?|camionetas?|chatas?)(?!\s*organizadores)/i,
  );
  //console.log(vehiculosMatch);

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
  // const patronesPrecio = [
  //   /(\d+)\s*(usd|u\$s|d[oó]lares?|dolares|pesos?)\s*por\s*veh[ií]culo/i,

  //   /precio\s*(?:pactado|por\s*veh[ií]culo)?[:\s]*\$?\s*(\d+)/i,

  //   /\$\s*(\d+)/i,
  // ];
  const patronesPrecio = [
    /(\d+)\s*(?:cada\s*uno|c\/u|por\s*persona|por\s*veh[ií]culo)/i,

    /(\d+)\s*(usd|u\$s|d[oó]lares?|dolares|pesos?)\s*por\s*veh[ií]culo/i,

    /precio\s*(?:pactado|por\s*veh[ií]culo)?[:\s]*\$?\s*(\d+)/i,

    /\$\s*(\d+)/i,
  ];
  precioMatch = null;

  for (const regex of patronesPrecio) {
    const match = texto.match(regex);

    if (match) {
      precioMatch = match;
      break;
    }
  }
  //console.log(precioMatch);

  // if (precioMatch) {
  //   resultado.precio = Number(precioMatch[1]);

  //   if (precioMatch[2]) {
  //     moneda = precioMatch[2].toLowerCase();

  //     if (
  //       moneda.includes("usd") ||
  //       moneda.includes("u$s") ||
  //       moneda.includes("dólar") ||
  //       moneda.includes("dolar") ||
  //       moneda.includes("dolares") ||
  //       moneda.includes("dólares")
  //     ) {
  //       moneda = "USD";
  //       resultado.moneda = "USD";
  //     } else if (moneda.includes("peso")) {
  //       moneda = "ARS";
  //       resultado.moneda = "ARS";
  //     }
  //   }
  // }
  if (precioMatch) {
    resultado.precio = Number(precioMatch[1]);
    //console.log(precioMatch[2]);

    if (precioMatch[2]) {
      moneda = precioMatch[2].toLowerCase();
      //console.log(moneda);

      if (
        moneda.includes("usd") ||
        moneda.includes("u$s") ||
        moneda.includes("dólar") ||
        moneda.includes("dolar") ||
        moneda.includes("dolares") ||
        moneda.includes("dólares") ||
        moneda.includes("USD")
      ) {
        resultado.moneda = "USD";
      } else if (moneda.includes("peso") || moneda.includes("pesos")) {
        resultado.moneda = "ARS";
      }
    } else if (/cada\s*uno|c\/u|por\s*persona|por\s*veh[ií]culo/i.test(texto)) {
      // Si no se especificó moneda, asumimos USD
      resultado.moneda = "USD";
    }
  }
  //console.log(resultado.moneda);
  // =========================
  // COMIDA
  // =========================
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

// ================================================================================
// Función para mostrar u ocultar reservas ocultas
// ================================================================================
btnOcultas.addEventListener("click", () => {
  const visible = lista2.style.display === "block";

  if (visible) {
    lista2.style.display = "none";
    mostrarDatos2(lista2, false);
    //btnOcultas.textContent = "Mostrar reservas ocultas";
    btnOcultas.innerHTML = `
    <img class="imgElimina" src="">Mostrar reservas ocultas`;
    //actualizar.textContent = "guardar";
    cambiarImagen(btnOcultas);
  } else {
    lista2.style.display = "block";
    mostrarDatos2(lista2, true);
    btnOcultas.innerHTML = `
    <img class="imgElimina" src="">Ocultar reservas ocultas`;
    //actualizar.textContent = "guardar";
    cambiarImagen(btnOcultas);
  }
});

// ================================================================================
// Separar reservas visibles de las ocultas según la fecha de fin
// ================================================================================
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

// ================================================================================
// MOSTRAR U OCULTAR BOTÓN
// ================================================================================
function muestraBoton() {
  if (ocultas.length === 0) {
    btnOcultas.style.display = "none";
  } else {
    btnOcultas.style.display = "flex";
  }
}

// ================================================================================
// Función para restar días a una fecha
// (útil para eventos de todo el día que terminan al día siguiente)
// ================================================================================
function restarDias(fechaInicio, fechaFin, dias) {
  // Si son iguales, devolver la misma fecha
  if (fechaInicio === fechaFin) {
    return fechaFin;
  }

  const nuevaFecha = new Date(fechaFin);

  nuevaFecha.setDate(nuevaFecha.getDate() - dias);

  return nuevaFecha.toISOString().split("T")[0];
}

// ================================================================================
// Función para formatear fechas en formato yyyy-mm-dd (compatible con input type="date")
// ================================================================================
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

function crearFechaLocal(fechaStr) {
  const [anio, mes, dia] = fechaStr.split("-").map(Number);

  return new Date(anio, mes - 1, dia);
}

// ================================================================================
// Función para cargar eventos desde Google Calendar, procesarlos y almacenarlos
// en el formato necesario para la aplicación
// ================================================================================
async function cargarEventosGoogle(url) {
  try {
    // limpiar antes de recargar
    clientesCalendar.length = 0;
    //descripciones.length = 0;

    // limpiar select
    select.innerHTML = "";
    delete select.dataset.placeholderAgregado;

    const res = await fetch(url);

    const data = await res.json();
    //console.log(data.items);

    eventosCalen.length = 0;
    eventosCalen.push(data);

    const items = data.items || [];
    if (!primeraCarga) {
      const cambios = detectarCambios(eventosAnteriores, items);
      const sinCambios =
        cambios.agregados.length === 0 &&
        cambios.modificados.length === 0 &&
        cambios.eliminados.length === 0;

      if (sinCambios) {
        mostrarNotificacion(
          `Se detectaron ${cambios.agregados.length} cambios ➕ agregados en Google Calendar.<br>Se detectaron ${cambios.modificados.length} cambios ✏️ modificados en Google Calendar.<br>Se detectaron ${cambios.eliminados.length} cambios ❌ eliminados en Google Calendar.`,
          3000,
        );
        verificacionesSinCambios++;
        if (verificacionesSinCambios >= 3) {
          setTimeout(() => {
            preguntarContinuarMonitor();
          }, 3000);
          verificacionesSinCambios = 0;
        }
        //preguntarContinuarMonitor();
      } else {
        let mensaje = "";
        verificacionesSinCambios = 0;
        reproducirAlertaSonora("google");

        if (cambios.agregados.length) {
          mensaje += `➕ Agregados: ${cambios.agregados.length}<br>`;

          cambios.agregados.forEach((ev) => {
            mensaje += `   • ${ev.summary}<br>`;
          });
        }

        if (cambios.modificados.length) {
          mensaje += `✏️ Modificados: ${cambios.modificados.length}<br>`;

          cambios.modificados.forEach((ev) => {
            mensaje += `   • ${ev.summary}<br>`;
          });
        }

        if (cambios.eliminados.length) {
          mensaje += `❌ Eliminados: ${cambios.eliminados.length}<br>`;

          cambios.eliminados.forEach((ev) => {
            mensaje += `   • ${ev.summary}<br>`;
          });
        }

        if (mensaje) {
          mostrarNotificacion(mensaje, 5000);
        }
      }
    }

    eventosAnteriores = structuredClone(items);
    primeraCarga = false;

    items.forEach((ev) => {
      const fechaIn = ev?.start.date || ev?.start.dateTime;

      const fechaFn = ev?.end.date || ev?.end.dateTime;

      const nomCli = ev?.summary;

      const descrip = procesarDescripcionEvento(ev?.description) || null;
      //console.log(descrip);

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
      // console.log(
      //   `Cliente: ${nomCli} - Precio: ${descrip?.precio} - Moneda: ${descrip?.moneda}`,
      // );

      clientesCalendar.push({
        id: ev?.id.toLowerCase().trim(),

        cliente: `cliente: ${nomCli}`,

        fechaInicio: fechaFormateada,

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

// ================================================================================
// Función para verificar cambios en el calendario comparando los eventos actuales con los anteriores
// ================================================================================
function detectarCambios(viejos, nuevos) {
  const mapaViejos = new Map(viejos.map((e) => [e.id, e.updated]));

  const agregados = [];
  const modificados = [];

  nuevos.forEach((evento) => {
    if (!mapaViejos.has(evento.id)) {
      agregados.push(evento);
    } else if (mapaViejos.get(evento.id) !== evento.updated) {
      modificados.push(evento);
    }
  });
  const idsNuevos = new Set(nuevos.map((e) => e.id));

  const eliminados = viejos.filter((e) => !idsNuevos.has(e.id));

  return {
    agregados,
    modificados,
    eliminados,
  };
}

// ================================================================================
// Función para mostrar notificaciones en pantalla con un mensaje personalizado
// y duración configurable
// ================================================================================
function mostrarNotificacion(mensaje, tiempo = 5000) {
  const div = document.createElement("div");

  //div.textContent = mensaje;
  div.innerHTML = mensaje;

  div.style.position = "fixed";
  div.style.top = "20px";
  div.style.right = "20px";
  div.style.padding = "15px";
  div.style.background = "#ff9800";
  div.style.color = "#fff";
  div.style.borderRadius = "8px";
  div.style.zIndex = "999999";

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, tiempo);
}

// setInterval(
//   () => {
//     mostrarNotificacion("Revisando cambios en Google Calendar...", 2000);
//     setTimeout(() => {
//       cargarEventosGoogle(url);
//     }, 2000);
//   },
//   1 * 30 * 1000,
// );

// ================================================================================
// Funciones para iniciar y detener el monitor de Google Calendar,
// que revisa cambios cada 5 minutos
// ================================================================================
function iniciarMonitorCalendario() {
  if (intervaloCalendario) return;

  intervaloCalendario = setInterval(
    () => {
      mostrarNotificacion("Revisando cambios en Google Calendar...", 2000);

      setTimeout(() => {
        cargarEventosGoogle(url);
      }, 2000);
    },
    5 * 60 * 1000,
  );
}

// ================================================================================
// Función para detener el monitor de Google Calendar,
// deteniendo el intervalo de revisión de cambios
// ================================================================================
function detenerMonitorCalendario() {
  clearInterval(intervaloCalendario);

  intervaloCalendario = null;

  console.log("Monitor de Google Calendar detenido.");
}

// ================================================================================
// Función para preguntar al usuario si desea continuar monitoreando Google Calendar
// ================================================================================
function preguntarContinuarMonitor() {
  const overlay = document.createElement("div");

  overlay.innerHTML = `
    <div class="modalPregunta">

      <h3>
        No se detectaron cambios
      </h3>

      <p>
        ¿Deseás seguir monitoreando
        Google Calendar?
      </p>

      <button id="btnContinuar">
        Continuar
      </button>

      <button id="btnDetener">
        Detener
      </button>

    </div>
  `;

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
  `;

  document.body.appendChild(overlay);
  // ⏱️ Temporizador de 30 segundos
  const timeoutMonitor = setTimeout(() => {
    console.log("No hubo respuesta en 30 segundos. Deteniendo monitoreo...");

    detenerMonitorCalendario();

    overlay.remove();
  }, 30000);

  document.querySelector("#btnContinuar").addEventListener("click", () => {
    overlay.remove();

    console.log("Continuando monitoreo...");
  });

  document.querySelector("#btnDetener").addEventListener("click", () => {
    detenerMonitorCalendario();

    overlay.remove();
  });
}

// ================================================================================
// Función para reconstruir el array de reservas a partir del DOM,
// útil para mantener el estado actualizado después de cargar eventos desde Google Calendar
// o al recargar la página
// ================================================================================
function reconstruirReservasDesdeDOM() {
  reservas.length = 0;

  const mapa = {};

  lista.querySelectorAll(".divcontainer").forEach((card) => {
    const card2 = card.closest("[data-card-id]");

    reservas.push({
      cardID: card2.dataset.id,

      cliente: card.querySelector("h2")?.textContent.trim(),

      fechaInicio: card
        .querySelector("#fechaInicio")
        ?.textContent.toLowerCase(),

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

// ================================================================================
// Función para comparar los datos de una card con el array de reservas y cargar
// la información en el formulario de edición si se encuentra una coincidencia,
// o limpiar el formulario si no se encuentra
// ================================================================================
window.addEventListener("DOMContentLoaded", async () => {
  await cargarEventosGoogle(url);
  iniciarMonitorCalendario();

  reconstruirReservasDesdeDOM();

  if (plataforma.includes("Android")) {
    creaTop();
    window.onscroll = function () {
      scrollFunction();
    };
  }
  if (!domain.includes("github.io")) {
    urlJSON = "data/data.json";
    origenJSON = urlJSON;
    // urlJSON =
    //   "https://raw.githubusercontent.com/TaylorBundy/Calendario_4x4/main/data/data.json";
  } else {
    urlJSON =
      "https://raw.githubusercontent.com/TaylorBundy/Calendario_4x4/main/data/data.json";
    const resultado = urlJSON.substring(urlJSON.indexOf("TaylorBundy"));
    origenJSON = resultado;
  }
  volvemosVerificar = true;
  cargarDatosDesde(urlJSON);
  setTimeout(() => {
    const numeros = obtenerNumeros();
    numeroInicial = numeros.mayor;
    lista2.style.display = "none";
    document.querySelectorAll("#card").forEach((card) => {
      //console.log(card);
      card.addEventListener("click", () => {
        compararCards(card);
        // if (!card.dataset.selected === "true") {
        //   select.selectedIndex = 0;
        // }
      });
    });
    const inputCliente = document.querySelectorAll("input");
    inputCliente.forEach((input) => {
      input.addEventListener("mouseover", () => {
        agregarTitulo(input, TITULOS[input.id]);
      });
    });
    //if (plataforma.includes("Android")) {
    contenedorReservas.click();
    //}
    //muestraBoton();
  }, 1000);
  audioHabilitado = true;

  //console.log(reservas);
  validarFormulario();
  const ele = eleEdita.querySelectorAll("input");
  ele.forEach((el) => {
    if (el.type === "text" || el.type === "number") {
      if (el.value === "") {
        //console.log(el);
        actualizar.disabled = true;
        actualizar.classList.add("desactive");
        //agregarTooltip(actualizar, "Guardar cambios");
        //actualizar.style.background = "#888";
        //actualizar.style.cursor = "wait";
      }
    }
  });
  const ele2 = eleCarga.querySelectorAll("input");
  ele2.forEach((el) => {
    el.addEventListener("input", validarFormulario);
    el.addEventListener("change", validarFormulario);
  });
});

// ================================================================================
// Función para validar el formulario de carga de reservas, habilitando o deshabilitando
// el botón de guardar según si todos los campos requeridos están completos
// ================================================================================
function validarFormulario() {
  const cliente = document.getElementById("cliente").value.trim();
  const fechaInicio = document.getElementById("fechaInicio").value.trim();
  const fechaFin = document.getElementById("fechaFin").value.trim();
  const precio = document.getElementById("precio").value.trim();

  const habilitado = cliente && fechaInicio && fechaFin && precio;

  guarda.disabled = !habilitado;
  if (habilitado) {
    guarda.classList.remove("desactive");
    guarda.classList.add("active");
  } else {
    guarda.classList.add("desactive");
    guarda.classList.remove("active");
    //guarda.title = "Completa todos los campos para habilitar el botón";
  }

  //guarda.disabled = !(cliente && fechaInicio && fechaFin && precio);
  //guarda.classList.add("desactive");
}

// ================================================================================
// Función para agregar un tooltip a un elemento, mostrando un texto al pasar el mouse por encima
// ================================================================================
function agregarTooltip(elemento, texto) {
  //console.log(texto);
  if (!elemento) return;

  elemento.addEventListener("mouseover", () => {
    elemento.title = texto;
  });
}

// ================================================================================
// Función para agregar un tooltip permanente a un elemento, estableciendo el atributo title
// con el texto proporcionado
// ================================================================================
function agregarTitulo(elemento, texto) {
  //console.log(texto);
  if (!elemento) return;

  elemento.title = texto;
}

// ================================================================================
// Función para contar el total de registros visibles (no ocultos) en el array de datos
// ================================================================================
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

// ================================================================================
// Función para comparar los datos de una card con el array de reservas y cargar la información
// en el formulario de edición si se encuentra una coincidencia,
// o limpiar el formulario si no se encuentra
// ================================================================================
function cargarEnFormulario(dato, index, indiceAnteriors) {
  //console.log(dato.precio);
  //console.log(tarjetaSeleccionada.dataset.id);
  const buscamosbtneliminar = tarjetaSeleccionada.querySelector(".btnelimina");
  // console.log(buscamosbtneliminar);
  // console.log(indiceAnteriors);
  // console.log(indiceNuevo);
  // console.log(indiceEditando);
  // console.log(indiceAnterior);

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
  const comida =
    dato.comida === true ||
    dato.comida === "Sí" ||
    dato.comida === "Si" ||
    dato.comida === "true";
  //console.log(comida);

  const sena =
    dato.sena === true ||
    dato.sena === "Sí" ||
    dato.sena === "Si" ||
    dato.sena === "true";

  //const longitud = dato?.precio;
  const longitud = String(dato?.precio || "").length;
  //console.log(longitud);
  const moneda = longitud > 3 ? "ARS" : "USD";
  // if (longitud.length <= 3) {
  //   moneda = "USD";
  // } else if (longitud.length > 3) {
  //   moneda = "ARS";
  // }

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
  const nuevoPrecio = String(dato?.precio);
  document.getElementById("editaFechaFin").value = dato?.fechaFin;
  document.getElementById("editaVehiculosClientes").value = dato?.vc || "";
  document.getElementById("editaVehiculosOrg").value = dato?.vo || "";
  document.getElementById("editaComida").checked = comida;
  document.getElementById("editaPrecio").value =
    `${moneda} ${nuevoPrecio || ""}`;
  document.getElementById("editaSeña").checked = sena;
  document.getElementById("editaImporteSeña").value = dato?.senaRecibida || "";
  document.querySelector(`.clienteSel`).textContent =
    `Editar Cliente Seleccionado: ${dato.cliente}`;
  actualizar.classList.remove("desactive");
  actualizar.classList.add("active");
  actualizar.disabled = false;
  // guarda.classList.remove("desactive");
  // guarda.classList.add("active");
  // guarda.disabled = false;
  //cambiarImagen(actualizar);
  //console.log(idSeleccionado);

  indiceEditando = index;
  indiceNuevo = indiceEditando;

  let elementoSelected;
  // console.log(estado);
  // console.log(origen);
  if (buscamosbtneliminar.textContent === "Actualizar") {
    //actualizar.textContent = "Actualizar";
    actualizar.innerHTML = `
    <img class="imgElimina" src="">Actualizar`;
    //actualizar.textContent = "guardar";
    cambiarImagen(actualizar);
    agregarTooltip(actualizar, "Click para actualizar la reserva");
  } else if (buscamosbtneliminar.textContent.includes("Guardar" || "guardar")) {
    actualizar.innerHTML = `
    <img class="imgElimina" src="">guardar`;
    //actualizar.textContent = "guardar";
    agregarTooltip(actualizar, "Click para guardar los cambios");
    cambiarImagen(actualizar);
  } else if (buscamosbtneliminar.textContent === "Eliminar") {
    actualizar.innerHTML = `
    <img class="imgElimina" src="">Actualizar`;
    //actualizar.textContent = "guardar";
    agregarTooltip(actualizar, "Click para actualizar la reserva");
    cambiarImagen(actualizar);
  }
  if (origen === "select") {
    document.querySelectorAll("#card").forEach((card) => {
      // console.log(card);
      //card.classList.remove("selected");
      // if (
      //   card.className.includes("nuevo") &&
      //   !card.dataset.selected == "true"
      // ) {
      //   actualizar.textContent = "guardar";
      // }
      // if (
      //   card.dataset.selected == "true" &&
      //   !card.className.includes("nuevo")
      // ) {
      //   actualizar.textContent = "Actualizar";
      // }
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

  // if (indiceNuevo != indiceAnterior) {
  //   // console.log(`linea390`);
  //   indiceNuevo = index;
  //   indiceAnterior = indiceNuevo;
  // } else if (indiceNuevo == indiceAnterior) {
  //   if (
  //     indiceEditando == indiceAnterior &&
  //     elementoActual.dataset.selected == "false"
  //   ) {
  //     document.querySelector(`.clienteSel`).textContent =
  //       `Editar Cliente Seleccionado:`;
  //     limpiarFormulario(eleEdita);
  //     // console.log("linea525");
  //     actualizar.classList.remove("active");
  //     actualizar.classList.add("desactive");
  //     actualizar.disabled = true;
  //     if (btnEliminar.checked) {
  //       btnEliminar.checked = false;
  //     }
  //   }
  // }
}

// ================================================================================
// Funcion para mostrar datos en el DOM
// ================================================================================
function mostrarDatos(ejecutarAlertas = true) {
  // console.log(globalIndex);
  // if (ocultas.length > 0) {
  //   globalIndex = globalIndex--;
  // }
  //globalIndex = 0;
  lista.innerHTML = "";

  datos.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
  const ahora = new Date();

  const datosVisibles = datos.filter((d) => {
    //const fechaFin = new Date(d.fechaFin);
    const fechaFin = crearFechaLocal(d.fechaFin);

    fechaFin.setHours(23, 59, 0, 0);
    //console.log(formatearFecha(ahora));
    //console.log(formatearFecha(fechaFin));

    return ahora < fechaFin;
  });
  //console.log(datosVisibles);
  const agrupados = agruparPorFecha(datosVisibles);
  //const agrupados = agruparPorFecha(datos);

  Object.entries(agrupados).forEach(([fechaGrupo, items]) => {
    let contenedorActual = lista;

    // solo grupos repetidos
    if (items.length > 1) {
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

    items.forEach((d) => {
      const div = document.createElement("div");
      const divContainer = document.createElement("div");
      divContainer.className = "divcontainer";
      const imgContainer = document.createElement("div");
      imgContainer.className = "imgContainerLista";
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
    <button class="btnelimina" id="${d.id}"><img class="imgElimina" src="images/eliminar.avif">Eliminar</button>
    
    `;
      const longitud = d?.precio;
      //console.log(longitud);
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
      //console.log(fechafinal);

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
      const tituloCliente = divContainer.querySelector(".elCliente");
      tituloCliente.addEventListener("mouseover", () => {
        agregarTitulo(tituloCliente, tituloCliente.textContent.trim());
      });
      divContainer.querySelectorAll(".datosTitulos").forEach((el) => {
        el.addEventListener("mouseover", () => {
          //el.title = el.textContent;
          agregarTitulo(el, el.textContent.trim());
        });
      });
      // 👉 CLICK PARA EDITAR
      divContainer.addEventListener("click", (e) => {
        // console.log(comidaCheck);
        // console.log(señaCheck);
        idSeleccionado = d.id;
        //console.log(idSeleccionado);
        idCard2 = idSeleccionado;
        // console.log(e.target.closest('div[id="card"]'));
        //const card = e.target.closest("#card");
        const card = e.target.closest("[data-card-id]");
        tarjetaSeleccionada = card;
        elementoEliminar = card;
        if (!card) return;
        const form = document.querySelector(".editaClientes");
        const btnElimina = div.querySelector(`.btnelimina`);
        //console.log(btnElimina);
        // console.log(form);
        if (btnElimina.textContent == "Actualizar") {
          actualizar.textContent = "Actualizar";
        }
        seleccionarCard(card, eleEdita);
        verificarCardYSelect();
        seleccionarOptionPorCard(d);
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

      // Verificar si la reserva comienza mañana
      verificarAlertaReserva(fechafinal, d.fechaFin, div);

      const btnElimina = div.querySelector(`.btnelimina`);

      if (btnElimina.textContent == "Eliminar") {
        textoTooltip = "Click para eliminar la reserva";
      } else if (btnElimina.textContent == "Actualizar") {
        textoTooltip = "Click para actualizar la reserva";
      }
      agregarTooltip(btnElimina, textoTooltip);
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
            delete select.dataset.placeholderAgregado;
            select.selectedIndex = 0;
            option.remove();
          }
          (async () => {
            await cargarEventosGoogle(url);
          })();
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
            if (resultado.status === "ok") {
              recargarEn5Minutos();
              limpiarFormulario(eleEdita);
            }
          })();
          if (option) {
            delete select.dataset.placeholderAgregado;
            select.selectedIndex = 0;
            option.remove();
          }
        }
      });
      globalIndex++;
      // ACA TERMINA EL FOREACH
    });
    //lista.appendChild(contenedorActual);
    ordenarPorFecha();
    //globalIndex = 0;
  });
}

// ================================================================================
// Función para mostrar datos en el DOM, con opción de mostrar solo visibles u ocultas
// según la fecha de fin
// ================================================================================
function mostrarDatos2(listaDestino, mostrarOcultas = false) {
  //console.log(listaDestino);

  const card22 = document.querySelectorAll("#card");
  //console.log(card22.length);
  globalIndex = card22.length + 1;
  //console.log(globalIndex);
  listaDestino.innerHTML = "";
  let contenedorActual = listaDestino;

  // 👉 Título solo para la lista de fechas finalizadas
  if (mostrarOcultas) {
    const titulo = document.createElement("h2");
    titulo.textContent = "Fechas finalizadas";
    titulo.className = "titulo-fecha"; // opcional para CSS
    const grupo = document.createElement("div");
    grupo.className = "grupo-fecha";
    const cardsGrupo = document.createElement("div");
    cardsGrupo.className = "cards-grupo-finalizadas";
    //cardsGrupo.appendChild(titulo);
    //grupo.appendChild(cardsGrupo);

    listaDestino.appendChild(titulo);
    listaDestino.appendChild(cardsGrupo);
    contenedorActual = cardsGrupo;
  }

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
      imgContainer.className = "imgContainerLista";
      const imgDiv = document.createElement("img");
      imgDiv.className = "img";
      imgDiv.src = "images/fondo-transparente.webp";
      const radio = document.createElement("input");
      radio.type = "radio";
      div.className = `card-${globalIndex}`;
      div.id = "card";
      div.dataset.id = `card-${globalIndex}`;
      div.dataset.cardId = `card-${globalIndex}`;
      //div.appendChild(divContainer);
      div.innerHTML = `
    <button class="btnelimina" id="${d.id}"><img class="imgElimina" src="images/eliminar.avif">Eliminar</button>
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
      const tituloCliente = divContainer.querySelector(".elCliente");
      tituloCliente.addEventListener("mouseover", () => {
        agregarTitulo(tituloCliente, tituloCliente.textContent.trim());
      });
      divContainer.querySelectorAll(".datosTitulos").forEach((el) => {
        el.addEventListener("mouseover", () => {
          //el.title = el.textContent;
          agregarTitulo(el, el.textContent.trim());
        });
      });
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
        verificarCardYSelect();
        seleccionarOptionPorCard(d);
        tarjetaSeleccionada = card;
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
      contenedorActual.appendChild(div);

      //console.log(div);

      // lista.insertBefore(document.querySelector(`#card`), divContainer);

      const btnElimina = document.querySelector(`#${d.id}`);
      //console.log(btnElimina);
      if (btnElimina.innerHTML.includes("Eliminar")) {
        textoTooltip = "Click para eliminar la reserva";
      } else if (btnElimina.innerHTML.includes("Actualizar")) {
        textoTooltip = "Click para actualizar la reserva";
      }
      agregarTooltip(btnElimina, textoTooltip);
      btnElimina.addEventListener("click", (e) => {
        const option = select.options[select.selectedIndex];
        const lala = document.getElementById("editaPrecio").value.split(" ");
        const card = e.target.closest("#card");

        //console.log(d.id);
        idSeleccionado = d.id;
        idCard = idSeleccionado;
        idCard2 = btnElimina.id;
        if (btnElimina.innerHTML.includes("Eliminar")) {
          elementoEliminar = card;
          (async () => {
            await eliminar();
            recargarEn5Minutos();
            limpiarFormulario(eleEdita);
            eliminarCard(elementoEliminar);
          })();
          //console.log(d.id);
          // console.log("eliminar");
          if (option) {
            delete select.dataset.placeholderAgregado;
            select.selectedIndex = 0;
            option.remove();
          }
          (async () => {
            await cargarEventosGoogle(url);
          })();
        } else if (btnElimina.innerHTML.includes("Actualizar")) {
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
            if (resultado.status === "ok") {
              recargarEn5Minutos();
              limpiarFormulario(eleEdita);
            }
          })();
          //console.log(idCard2);
          //console.log(nuevo);
          if (option) {
            delete select.dataset.placeholderAgregado;
            select.selectedIndex = 0;
            option.remove();
          }
          (async () => {
            await cargarEventosGoogle(url);
          })();
        }
      });
      globalIndex++;
      //console.log(btnElimina);
    });
  ordenarPorFecha();
  //});
}

// ================================================================================
// Funcion para agrupar por fecha
// ================================================================================
function agruparPorFecha(datos) {
  //console.log(datos);
  return datos.reduce((acc, item) => {
    const fecha = item.fechaInicio;
    //const fecha2 = formatearFecha(item.fechaInicio);
    //console.log(fecha2);

    if (!acc[fecha]) {
      acc[fecha] = [];
    }

    acc[fecha].push(item);

    return acc;
  }, {});
}

// ================================================================================
// Función para mostrar datos de Google Calendar en el DOM, con lógica para verificar
// si el cliente ya existe en las reservas
// y para formatear las fechas correctamente
// ================================================================================
function mostrarDatosGoogle(d, index = 0) {
  // const todasCards = document.querySelectorAll("#card");
  // console.log(todasCards.length);
  // console.log(ocultas);
  // if (ocultas) {
  //   nuevoNumero = ocultas.length + visibles.length;
  // } else {
  //   nuevoNumero = nuevoNumero;
  // }
  //console.log(nuevoNumero);
  //console.log(d);
  //console.log(d.cliente.toLowerCase());

  // reservas.forEach((el) => {
  //   console.log(el);
  // });
  setTimeout(() => {
    if (clientes === "patagonia 4x4") {
    } else {
      if (estado === "NO EXISTE") return;
      const resultados = reservas.filter((r) =>
        r.cliente.includes(nuevo.cliente),
      );
      //       const resultados = reservas.filter((r) =>
      //   clientes.some((cliente) =>
      //     r.cliente.toLowerCase().includes(cliente)
      //   )
      // );
      //const cliente = clientes.find(c => c.cliente.toLowerCase() === nuevo.cliente.toLowerCase());
      //console.log(cliente);
      //const resultados = reservas.filter((r) => clientes.some((c) => c.cliente.toLowerCase() === r.cliente.toLowerCase()));
      //console.log(resultados);
      //const resultados3 = reservas.some((r) => r.cliente.includes(clientes));
      const resultados3 = reservas.some((r) =>
        clientes.some((cliente) => r.cliente.toLowerCase().includes(cliente)),
      );
      if (resultados) {
        const clienteExiste = clientes.find(
          (c) => c.cliente.toLowerCase() === nuevo.cliente.toLowerCase(),
        );
        const fechaExiste = resultados[0].fechaInicio;
        // console.log(clienteExiste);
        // console.log(fechaExiste);
        estado = "EXISTE";
        if (clienteExiste && fechaExiste) return;
      }
      // if (resultados3) {
      //   const clienteExiste = reservas.has(resultados3.toLowerCase().trim());
      //   const fechaExiste = resultados[0].fecha;
      //   if (clienteExiste && fechaExiste) return;
      // }
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
  //console.log(fecha2);

  const div = document.createElement("div");
  const divContainer = document.createElement("div");

  divContainer.className = "divcontainer";

  const imgContainer = document.createElement("div");
  imgContainer.className = "imgContainerLista";

  const imgDiv = document.createElement("img");
  imgDiv.className = "img";
  imgDiv.src = "images/fondo-transparente.webp";

  div.className = `card-${nuevoNumero}`;

  div.classList.add("nuevo");
  div.dataset.id = `card-${nuevoNumero}`;
  div.dataset.cardId = `card-${nuevoNumero}`;
  div.id = "card";
  //div.dataset.selected = div.dataset.selected === "true" ? "false" : "true";
  const nuevoPrecio = String(d?.precio);

  div.innerHTML = `
    <button class="btnelimina" id="card-${numeroMayor}"><img class="imgElimina" src="images/eliminar.avif">Eliminar</button>
  `;

  divContainer.innerHTML = `
      <h2 class="elCliente">
        <strong>${d.cliente || ""}</strong>
      </h2><br>

      <span class="datosTitulos">
        <strong>Fecha Inicio:</strong> <span class="datosVisibles" id="fechaInicio">${fecha2}</span>
      </span>

      <span class="datosTitulos">
        <strong>Fecha Fin:</strong> <span class="datosVisibles" id="fechaFin">${fechaFin || ""}</span>
      </span>

      <span class="datosTitulos">
        <strong>Vehículos clientes:</strong> <span class="datosVisibles" id="vc">${d.vc || ""}</span>
      </span>

      <span class="datosTitulos">
        <strong>Vehículos org:</strong> <span class="datosVisibles" id="vo">${d.vo || ""}</span>
      </span>

      <span class="datosTitulos">
        <strong>Comida:</strong> <span class="datosVisibles" id="comida">${comidaCheck}</span>
      </span>

      <span class="datosTitulos">
        <strong>Precio:</strong> <span class="datosVisibles" id="precio">${d.moneda || "ARS"} ${nuevoPrecio || "0"}</span>
      </span>

      <span class="datosTitulos">
        <strong>Seña:</strong> <span class="datosVisibles" id="seña">${señaCheck}</span>
      </span>

      <span class="datosTitulos">
        <strong>Seña Recibida:</strong> <span class="datosVisibles" id="señaRecibida">${d.senaRecibida || ""}</span>
      </span>
  `;
  const tituloCliente = divContainer.querySelector(".elCliente");
  tituloCliente.addEventListener("mouseover", () => {
    agregarTitulo(tituloCliente, tituloCliente.textContent.trim());
  });

  divContainer.querySelectorAll(".datosTitulos").forEach((el) => {
    el.addEventListener("mouseover", () => {
      //el.title = el.textContent.trim();
      agregarTitulo(el, el.textContent.trim());
    });
  });

  // CLICK EN LA CARD
  divContainer.addEventListener("click", (e) => {
    idSeleccionado = `card-${index}`;
    idCard2 = `card-${numeroMayor}`;
    const card = e.target.closest("#card");
    if (!card) return;

    //console.log(idSeleccionado);
    //const form = document.querySelector(".editaClientes");
    tarjetaSeleccionada = card;
    seleccionarCard(card, eleEdita);
    verificarCardYSelect();
    seleccionarOptionPorCard(d);
    //verificarSeleccionCards();
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
      //btnElimina.textContent = "Guardar";
      btnElimina.innerHTML = `<img class="imgElimina" src="">Guardar`;
      //actualizar.textContent = "guardar";
      cambiarImagen(btnElimina);
    }
  });

  if (btnElimina.innerHTML.includes("Eliminar")) {
    textoTooltip = "Click para eliminar la reserva";
  } else if (btnElimina.innerHTML.includes("Guardar")) {
    textoTooltip = "Click para guardar la reserva";
  } else if (btnElimina.innerHTML.includes("Actualizar")) {
    textoTooltip = "Click para actualizar la reserva";
  }
  agregarTooltip(btnElimina, textoTooltip);
  btnElimina.addEventListener("click", (e) => {
    const card = e.target.closest("#card");
    idSeleccionado = d.id;
    //console.log(idCard2);
    if (btnElimina.innerHTML.includes("Eliminar")) {
      (async () => {
        await eliminar();
        recargarEn5Minutos();
        eliminarCard(card);
        limpiarFormulario(eleEdita);
      })();
      (async () => {
        await cargarEventosGoogle(url);
      })();
    } else if (btnElimina.innerHTML.includes("Guardar")) {
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
          limpiarFormulario(eleEdita);
        }
      })();
    }
  });
  // const botonEliminar = document.querySelector(`#card-${nuevoNumero}`);
  // console.log(btnElimina);
  const card = document.querySelector(`#card[data-id="card-${nuevoNumero}"]`);
  //console.log(card);
  if (!card) return;
  card.addEventListener("click", () => {
    compararCards(card);
    // if (!card.dataset.selected === "true") {
    //   select.selectedIndex = 0;
    // }
  });

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
  tarjetaSeleccionada = card;

  seleccionarCard(card, eleEdita);
  globalIndex = nuevoNumero + 1;
  ordenarPorFecha();
}

// ================================================================================
// Función para procesar un evento de Google Calendar y extraer los datos relevantes
// ================================================================================
function procesarEventoGoogle(ev) {
  //console.log(ev);
  const descripcion = ev?.description || ev?.descripcion || "";

  const datosExtraidos = procesarDescripcionEvento(descripcion);
  //console.log(datosExtraidos);
  const fechaInicio = ev?.start?.dateTime || ev?.start?.date || ev?.fecha;
  const fechaFin = ev?.end?.dateTime || ev?.end?.date || ev?.fechaFin;

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
    precio: datosExtraidos?.precio || null,
    moneda: datosExtraidos?.moneda,

    sena: false,
    senaRecibida: "",
    descripcion: descripcion,
  };
}

// ================================================================================
// Función para manejar el evento de clic en el botón de guardar
// ================================================================================
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

// ================================================================================
// Función para manejar el evento de clic en el botón de actualizar,
// con lógica para determinar si se está guardando un nuevo registro
// o editando uno existente, y para llamar a las funciones correspondientes
// ================================================================================
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
  // if (actualizar.innerHTML.includes("guardar")) {
  //   console.log("si");
  // }
  if (actualizar.innerHTML.includes("guardar")) {
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
      (async () => {
        await cargarEventosGoogle(url);
      })();
    } else {
      //console.log(nuevo);
      //console.log(lala);
      //editar(nuevo);
      (async () => {
        const resultado = await editar(nuevo);
        console.log("Resultado edición:", resultado);

        if (resultado.status === "ok") {
          recargarEn5Minutos();
        }
      })();
    }
  }
  limpiarFormulario(eleEdita);
  eleEdita.style.background = "#2c2c2c";
});
// ================================================================================
// Función para guardar un nuevo registro en el backend, con manejo de errores
// y validación de la respuesta, además de recargar los datos desde el JSON después de guardar
// ================================================================================
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

    volvemosVerificar = false;
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

// ================================================================================
// Función para editar un registro existente en el backend, con manejo de errores
// y validación de la respuesta, además de recargar los datos desde el JSON después de editar
// ================================================================================
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
      volvemosVerificar = false;
      await cargarDatosDesde(urlJSON);
    }

    //data.logs.forEach((l) => console.log(l));

    console.log("Editado");
    return data;
  } catch (err) {
    console.error(err);
  }
}

// ================================================================================
// Función para eliminar un registro existente en el backend, con manejo de errores
// y validación de la respuesta, además de recargar los datos desde el JSON después de eliminar
// ================================================================================
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
    volvemosVerificar = false;

    await cargarDatosDesde(urlJSON);
  } catch (err) {
    console.error(err);
  }
}

// ================================================================================
// Función para limpiar los campos de un formulario, restableciendo su estado inicial
// ================================================================================
function limpiarFormulario(contenedor) {
  //console.log("Limpiando formulario:", contenedor);
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

// ================================================================================
// Función para eliminar una card del DOM, con validación y manejo de errores
// ================================================================================
function eliminarCard(card) {
  //console.log("Eliminando card:", card);
  card.remove();
}

setInterval(async () => {
  const res = await fetch(`${API}/logs`);
  const logs = await res.json();

  //console.clear();
  logs.forEach((l) => console.log(l));
}, 5000);

// ================================================================================
// Función para comparar dos fechas sin considerar las horas,
// devolviendo -1, 0 o 1 según corresponda
// ================================================================================
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

// ================================================================================
// Función para mostrar las fechas de los eventos de Google Calendar en un select,
// comparándolas con las reservas existentes y formateándolas correctamente
// ================================================================================
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
        fechaInicio: c.fechaInicio,
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

      fechaInicio: c.fechaInicio.replace("fecha:", "").trim().toLowerCase(),
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
          card.fechaInicio === calendar.fechaInicio &&
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
          fechaInicio: calendar.fechaInicio,
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
        fechaInicio: calendar.fechaInicio,
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
        const fechaComparada = compararFechas(cambio.fechaInicio, fechaHoy);

        // menor a hoy → ignorar
        // if (fechaComparada === -1) {
        //   return;
        // }
        idcCalendar = cambio.id;
        agregarOption(
          select,
          `${cambio.fechaInicio} - ${cambio.cliente}`,
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
            card.fechaInicio === calendar.fechaInicio &&
            card.fechaFin === calendar.fechaFin,
        ),
    );
    faltantes.forEach((ev, index) => {
      clientes.push({
        cliente: ev.cliente,
      });
    });
    const existeFaltante = clientesCalendar2.some(
      (calendar) =>
        !clientesCards3.some(
          (card) =>
            card.cliente === calendar.cliente &&
            card.fechaInicio === calendar.fechaInicio &&
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
          (card.cliente === cliente &&
            normalizarFecha(card.fechaInicio) === fecha) ||
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
        //console.log(fechaComparada);

        // menor a hoy → ignorar
        if (fechaComparada === -1) {
          return;
        }
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

      const nuevoPrecio = String(datosProcesados?.precio);
      //console.log(nuevoPrecio);

      // buscar en reservas
      const reservaExistente = reservas.find(
        (r) =>
          r.cliente.trim().toLowerCase() === cliente &&
          normalizarFecha(
            r.fechaInicio.replace("fecha:", "").trim().toLowerCase(),
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
        //console.log(fecha2);

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
        if (idFaltante) {
          numeroMayor = idFaltante.split("-")[1];
          idCard2 = `card-${numeroMayor}`;
        }
        //console.log(idCard2);

        // console.log(nuevoPrecio);
        nuevo = {
          id: idCard2,
          cardID: `card-${nuevoNumero}`,
          cliente: datosProcesados?.cliente,
          fechaInicio: fecha2,
          fechaFin: fechaFin,
          vc: datosProcesados?.vc,
          vo: datosProcesados?.vo,
          comida: comidaCheck,
          precio: nuevoPrecio,
          moneda: datosProcesados?.moneda,
          sena: señaCheck,
          senaRecibida: datosProcesados?.senaRecibida,
          descripcion: datosProcesados?.descripcion,
        };
        //console.log(nuevo);
        tarjetaAnterior = `card-${nuevoNumero}`;
        // const nuevoItem = obtenerSiguienteId(eventos);
        // console.log(nuevoItem);
        //reordenarIds(eventos);
        // const nuevosss = {id: obtenerIdLibre(eventos)};
        // console.log(nuevosss);
        //console.log(idFaltante);

        mostrarDatosGoogle(datosProcesados, nuevoNumero);
        cargarEnFormulario(datosProcesados, idCalendar, numero);
        verificarCardYSelect();
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
        //console.log("linea2287");
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
            precio: nuevoPrecio,
            moneda: datosProcesados.moneda,
            sena: señaCheck,
            senaRecibida: datosProcesados.senaRecibida,
            descripcion: datosProcesados?.descripcion,
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
          verificarCardYSelect();
          tarjetaSeleccionada = card2;
          elementoEliminar = card2;

          //botonEliminar.textContent = "Actualizar";
          //botonEliminar.innerHTML = `<img class="imgElimina" src="">Actualizar`;
          botonEliminar.innerHTML = `<img class="imgElimina" src="">Actualizar`;
          cambiarImagen(botonEliminar);
          agregarTooltip(botonEliminar, "Click para actualizar la reserva");
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
        //console.log("linea2364");
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
          //card2.click();
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
            precio: nuevoPrecio,
            moneda: datosProcesados.moneda,
            sena: señaCheck,
            senaRecibida: datosProcesados.senaRecibida,
            descripcion: datosProcesados?.descripcion,
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
          //verificarSeleccionCards();
          verificarCardYSelect();
          //botonEliminar.textContent = "Actualizar";
          botonEliminar.innerHTML = `<img class="imgElimina" src="">Actualizar`;
          cambiarImagen(botonEliminar);
          agregarTooltip(botonEliminar, "Click para actualizar la reserva");
          actualizar.textContent = "Actualizar";
          elementoEliminar = card2;
          tarjetaSeleccionada = card2;

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
      // if (option) {
      //   //console.log("es aca?");
      //   delete select.dataset.placeholderAgregado;
      //   select.selectedIndex = 0;
      //   option.remove();
      // }
    };
  }, 2000);
}

// ================================================================================
// Función para ordenar las cards por fecha de inicio, mostrando solo las que no han vencido,
// y reinsertándolas en el DOM en el orden correcto
// ================================================================================
function ordenarPorFecha() {
  const ahora = new Date();

  const cards = Array.from(lista.children).filter((card) => {
    const fechaFinTexto = card.querySelector("#fechaFin").textContent;
    //console.log(fechaFinTexto);

    // crear fecha fin
    const fechaFin = new Date(fechaFinTexto);
    const fechaFin2 = crearFechaLocal(fechaFinTexto);
    fechaFin2.setHours(23, 59, 59, 999);
    //const fechaFin2 = crearFechaLocal(fechaFin);
    //console.log(fechaFin2);

    // ✅ poner hora límite
    fechaFin.setHours(23, 59, 0, 0);
    //console.log(formatearFecha(fechaFin));

    // mostrar mientras NO haya pasado
    return ahora < fechaFin2;
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

// ================================================================================
// Función mejorada para ordenar las cards por fecha, con opciones para seleccionar los elementos,
// filtrar por vencidas, y ordenar de forma ascendente o descendente
// ================================================================================
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

// ================================================================================
// Funcion para comparar reservas con calendario
// devuelve un objeto con los campos comparados y un booleano indicando si son iguales o no
// ================================================================================
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

// ================================================================================
// Funcion para agregar items al select
// con opciones para deshabilitar, seleccionar, agregar clases, y dataset personalizado
// ================================================================================
function agregarOption(select, texto, valor, idc, options = {}) {
  //console.log(texto.split(" - "));
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
  const cliente = texto.split(" - ")[1];

  option.textContent = texto;
  option.value = valor;
  option.id = idc;
  option.dataset.cliente = cliente;

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

// ================================================================================
// Funcion para seleccionar una card y resaltarla
// con validación para evitar errores si no se encuentra la card,
// y para manejar el estado de selección
// ================================================================================
function seleccionarCard(card, formulario) {
  if (!card) return;
  //console.log(card);

  // si ya estaba seleccionada → deseleccionar
  if (card.dataset.selected === "true") {
    limpiarFormulario(eleEdita);
    comidaCheck = false;
    señaCheck = false;
    card.dataset.selected = "false";
    card.classList.remove("selected");
    actualizar.classList.remove("active");
    actualizar.classList.add("desactive");
    actualizar.disabled = true;
    //actualizar.textContent = "Actualizar";
    actualizar.innerHTML = `
    <img class="imgElimina" src="">Actualizar`;
    //actualizar.textContent = "guardar";
    cambiarImagen(actualizar);
    //console.log(eleEdita);
    tarjetaSeleccionada = null;
    //delete select.dataset.placeholderAgregado;
    //verificarSeleccionCards();
    verificarCardYSelect();
    //select.selectedIndex = 0;
    document.querySelector(`.clienteSel`).textContent =
      `Editar Cliente Seleccionado:`;
    return;
  }

  // quitar selección anterior
  document.querySelectorAll("#card.selected").forEach((c) => {
    c.dataset.selected = "false";
    c.classList.remove("selected");
    //select.selectedIndex = 0;
  });

  // seleccionar nueva
  card.dataset.selected = "true";
  card.classList.add("selected");
  //verificarSeleccionCards();
  //select.selectedIndex = 0;
}

// ================================================================================
// Funcion para verificar si alguna card está seleccionada, y si no lo está,
// restablecer el select a su estado inicial
// con validación para evitar errores si no se encuentran las cards,
// y para manejar el estado del select
// ================================================================================
function verificarCardYSelect() {
  const cardSeleccionada = document.querySelector('[data-selected="true"]');
  const cards = document.querySelectorAll("[data-card-id]");
  //console.log(cardSeleccionada);
  const algunaSeleccionada = [...cards].some(
    (card) => card.dataset.selected === "true",
  );
  //console.log(algunaSeleccionada);
  if (!algunaSeleccionada) {
    select.selectedIndex = 0;
  }
}

function seleccionarOptionPorCard(dato) {
  //console.log(dato);
  const cliente = dato?.cliente || dato?.titulo;
  const cards = document.querySelectorAll("[data-card-id]");
  const algunaSeleccionada = [...cards].some(
    (card) => card.dataset.selected === "true",
  );

  const index = [...select.options].findIndex((opt) =>
    opt.textContent.includes(cliente),
  );
  if (!algunaSeleccionada) {
    select.selectedIndex = 0;
  } else {
    select.selectedIndex = index !== -1 ? index : 0;
  }
}

// ================================================================================
// Funcion para obtener el ID de cada card
// con validación para evitar errores si no se encuentra la card,
// y para comparar por cliente y fecha
// ================================================================================
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

// ================================================================================
// Funcion para obtener el ultimo id de la card, y el ultimo id del boton eliminar
// y devolver el siguiente numero a usar para cada uno, con validación para evitar errores
// ================================================================================
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

// ================================================================================
// Funcion para crear boton de top
// con validación para evitar errores si no se encuentra el bloque destino,
// y para agregar el evento de scroll y click al botón
// ================================================================================
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

// ================================================================================
// Funcion para mostrar el botón de top al hacer scroll, y para ajustar su posición
// dependiendo de si se ha llegado al final de la página o no, con validación para evitar errores
// ================================================================================
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

// ================================================================================
// Funcion para determinar cuando llegamos al final de la pagina
// con validación para evitar errores, y para comparar la posición actual del scroll
// con la altura total del documento
// ================================================================================
function isBottomOfPage() {
  //return window.scrollY + window.innerHeight >= Math.round(document.documentElement.scrollHeight);
  return (
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight
  );
}

// ================================================================================
// Funcion para hacer scroll suave hacia el top de la página al hacer click en el botón,
// con validación para evitar errores
// ================================================================================
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

// ================================================================================
// Funcion para comparar el cliente de una card con el cliente de la card anterior seleccionada,
// y para devolver un objeto con el cliente anterior y el nuevo, con validación para evitar errores
// ================================================================================
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

// ================================================================================
// Funcion para renderizar las cards de eventos, con opciones para transformar los datos,
// agregar eventos de click, hacerlas clickeables, revisar datos,
// y para manejar el origen de los datos
// ================================================================================
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
    } else if (origen === "ocultas") {
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
      descripcion: descripcion,
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
        seleccionarOptionPorCard(data);
        tarjetaSeleccionada = cardOriginal;
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

// ================================================================================
// Funcion para abrir el modal de eventos
// con validación para evitar errores, y para renderizar las cards de eventos
// ================================================================================
function cerrarModalEventos() {
  const overlay = document.querySelector("#modalEventosOverlay");
  overlay.style.display = "none";
}

// ================================================================================
// Función autoejecutable para configurar el modal de eventos,
// con opciones para personalizar la combinación de teclas,
// manejar los eventos de apertura y cierre del modal, y para renderizar las cards
// de eventos desde el calendario y reservas
// ================================================================================
(function () {
  const titulosClientesModal = document.querySelector(
    "#listaEventosModal > div h2",
  );
  setTimeout(() => {
    // =========================
    // CONFIG
    // =========================

    // Combinación:
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
        let contenedorCards;
        let tituloContenedorCards;
        if (EVENTOS) {
          contenedorCards = document.createElement("div");
          contenedorCards.className = "cardContainerEventos";
          tituloContenedorCards = document.createElement("h2");
          tituloContenedorCards.className = "tituloEventos";
          tituloContenedorCards.textContent = "Eventos desde Calendario";
          contenedorCards.appendChild(tituloContenedorCards);
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
              fechaFin = restarDias(ev?.start?.date, ev?.end?.date, 1);
            } else {
              fechaFin = ev?.end?.dateTime;
            }

            return {
              titulo: ev?.summary,

              fechaInicio: ev?.start?.dateTime || ev?.start?.date,

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

            fechaInicio: d.fechaInicio,

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
        if (ocultas) {
          contenedorCards = document.createElement("div");
          contenedorCards.className = "cardContainerOcultas";
          tituloContenedorCards = document.createElement("h2");
          tituloContenedorCards.className = "tituloOcultas";
          tituloContenedorCards.textContent = "Eventos Finalizados";
          contenedorCards.appendChild(tituloContenedorCards);
          //lista.appendChild(cardContainer);
          nuevo = null;
        } //else {
        //return;
        //}
        if (ocultas.length > 0) {
          lista.appendChild(contenedorCards);
        }
        renderizarCards({
          datos: ocultas,

          contenedor: contenedorCards,
          clickable: false,
          revisa: false,
          origen: "ocultas",

          transformar: (d) => ({
            titulo: d.cliente,

            fechaInicio: d.fechaInicio,

            fechaFin: d.fechaFin,

            descripcion: d.descripcion,

            vehiculosClientes: d.vc,

            vehiculosOrganizadores: d.vo,

            comida: d.comida,

            precio: d.precio,

            moneda: d.moneda,
          }),
        });
        // ordenarPorFecha55({
        //   contenedor: contenedorCards,
        // });
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
      //contenedorReservas.click();
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

// ================================================================================
// Función para normalizar fechas, eliminando horas y minutos si es un datetime,
// y para manejar casos donde la fecha pueda venir con espacios o en formatos diferentes
// ================================================================================
function normalizarFecha(fecha) {
  if (!fecha) return "";

  // si viene con T (datetime)
  if (fecha.includes("T")) {
    return fecha.split("T")[0];
  }
  //console.log(fecha.trim());
  return fecha.trim();
}

// ================================================================================
// Función para crear un modal que permita al usuario elegir entre cargar un JSON
// local o desde GitHub,
// con validación para evitar duplicados, estilos inline para asegurar su apariencia,
// y eventos para manejar la interacción del usuario
// ================================================================================
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
        ocultas.length = 0;
        visibles.length = 0;
        clientes.length = 0;
        descripciones.length = 0;
        reservasManana.length = 0;
        select.innerHTML = "";
        lista.innerHTML = "";
        volvemosVerificar = false;
        delete select.dataset.placeholderAgregado;
        if (tipo === "local") {
          urlJSON = "data/data.json";
          origenJSON = urlJSON;
          await cargarDatosDesde("data/data.json");
          await cargarEventosGoogle(url);
        }

        if (tipo === "github") {
          urlJSON =
            "https://raw.githubusercontent.com/TaylorBundy/Calendario_4x4/main/data/data.json";
          const resultado = urlJSON.substring(urlJSON.indexOf("TaylorBundy"));
          origenJSON = resultado;
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

// ================================================================================
// Evento para abrir el modal de carga de JSON al presionar Shift + J,
// con validación para evitar conflictos con otras combinaciones de teclas,
// y para manejar la carga de datos dependiendo del dominio
// ================================================================================
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "j") {
    e.preventDefault();

    if (!domain.includes("github.io")) {
      //urlJSON = "data/data.json";
      crearModalJSON();
    } else {
      select.innerHTML = "";
      delete select.dataset.placeholderAgregado;
      (async () => {
        await cargarEventosGoogle(url);
      })();
      return;
    }
    //crearModalJSON();
  }
});

// ================================================================================
// Función para cargar datos desde un JSON, con validación para manejar errores de carga,
// para actualizar el contador de reservas visibles, y para mostrar los datos en el DOM
// ================================================================================
async function cargarDatosDesde(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("No se pudo cargar el JSON");
  }

  datos = await res.json();
  //console.log(datos);
  const ids = datos
    .map((item) => Number(item.id.replace("card-", "")))
    .sort((a, b) => a - b);
  const ultimoId = ids[ids.length - 1];
  ultimoID = ultimoId;

  //console.log(ultimoId);
  // datos.forEach((item) => {
  //   console.log(item);
  // });
  const nuevosss = { id: obtenerIdLibre(datos) };
  idFaltante = nuevosss.id;
  //console.log(nuevosss);
  reservas.push(...datos);

  const total = contarRegistrosVisibles(datos);

  totalReservas.innerHTML = `
    <span class="reservasTitulos">
      <strong>Total reservas:</strong>
      <span class="reservasVisibles">${total}</span>
    </span>
    <br>
    <span class="reservasTitulos">
      <strong>Archivo cargado:</strong>
      <span class="reservasVisibles">${origenJSON}</span>
    </span>
  `;

  globalIndex = 0;
  mostrarDatos();
  //contenedorReservas.click();
  //mostrarDatos2(lista2, true);
  reconstruirReservasDesdeDOM();
  setTimeout(() => {
    muestraBoton();
  }, 1500);
  //reservas.push(datos);
}

// ================================================================================
// Función para recargar la página después de 5 minutos,
// con validación para evitar recargas múltiples,
// para mostrar la hora actual en la consola, y para limpiar el timer anterior
// si se programa una nueva recarga
// Actualmente seteado en 2 minutos.
// ================================================================================
function recargarEn5Minutos() {
  clearTimeout(timerRecarga);
  horaActual = new Date().toLocaleTimeString("es-AR");

  console.log("Recarga programada para dentro de 2 minutos");
  console.log(`Hora actual: ${horaActual}`);

  timerRecarga = setTimeout(
    () => {
      volvemosVerificar = false;
      console.log("Recargando...");
      //location.reload();
      select.innerHTML = "";
      delete select.dataset.placeholderAgregado;
      cargarDatosDesde(urlJSON);
      (async () => {
        await cargarEventosGoogle(url);
      })();
    },
    2 * 60 * 1000,
  );
}

// ================================================================================
// Función para cambiar la imagen de un botón dependiendo de su texto,
// con un objeto que mapea los textos a las rutas de las imágenes,
// y para manejar casos donde el texto no tenga una imagen asignada
// ================================================================================
function cambiarImagen(boton) {
  const img = boton.querySelector("img");
  //console.log(img);
  const imagenes = {
    guardar: "images/salvar.avif",
    Guardar: "images/salvar.avif",
    Eliminar: "images/eliminar.avif",
    Actualizar: "images/actualizar.avif",
    "Mostrar reservas ocultas": "images/mostrar.avif",
    "Ocultar reservas ocultas": "images/ocultar.avif",
  };

  const texto = boton.textContent.trim();
  img.src = imagenes[texto] || "img/default.jpg";
  // document.getElementById("miImagen").src =
  //   imagenes[texto] || "img/default.jpg";
}

// ================================================================================
// Función para obtener un ID libre para una nueva reserva,
// analizando los IDs existentes en los datos,
// y para devolver un ID en formato "card-X" donde X es el número más bajo disponible
// ================================================================================
function obtenerIdLibre(datos) {
  const ids = datos
    .map((item) => Number(item.id.replace("card-", "")))
    .sort((a, b) => a - b);

  let esperado = 1;

  for (const id of ids) {
    if (id !== esperado) {
      return `card-${esperado}`;
    }
    esperado++;
  }

  return `card-${esperado}`;
}

// ================================================================================
// Función para verificar si una reserva comienza mañana, comparando la fecha de inicio con la fecha actual,
// para agregar una clase de alerta a la card correspondiente, para mostrar una alerta visual con los detalles de la reserva,
// para reproducir un sonido de alerta, y para manejar casos donde la alerta ya ha sido mostrada o está activa
// ================================================================================
function verificarAlertaReserva(fechaInicio, fechaFin, card) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const inicio = new Date(fechaInicio);
  inicio.setHours(0, 0, 0, 0);
  // Si la reserva ya comenzó o ya pasó, no alertar
  if (inicio < hoy) {
    return false;
  }

  const alerta = new Date(fechaInicio);
  alerta.setDate(alerta.getDate() - 1);
  alerta.setHours(0, 0, 0, 0);
  const ahora = new Date();

  if (ahora < alerta) return false;

  card.classList.add("alerta-manana");

  if (card.dataset.alertaMostrada === "true") {
    return true;
  }

  card.dataset.alertaMostrada = "true";

  const nombreCliente = card.querySelector(".elCliente").textContent;
  reservasManana.push({
    cliente: nombreCliente,
    fechaInicio,
    fechaFin,
  });
  if (volvemosVerificar) {
    if (!card.dataset.alertaActiva) {
      card.dataset.alertaActiva = "true";

      iniciarAlarmaReserva(fechaInicio, fechaFin, nombreCliente);
    }

    if (reservasManana.length > 0) {
      mostrarAlertaVisual(
        reservasManana
          .map(
            (r) => `
          ⚠️ Mañana comienza una reserva❗
          <br><br>
          👨‍🔧 Cliente: "${r.cliente}"<br>
          📅 Fecha Inicio: ${r.fechaInicio}<br>
          🕒 Fecha Fin: ${r.fechaFin}<br>
        `,
          )
          .join("<br>"),
      );
    }

    const titulo = card.querySelector(".elCliente");

    if (!titulo.textContent.includes("🚙📅")) {
      //titulo.textContent = `🚙📅 ${titulo.textContent}`;
    }
  }
  return true;
}

// ================================================================================
// Función para mostrar una alerta visual en la página, creando un elemento con el mensaje de alerta,
// para agregarlo al DOM, para programar la reproducción de un sonido de alerta después de unos segundos,
// y para eliminar la alerta después de un tiempo determinado, con opciones para manejar alarmas repetidas
// ================================================================================
function mostrarAlertaVisual(mensaje) {
  const alerta = document.createElement("div");

  alerta.className = "alerta-reserva";
  //alerta.textContent = mensaje;
  alerta.innerHTML = mensaje;

  document.body.appendChild(alerta);

  setTimeout(() => {
    if (audioHabilitado) {
      reproducirAlertaSonora("reserva");
    }
  }, 5000);
  setTimeout(() => {
    alerta.remove();
    if (alarmaRepetida === 0) {
      alarmaRepetida++;
    } else {
      preguntarContinuarAlarma();
    }
  }, 10000);
}

// ================================================================================
// Función para esperar a que la página esté completamente cargada antes de reproducir un sonido de alerta,
// para manejar casos donde el usuario aún no ha interactuado con la página y el audio está bloqueado,
// y para manejar errores de reproducción de audio
// ================================================================================
function esperarCargaCompleta() {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", resolve, {
        once: true,
      });
    }
  });
}

// ================================================================================
// Función para reproducir un sonido de alerta, con validación para verificar si el audio está habilitado, para esperar a que la página esté completamente cargada antes de reproducir el sonido,
// y para manejar errores de reproducción de audio, como bloqueos por parte del navegador
// ================================================================================
async function reproducirAlertaSonora(origen) {
  if (!audioHabilitado) {
    console.warn("El usuario aún no interactuó con la página");
    return false;
  }

  try {
    await esperarCargaCompleta();

    // pequeño delay adicional
    await new Promise((resolve) => setTimeout(resolve, 500));
    const audio =
      origen === "reserva"
        ? document.getElementById("alertaReserva")
        : document.getElementById("alertaGoogle");

    audio.currentTime = 0;

    await audio.play();
  } catch (error) {
    console.warn("Audio bloqueado:", error);
  }
}

// ================================================================================
// Función para preguntar al usuario si desea continuar recibiendo recordatorios de una reserva próxima,
// creando un modal con opciones para continuar o detener la alarma, para programar la eliminación del modal después de un tiempo determinado,
// y para manejar los eventos de los botones para continuar o detener la alarma, con validación para evitar múltiples modales
// ================================================================================
function preguntarContinuarAlarma() {
  const overlay = document.createElement("div");

  overlay.innerHTML = `
    <div class="modalPregunta">

      <h3>
        🔔 Alarma de reserva activa
      </h3>

      <p>
        ¿Deseás seguir recibiendo
        recordatorios cada 15 minutos?
      </p>

      <button id="btnContinuarAlarma">
        Continuar
      </button>

      <button id="btnDetenerAlarma">
        Detener
      </button>

    </div>
  `;

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
  `;

  document.body.appendChild(overlay);

  // si no responde en 30 segundos, sigue sonando
  const timeoutAlarma = setTimeout(() => {
    overlay.remove();
  }, 30000);

  document
    .querySelector("#btnContinuarAlarma")
    .addEventListener("click", () => {
      clearTimeout(timeoutAlarma);

      overlay.remove();

      console.log("Continuando recordatorios cada 15 minutos...");
    });

  document.querySelector("#btnDetenerAlarma").addEventListener("click", () => {
    clearTimeout(timeoutAlarma);

    detenerAlarmaReserva();

    overlay.remove();
  });
}

// ================================================================================
// Función para iniciar una alarma de reserva, programando una alerta inmediata y luego repitiendo la alerta cada 15 minutos, con validación para manejar casos donde la alarma ya está activa, y para mostrar una alerta visual con los detalles de la reserva cada vez que se active la alarma
// ================================================================================
function iniciarAlarmaReserva(fechaInicio, fechaFin, nombreCliente) {
  // primera alerta inmediata
  //mostrarAlertaReserva(fechaInicio, fechaFin, nombreCliente);
  // repetir cada 15 minutos
  intervaloAlarma = setInterval(
    () => {
      //mostrarAlertaReserva(fechaInicio, fechaFin, nombreCliente);
      mostrarAlertaVisual(
        reservasManana
          .map(
            (r) => `
          ⚠️ Mañana comienza una reserva❗
          <br><br>
          👨‍🔧 Cliente: "${r.cliente}"<br>
          📅 Fecha Inicio: ${r.fechaInicio}<br>
          🕒 Fecha Fin: ${r.fechaFin}<br>
        `,
          )
          .join("<br>"),
      );
    },
    15 * 60 * 1000,
  );
}

// ================================================================================
// Función para detener la alarma de reserva, limpiando el intervalo programado para las alertas repetidas, y para mostrar un mensaje en la consola indicando que la alarma ha sido detenida
// ================================================================================
function detenerAlarmaReserva() {
  if (intervaloAlarma) {
    clearInterval(intervaloAlarma);
    intervaloAlarma = null;
  }

  console.log("Alarma detenida");
}
