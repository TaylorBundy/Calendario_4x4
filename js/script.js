const form = document.getElementById("formulario");
const lista = document.getElementById("lista");
const totalReservas = document.querySelector(".totalReservas");
const guarda = document.querySelector(".guardar");
const actualizar = document.querySelector(".actualizar");
const botones = document.querySelectorAll("button");
const API = "https://calendario-4x4.onrender.com";

let datos = [];
let indiceEditando = null;
let indiceNuevo = null;
let indiceAnterior = null;

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
  //console.log("Total de reservas:", total);
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

  indiceEditando = index;
  indiceNuevo = indiceEditando;
  //console.log(index);
  const elementoSelected = document.querySelector(`.card-${index}`);
  const elementoSelected1 = document.querySelector(`.card-${indiceAnteriors}`);
  const elementoActual = document.querySelector(`.card-${index}`);
  const elementoAnterior = document.querySelector(`.card-${indiceAnteriors}`);
  //const dataSet = elementoSelected1.dataset.selected;
  //elementoSelected.classList.add("selected");
  //console.log(elementoSelected.className);
  //   if (elementoSelected.className.includes("selected")) {
  //     elementoSelected.classList.remove("selected");
  //   }
  //const nIndice = elementoSelected.className;
  //const clases = elementoSelected.className;
  //const numero = parseInt(clases.match(/card-(\d+)/)[1]);
  //console.log(nIndice);
  //   const clases = elementoSelected.className;
  //   const numero = parseInt(clases.match(/card-(\d+)/)[1]);
  //console.log(numero);
  //console.log(dataSet);
  //console.log(elementoSelected);
  //   console.log("elementoSelected: " + elementoSelected.className);
  //   console.log("elementoSelected1: " + elementoSelected1.className);
  //indiceAnterior = null;
  console.log(`indiceNuevo: ${indiceNuevo}`);
  console.log(`indiceAnterior: ${indiceAnterior}`);
  console.log(`elementoActual: ${elementoActual.className}`);
  console.log(`elementoAnterior: ${elementoAnterior.classList}`);
  //   console.log(`clases: ${clases}`);
  if (indiceNuevo != indiceAnterior) {
    console.log(`indiceEditando: ${indiceEditando}`);
    // console.log(
    //   `indiceNuevo: ${indiceNuevo} != indiceAnterior: ${indiceAnteriors}`,
    // );
    console.log("indice distinto");
    //console.log(elementoSelected1);
    indiceNuevo = index;
    //console.log(index);
    indiceAnterior = indiceNuevo;
    if (elementoSelected1.dataset.selected == "true") {
      if (elementoSelected1.className.includes("selected")) {
        //console.log(`${dataSet}`);
        elementoSelected1.classList.remove("selected");
        elementoSelected1.dataset.selected = "false";

        //elementoSelected.classList.add("selected");
      } else {
        elementoSelected1.classList.add("selected");
      }
    }
    if (elementoSelected.dataset.selected == "true") {
      if (elementoSelected.className.includes("selected")) {
        //console.log(`${dataSet}`);
        elementoSelected.classList.remove("selected");
        elementoSelected.dataset.selected = "false";
      } else {
        elementoSelected.classList.add("selected");
      }
    }
    // } else {
    //   if (elementoSelected1.className.includes("selected")) {
    //     console.log(`${dataSet}`);
    //     elementoSelected1.classList.remove("selected");
    //     //elementoSelected1.classList.add("selected");
    //   }
    // }
    // if (elementoSelected1.dataset.selected == "true") {
    //   console.log(`${dataSet}`);
    // }
    // console.log(`indiceNuevo: ${indiceNuevo}`);
    // console.log(`indiceAnterior: ${indiceAnteriors}`);
    // console.log(`clases: ${clases}`);

    // console.log(`elementoanterior: ${elementoSelected1.className}`);
    // if (elementoSelected1.className.includes("selected")) {
    //   elementoSelected1.classList.remove("selected");
    //   elementoSelected1.dataset.selected = "false";
    // }
    // if (elementoSelected.className.includes("selected")) {
    //   elementoSelected.classList.remove("selected");
    //   console.log(`indiceNuevo: ${indiceNuevo}`);
    //   console.log(`indiceAnterior: ${indiceAnteriors}`);
    //   console.log(`clases: ${clases}`);
    // } else {
    //   elementoSelected.classList.add("selected");
    //   console.log(`indiceNuevo: ${indiceNuevo}`);
    //   console.log(`indiceAnterior: ${indiceAnteriors}`);
    //   console.log(`clases: ${clases}`);
    // }
  } else if (indiceNuevo == indiceAnterior) {
    console.log("mismo indice");
    console.log(`indiceEditando: ${indiceEditando}`);
    if (elementoSelected1.dataset.selected == "true") {
      if (elementoSelected1.className.includes("selected")) {
        elementoSelected1.classList.remove("selected");
        elementoSelected1.dataset.selected = "false";
        elementoSelected.classList.add("selected");
        //console.log(`${dataSet}`);
        //elementoSelected1.classList.remove("selected");
        // elementoSelected1.classList.add("selected");
      } else {
        elementoSelected1.classList.add("selected");
      }
    } else {
      //elementoSelected1.dataset.selected = "false";
      if (elementoSelected1.className.includes("selected")) {
        elementoSelected1.classList.remove("selected");
      }
    }
    if (
      indiceEditando == indiceAnterior &&
      elementoActual.dataset.selected == "false"
    ) {
      console.log("son lo mismo");
      document.getElementById("editaCliente").value = "";
      document.getElementById("editaFecha").value = "";
      document.getElementById("editaVehiculosClientes").value = "";
      document.getElementById("editaVehiculosOrg").value = "";
      document.getElementById("editaComida").checked = false;
      document.getElementById("editaPrecio").value = "";
      document.getElementById("editaSeña").checked = false;
    }
    // } else {
    //   if (elementoSelected1.className.includes("selected")) {
    //     //console.log(`${dataSet}`);
    //     elementoSelected1.classList.remove("selected");
    //     //elementoSelected1.classList.add("selected");
    //   }
    // }
    // console.log(
    //   `indiceNuevo: ${indiceNuevo} = indiceAnterior: ${indiceAnteriors}`,
    // );
    // if (
    //   elementoSelected1.className.includes("selected") &&
    //   indiceNuevo == indiceAnteriors
    // ) {
    //   console.log(`clases 89: ${elementoSelected1.className}`);
    //   //elementoSelected1.classList.remove("selected");
    // }
    // if (elementoSelected1.className.includes("selected")) {
    //   elementoSelected1.classList.remove("selected");
    //   indiceNuevo = null;
    // } else {
    //   elementoSelected1.classList.add("selected");
    // }
  } //else {
  // console.log("mismo indice");
  // console.log(`indiceNuevo: ${indiceNuevo}`);
  // console.log(`indiceAnterior: ${indiceAnteriors}`);
  // console.log(`clases: ${clases}`);
  // if (elementoSelected.className.includes("selected")) {
  //   elementoSelected.classList.remove("selected");
  // }
  //}

  // opcional: cambiar texto botón
  //form.querySelector(".actualizar").innerText = "Actualizar";
}

