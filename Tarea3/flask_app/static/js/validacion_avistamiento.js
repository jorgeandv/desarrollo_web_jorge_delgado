const MAX_ARCHIVOS = 5;

//Voluntario y ave ahora son <select>, el valor tiene que ser el id elegido
const validateVoluntario = (voluntario) => {
    if(!voluntario) return false;
    let re = /^[0-9]{1,9}$/;
    return re.test(voluntario);
};



const validateAve = (ave) => {
    if(!ave) return false;
    let re = /^[0-9]{1,9}$/;
    return re.test(ave);
};



const validateLugar = (lugar) => {
    if(!lugar) return false;
    //Validación del largo del lugar (en la BD es VARCHAR(200))
    let lengthValid = lugar.trim().length >= 2 && lugar.trim().length <= 200;

    //Validación del formato del lugar
    let re = /^[a-zA-ZÀ-ÿñÑ\s]{2,}$/;
    let formatValid = re.test(lugar);

    return lengthValid && formatValid;
};



const validateFecha = (fecha) => {
    if (!fecha) return false;
    //Convertir el string a objeto Date
    let fechaIngresada = new Date(fecha);

    //Fecha de hoy
    let hoy = new Date();
    hoy.setHours(23, 59, 59, 999); 

    //Límite del pasado 
    let fechaMinima = new Date();
    fechaMinima.setFullYear(hoy.getFullYear() - 15); // Se aguantan hasta 15 años atrás

    let noEsFutura = fechaIngresada <= hoy;
    let noEsMuyAntigua = fechaIngresada >= fechaMinima;

    return noEsFutura && noEsMuyAntigua;
};



const validateHora = (hora) => {
    if (!hora) return false;
    return true;
}



const validateArchivos = (archivos) => {
    if (!archivos) return false;
    // validación del número de archivos
    let lengthValid = 1 <= archivos.length && archivos.length <= MAX_ARCHIVOS;

    // validación del tipo de archivo
    let typeValid = true;

    for (const file of archivos) {
        // el tipo de archivo debe ser "image/<foo>" o "video/<foo>"
        let fileFamily = file.type.split("/")[0];
        typeValid &&= fileFamily == "image" || fileFamily == "video";
    }

    return lengthValid && typeValid;
};



const validateForm = () => {
    //Se seleccionan los elementos desde JavaScript
    let formularioRegistroAve = document.forms["formularioA"];
    let voluntario = formularioRegistroAve["voluntario"].value;
    let ave = formularioRegistroAve["ave"].value;
    let lugar = formularioRegistroAve["lugar"].value;
    let fecha = formularioRegistroAve["fecha"].value;
    let hora = formularioRegistroAve["hora"].value;
    let archivos = formularioRegistroAve["archivos"].files;

    //Código para acumular y controlar los errores de validación
    let invalidInputs = [];
    let isValid = true;
    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid &&= false;
    };

    if (!validateVoluntario(voluntario)) {
        setInvalidInput("Voluntario");
    }
    if (!validateAve(ave)) {
        setInvalidInput("Ave");
    }
    if (!validateLugar(lugar)) {
        setInvalidInput("Lugar");
    }
    if (!validateFecha(fecha)) {
        setInvalidInput("Fecha");
    }
    if (!validateHora(hora)) {
        setInvalidInput("Hora");
    }
    if (!validateArchivos(archivos)) {
        setInvalidInput("Archivos");
    }


    // finalmente mostrar la validación
    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");

    if (!isValid) {
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
    } else {
        // Ocultar el formulario
        formularioRegistroAve.style.display = "none";

        // establecer mensaje de éxito
        validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
        validationListElem.textContent = "";

        // aplicar estilos de éxito
        validationBox.style.backgroundColor = "#ddffdd";
        validationBox.style.borderLeftColor = "#4CAF50";

        // Agregar botones para enviar el formulario o volver
        let submitButton = document.createElement("button");
        submitButton.innerText = "Enviar";
        submitButton.style.marginRight = "10px";
        submitButton.addEventListener("click", () => {
            // ahora sí hay backend: se envían los datos a la URL de Flask (action del form)
            formularioRegistroAve.submit();
        });

        let backButton = document.createElement("button");
        backButton.innerText = "Volver";
        backButton.addEventListener("click", () => {
            // Mostrar el formulario nuevamente (vacío = vuelve al display del CSS)
            formularioRegistroAve.style.display = "";
            validationBox.hidden = true;
        });

        validationListElem.appendChild(submitButton);
        validationListElem.appendChild(backButton);

        // hacer visible el mensaje de validación
        validationBox.hidden = false;
    }
    return isValid;
};
