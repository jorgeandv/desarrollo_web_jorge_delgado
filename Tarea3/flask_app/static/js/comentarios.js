const validateNombreComentarista = (nombre) => {
    if(!nombre) return false;
    //Validación del largo del nombre (mínimo 3 y máximo 50)
    let lengthValid = nombre.trim().length >= 3 && nombre.trim().length <= 50;

    return lengthValid;
};


const validateTextoComentario = (texto) => {
    if(!texto) return false;
    //Validación del largo del comentario (mínimo 5, y máximo 300 porque en la BD es VARCHAR(300))
    let lengthValid = texto.trim().length >= 5 && texto.trim().length <= 300;

    return lengthValid;
};


//Muestra la lista de campos inválidos (sirve para los errores de JS y para los que responde el servidor)
const mostrarErrores = (invalidInputs) => {
    let validationBox = document.getElementById("val-box-comentario");
    let validationMessageElem = document.getElementById("val-msg-comentario");
    let validationListElem = document.getElementById("val-list-comentario");

    validationListElem.textContent = "";
    // agregar elementos inválidos al elemento val-list.
    for (input of invalidInputs) {
        let listElement = document.createElement("li");
        listElement.innerText = input;
        validationListElem.append(listElement);
    }
    // establecer val-msg
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";

    // aplicar estilos de error
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
};


//Muestra el mensaje de éxito
const mostrarExito = () => {
    let validationBox = document.getElementById("val-box-comentario");
    let validationMessageElem = document.getElementById("val-msg-comentario");
    let validationListElem = document.getElementById("val-list-comentario");

    validationListElem.textContent = "";
    validationMessageElem.innerText = "¡Comentario agregado con éxito!";

    // aplicar estilos de éxito
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    validationBox.hidden = false;
};


const agregarComentario = (avistamientoId) => {
    //Se seleccionan los elementos desde JavaScript
    let formularioComentario = document.forms["formularioC"];
    let nombre = formularioComentario["nombre"].value;
    let texto = formularioComentario["texto"].value;

    //Código para acumular y controlar los errores de validación
    let invalidInputs = [];
    let isValid = true;
    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid &&= false;
    };

    if (!validateNombreComentarista(nombre)) {
        setInvalidInput("Nombre");
    }
    if (!validateTextoComentario(texto)) {
        setInvalidInput("Comentario");
    }

    //Si no es válido, se muestran los errores y el formulario sigue visible para corregir
    if (!isValid) {
        mostrarErrores(invalidInputs);
        return;
    }

    //Si es válido, se envía a Flask de forma asíncrona
    fetch(`${window.origin}/agregar-comentario`, {
        method: "POST",
        body: JSON.stringify({ nombre: nombre, texto: texto, avistamiento_id: avistamientoId }),
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            //El servidor también valida: si responde "error", trae la lista de campos inválidos
            if (data["status"] !== "ok") {
                mostrarErrores(data["data"]);
                return;
            }
            mostrarExito();
            formularioComentario.reset();
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
};