// function mostrarDatos2() {
//   lista.innerHTML = "";

//   datos.forEach((d) => {
//     const div = document.createElement("div");
//     div.className = "card";

//     div.innerHTML = `
//       <strong>${d.cliente}</strong><br>
//       Fecha: ${d.fecha}<br>
//       Vehículos clientes: ${d.vc}<br>
//       Vehículos org: ${d.vo}<br>
//       Comida: ${d.comida ? "Sí" : "No"}<br>
//       Precio: $${d.precio}<br>
//       Seña: ${d.sena ? "Sí" : "No"}
//     `;

//     lista.appendChild(div);
//   });
// }

// function mostrarDatos3() {
//   lista.innerHTML = "";

//   // Ordenar por fecha (más cercana primero)
//   const hoy = new Date();

//   datos.sort((a, b) => {
//     const fechaA = new Date(a.fecha);
//     const fechaB = new Date(b.fecha);

//     return fechaA - fechaB; // ascendente
//   });

//   datos.forEach((d) => {
//     const div = document.createElement("div");
//     div.className = "card";

//     div.innerHTML = `
//       <strong>${d.cliente}</strong><br>
//       Fecha: ${d.fecha}<br>
//       Vehículos clientes: ${d.vc}<br>
//       Vehículos org: ${d.vo}<br>
//       Comida: ${d.comida ? "Sí" : "No"}<br>
//       Precio: $${d.precio}<br>
//       Seña: ${d.sena ? "Sí" : "No"}
//     `;

//     lista.appendChild(div);
//   });
// }

