// ========================================
// VERSION CORREGIDA - HELPERS PRINCIPALES
// ========================================

const state = {
  seleccionado: null,
  editando: null,
  origen: null,
  moneda: null,
};

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
      // console.log(e.target.closest('div[id="card"]'));
      const card = e.target.closest("#card");
      if (!card) return;
      const form = document.querySelector(".editaClientes");
      console.log(form);
      seleccionarCard(card, eleEdita);
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
      // console.log(idSeleccionado);
      // console.log(d);
      // console.log(index);
      // console.log(indiceAnterior);
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
        // console.log("eliminar");
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

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase();
}

function normalizarFecha(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase();
}

function normalizarNumero(valor) {
  return Number(valor || 0);
}

function normalizarBoolean(valor) {
  const texto = String(valor).trim().toLowerCase();

  return texto === "true" || texto === "sí" || texto === "si";
}

function restarDias(fecha, dias) {
  const nuevaFecha = new Date(fecha);

  nuevaFecha.setDate(nuevaFecha.getDate() - dias);

  return nuevaFecha.toISOString().split("T")[0];
}

function limpiarFormulario(contenedor) {
  if (!contenedor) return;

  const elementos = contenedor.querySelectorAll("input, textarea, select");

  elementos.forEach((el) => {
    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = false;
    } else {
      el.value = "";
    }
  });
}

function seleccionarCard(card) {
  if (!card) return;

  document.querySelectorAll(".card.selected").forEach((c) => {
    c.classList.remove("selected");
    c.dataset.selected = "false";
  });

  if (card.dataset.selected === "true") {
    card.dataset.selected = "false";
    card.classList.remove("selected");
    return;
  }

  card.dataset.selected = "true";
  card.classList.add("selected");
}

function procesarDescripcionEvento(texto) {
  let precioMatch = null;

  const resultado = {
    vehiculos: null,
    organizadores: null,
    precio: null,
    moneda: null,
    comida: "No",
    sena: "No",
  };

  const vehiculosMatch = texto.match(
    /(\d+)\s*veh[ií]culos?(?!\s*organizadores)/i,
  );

  if (vehiculosMatch) {
    resultado.vehiculos = Number(vehiculosMatch[1]);
  }

  const organizadoresMatch = texto.match(
    /(\d+)\s*veh[ií]culos?\s*organizadores/i,
  );

  if (organizadoresMatch) {
    resultado.organizadores = Number(organizadoresMatch[1]);
  }

  const patronesPrecio = [
    /(\d+)\s*(usd|u\$s|d[oó]lares?|pesos?)\s*por\s*veh[ií]culo/i,
    /precio\s*(?:pactado|por\s*veh[ií]culo)?[:\s]*\$?\s*(\d+)/i,
    /\$\s*(\d+)/i,
  ];

  for (const regex of patronesPrecio) {
    const match = texto.match(regex);

    if (match) {
      precioMatch = match;
      break;
    }
  }

  if (precioMatch) {
    resultado.precio = Number(precioMatch[1]);

    if (precioMatch[2]) {
      const moneda = precioMatch[2].toLowerCase();

      if (
        moneda.includes("usd") ||
        moneda.includes("u$s") ||
        moneda.includes("dólar") ||
        moneda.includes("dolar")
      ) {
        resultado.moneda = "USD";
      } else if (moneda.includes("peso")) {
        resultado.moneda = "ARS";
      }
    }
  }

  if (/\b(true|s[ií])\b|incluye\s*comida|con\s*comida/i.test(texto)) {
    resultado.comida = "Sí";
  }

  if (/\b(false|no)\b|no\s*incluye\s*comida/i.test(texto)) {
    resultado.comida = "No";
  }

  if (/\b(true|s[ií])\b|incluye\s*seña|con\s*seña/i.test(texto)) {
    resultado.sena = "Sí";
  }

  if (/\b(false|no)\b|no\s*incluye\s*seña/i.test(texto)) {
    resultado.sena = "No";
  }

  return resultado;
}

function compararReservas(reserva, calendar) {
  return {
    cliente:
      normalizarTexto(reserva.cliente) === normalizarTexto(calendar.cliente),

    fecha: normalizarFecha(reserva.fecha) === normalizarFecha(calendar.fecha),

    precio:
      normalizarNumero(reserva.precio) === normalizarNumero(calendar.precio),

    comida:
      normalizarBoolean(reserva.comida) === normalizarBoolean(calendar.comida),
  };
}

function renderCard(dato, index) {
  const div = document.createElement("div");

  div.classList.add("card");
  div.classList.add(`card-${index}`);

  div.dataset.id = `card-${index}`;
  div.dataset.selected = "false";

  const comida = normalizarBoolean(dato.comida) ? "Sí" : "No";

  const sena = normalizarBoolean(dato.sena) ? "Sí" : "No";

  div.innerHTML = `
    <h2 class="elCliente">${dato.cliente}</h2>

    <span id="fechaInicio">
      ${dato.fechaInicio}
    </span>

    <span id="fechaFin">
      ${dato.fechaFin}
    </span>

    <span id="comida">
      ${comida}
    </span>

    <span id="seña">
      ${sena}
    </span>

    <span id="precio">
      ${dato.moneda || ""} ${dato.precio || ""}
    </span>
  `;

  div.addEventListener("click", () => {
    seleccionarCard(div);
  });

  return div;
}

let intervaloLogs = null;

function iniciarLogs(api) {
  intervaloLogs = setInterval(async () => {
    try {
      const res = await fetch(`${api}/logs`);
      const logs = await res.json();

      logs.forEach((l) => console.log(l));
    } catch (error) {
      console.error(error);
    }
  }, 5000);
}

function detenerLogs() {
  if (intervaloLogs) {
    clearInterval(intervaloLogs);
  }
}

cargarDatos();
