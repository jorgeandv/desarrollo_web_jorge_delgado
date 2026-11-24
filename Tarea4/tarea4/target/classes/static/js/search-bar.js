let searchForm = document.getElementById("search-form");
let inputSearch = document.getElementById("search-input");
let matchSearch = document.getElementById("search-list");

//Devuelve el texto en HTML, con las partes que calzan (calzan con lo buscado dentro de un span)
let destacarTexto = (texto, buscado) => {
  let textoLower = texto.toLowerCase();
  let buscadoLower = buscado.toLowerCase();

  let resultado = "";
  let inicio = 0;
  let posicion = textoLower.indexOf(buscadoLower);
  while (posicion !== -1) {
    //Parte del texto antes de la coincidencia (sin destacar) + parte que calza (destacada)
    resultado += texto.substring(inicio, posicion);
    resultado += `<span class="texto-destacado">${texto.substring(posicion, posicion + buscado.length)}</span>`;

    //Se sigue buscando después de la coincidencia
    inicio = posicion + buscado.length;
    posicion = textoLower.indexOf(buscadoLower, inicio);
  }
  //Resto del texto (sin destacar)
  resultado += texto.substring(inicio);
  return resultado;
};

//La nota tiene que ser un numero entero entre 1 y 7 (ambos inclusive)
const validateNota = (nota) => {
  if (!nota) return false;
  let re = /^[1-7]$/;
  return re.test(nota);
};

//Envia la nota elegida al servidor de forma asincrona
const agregarNota = (avistamientoId, selectNota, mensajeNota) => {
  let notaElegida = selectNota.value;

  //Si la nota no es valida, no se envia
  if (!validateNota(notaElegida)) {
    mensajeNota.innerText = "Debe seleccionar una nota entre 1 y 7.";
    mensajeNota.className = "mensaje-error";
    mensajeNota.hidden = false;
    return;
  }

  //Los datos van en la URL y Spring los lee con @RequestParam
  fetch(`${window.origin}/agregar-nota?avistamiento_id=${avistamientoId}&nota=${notaElegida}`, {
    method: "POST",
    cache: "no-cache",
  })
    .then((response) => response.json())
    .then((data) => {
      //El servidor tambien valida (si responde "error", trae el mensaje)
      if (data["status"] !== "ok") {
        mensajeNota.innerText = data["data"];
        mensajeNota.className = "mensaje-error";
        mensajeNota.hidden = false;
        return;
      }
      mensajeNota.innerText = "¡Nota agregada con éxito!";
      mensajeNota.className = "mensaje-exito";
      mensajeNota.hidden = false;

      //Se esconde el select y vuelve a "Seleccione una nota"
      selectNota.hidden = true;
      selectNota.value = "";
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
};

let populateMatchList = (matchList) => {
  //Texto que escribio el usuario, para destacarlo en los resultados
  let buscado = inputSearch.value;

  // delete previous childs
  while (matchSearch.firstChild) {
    matchSearch.removeChild(matchSearch.firstChild);
  }

  //Si no hay resultados, se muestra un mensaje
  if (matchList.length === 0) {
    let sinResultados = document.createElement("p");
    sinResultados.innerText = "No se encontraron avistamientos para la búsqueda.";
    matchSearch.append(sinResultados);
    matchSearch.hidden = false;
    return;
  }

  //Con const, cada resultado tiene su propia variable avistamiento (como en select.js del aux 3).
  //Asi, cuando se elige una nota, se usa el id de ESE avistamiento y no el del ultimo
  for (const avistamiento of matchList) {
    //Contenedor del avistamiento
    let avistamientoContainer = document.createElement("div");
    avistamientoContainer.className = "avistamiento-container";

    // Nombre del voluntario
    let voluntario = document.createElement("p");
    voluntario.innerHTML = "Voluntario(a): " + destacarTexto(avistamiento["voluntario"], buscado);

    //Dia del avistamiento, fecha_hora llega como "AAAA-MM-DDTHH:MM", se deja como DD-MM-AAAA
    const [year, month, day] = avistamiento["fecha_hora"].split("T")[0].split("-");
    let dia = document.createElement("p");
    dia.innerText = "Día: " + `${day}-${month}-${year}`;

    //Nombre del ave
    let ave = document.createElement("p");
    ave.innerHTML = "Ave: " + destacarTexto(avistamiento["ave"], buscado);

    //Nombre de la comuna (es la comuna del voluntario)
    let comuna = document.createElement("p");
    comuna.innerHTML = "Comuna: " + destacarTexto(avistamiento["comuna"], buscado);

    //Nota promedio del avistamiento (llega "-" si todavia no ha sido evaluado)
    let nota = document.createElement("p");
    nota.innerText = "Nota: " + avistamiento["nota"];

    //Boton para evaluar el avistamiento
    let botonEvaluar = document.createElement("button");
    botonEvaluar.type = "button";
    botonEvaluar.className = "boton-evaluar";
    botonEvaluar.innerText = "Evaluar";

    //Select con las notas del 1 al 7 (escondido hasta que se hace clic en "Evaluar")
    let selectNota = document.createElement("select");
    selectNota.className = "select-nota";
    selectNota.hidden = true;

    //Primera opcion sin valor, para que el usuario tenga que elegir una nota
    let opcionVacia = document.createElement("option");
    opcionVacia.value = "";
    opcionVacia.text = "Seleccione una nota";
    selectNota.appendChild(opcionVacia);

    //Opciones con las notas del 1 al 7
    for (let i = 1; i <= 7; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = i;
      selectNota.appendChild(option);
    }

    //Al hacer clic en "Evaluar" se muestra el select para que el usuario elija la nota
    botonEvaluar.addEventListener("click", () => {
      selectNota.hidden = false;
    });

    //Mensaje para avisar si la nota se agrego o no (escondido al principio)
    let mensajeNota = document.createElement("p");
    mensajeNota.hidden = true;

    //Al seleccionar una nota, se envia al servidor
    selectNota.addEventListener("change", () => {
      agregarNota(avistamiento["id"], selectNota, mensajeNota);
    });

    //Agrega los elementos al contenedor del avistamiento
    avistamientoContainer.append(voluntario);
    avistamientoContainer.append(dia);
    avistamientoContainer.append(ave);
    avistamientoContainer.append(comuna);
    avistamientoContainer.append(nota);
    avistamientoContainer.append(botonEvaluar);
    avistamientoContainer.append(selectNota);
    avistamientoContainer.append(mensajeNota);

    //Agrega el avistamiento a la lista
    matchSearch.append(avistamientoContainer);
  }
  matchSearch.hidden = false;
};


let fetchAJAX = (url) => {
  fetch(url, {
    mode: "cors",
    credentials: "include",
  }) // 1 acceder al url
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // 2 parseamos el response a un json
    })
    .then((ajaxResponse) => {
      populateMatchList(ajaxResponse["data"]); // 3 le pasamos el data a populate...()
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
};


let handleAJAX = (event) => {
  //Si el input queda vacio no se busca (la URL quedaria incompleta) y se esconde la lista
  //(no usa populateMatchList([]) porque mostraria el mensaje de "no se encontraron")
  if (event.target.value === "") {
    matchSearch.hidden = true;
    return;
  }
  fetchAJAX(`${window.origin}/get-avistamientos/${event.target.value}`);
};

inputSearch.addEventListener("input", handleAJAX);
//Al presionar Enter el formulario no se envia (así, no se recarga la pagina)
searchForm.addEventListener("submit", (event) => event.preventDefault());