function mostrarDatos() {
  lista.innerHTML = "";

  datos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  datos.forEach((d, index) => {
    const div = document.createElement("div");
    // div.className = "card";
    div.className = `card-${index}`;
    div.id = "card";
    // console.log(index);

    div.innerHTML = `
      <strong>${d.cliente}</strong><br>
      Fecha: ${d.fecha}<br>
      Vehículos clientes: ${d.vc}<br>
      Vehículos org: ${d.vo}<br>
      Comida: ${d.comida ? "Sí" : "No"}<br>
      Precio: $${d.precio}<br>
      Seña: ${d.sena ? "Sí" : "No"}
    `;

    // 👉 CLICK PARA EDITAR
    //div.addEventListener("click", () => cargarEnFormulario(d, index));
    div.addEventListener("click", () => {
      if (div.dataset.selected == "true") {
        div.dataset.selected = "false";
        // if (div.className.includes("selected")) {
        //   if (indiceNuevo == indiceAnterior) {
        //     div.classList.remove("selected");
        //   }
        // } else {
        //   return;
        // }
        //return;
      } else {
        div.dataset.selected = "true";
      }
      //   console.log(indiceNuevo);
      //console.log(`indiceNuevo: ${indiceNuevo}`);
      //console.log(`indiceAnterior: ${indiceAnterior}`);
      const clases = div.className;
      const numero = parseInt(clases.match(/card-(\d+)/)[1]);
      if (indiceAnterior === null) {
        indiceAnterior = numero;
      }
      if (indiceNuevo === null) {
        indiceNuevo = numero;
      }
      //   if (div.className.includes("selected")) {
      //     if (indiceNuevo != indiceAnterior) {
      //       div.classList.remove("selected");
      //     }
      //   } //else {
      //div.classList.add("selected");
      //}
      cargarEnFormulario(d, index, indiceAnterior);
      //   input.value = num;
      //   historialDiv.style.display = "none";
      //   input.focus();
    });

    lista.appendChild(div);
  });
}

let nuevo;
guarda.addEventListener("click", () => {
  nuevo = {
    cliente: document.getElementById("cliente").value,
    fecha: document.getElementById("fecha").value,
    vc: document.getElementById("vehiculosClientes").value,
    vo: document.getElementById("vehiculosOrg").value,
    comida: document.getElementById("comida").checked,
    precio: document.getElementById("precio").value,
    sena: document.getElementById("seña").checked,
  };
  guardar(nuevo);
  console.log(nuevo);
});

actualizar.addEventListener("click", (e) => {
  nuevo = {
    cliente: document.getElementById("editaCliente").value,
    fecha: document.getElementById("editaFecha").value,
    vc: document.getElementById("editaVehiculosClientes").value,
    vo: document.getElementById("editaVehiculosOrg").value,
    comida: document.getElementById("editaComida").checked,
    precio: document.getElementById("editaPrecio").value,
    sena: document.getElementById("editaSeña").checked,
  };
  //guardar(nuevo);
  console.log(nuevo);
});
// Guardar
// form.addEventListener("submit", async (e) => {
//   //e.preventDefault();
//   console.log(e.target);
//   //let dataaaa;
//   const accion = e.submitter.className;
//   //const boton = e.id;
//   //console.log(boton);
//   if (accion.includes("guardar")) {
//     nuevo = {
//       cliente: document.getElementById("cliente").value,
//       fecha: document.getElementById("fecha").value,
//       vc: document.getElementById("vehiculosClientes").value,
//       vo: document.getElementById("vehiculosOrg").value,
//       comida: document.getElementById("comida").checked,
//       precio: document.getElementById("precio").value,
//       sena: document.getElementById("seña").checked,
//     };
//     guardar(nuevo);
//     //dataaaa = JSON.stringify(nuevo);
//     // await fetch(`${API}/save`, {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //   },
//     //   body: JSON.stringify(nuevo),
//     // });
//   } else if (accion.includes("actualizar")) {
//     nuevo = {
//       cliente: document.getElementById("editaCliente").value,
//       fecha: document.getElementById("editaFecha").value,
//       vc: document.getElementById("editaVehiculosClientes").value,
//       vo: document.getElementById("editaVehiculosOrg").value,
//       comida: document.getElementById("editaComida").checked,
//       precio: document.getElementById("editaPrecio").value,
//       sena: document.getElementById("editaSeña").checked,
//     };
//     //dataaaa = JSON.stringify(nuevo);
//     await fetch(`${API}/editar`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         index: indiceEditando,
//         data: nuevo,
//       }),
//     });
//   }
//   console.log(nuevo);
//   //   // ⚠️ Esto requiere backend
//   //   await fetch("/guardar", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify(nuevo),
//   //   });
//   form.reset();
//   cargarDatos();
// });

async function guardar(contenido) {
  console.log(JSON.stringify(contenido));
  //const contenido = document.getElementById("editor").value;
  const res = await fetch(`${API}/guardar`, {
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

setInterval(async () => {
  const res = await fetch(`${API}/logs`);
  const logs = await res.json();

  //console.clear();
  logs.forEach((l) => console.log(l));
}, 5000);

cargarDatos();
