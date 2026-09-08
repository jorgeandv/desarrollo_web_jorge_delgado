const validateTipo = (tipo) => {
    if(!tipo) return false;
    //Validación del largo del tipo
    let lengthValid = tipo.trim().length >= 2;

    //Validación del formato del tipo
    let re = /^[a-zA-ZÀ-ÿñÑ\s]{2,}$/;
    let formatValid = re.test(tipo);

    return lengthValid && formatValid;
};



const validateAve = (ave) => {
    if(!ave) return false;
    //Validación del largo del ave
    let lengthValid = ave.trim().length >= 2;

    //Validación del formato del ave
    let re = /^[a-zA-ZÀ-ÿñÑ\s]{2,}$/;
    let formatValid = re.test(ave);

    return lengthValid && formatValid;
};



const validateLugar = (lugar) => {
    if(!lugar) return false;
    //Validación del largo del lugar
    let lengthValid = lugar.trim().length >= 2;

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
    let lengthValid = 1 <= archivos.length;

    // validación del tipo de archivo
    let typeValid = true;

    for (const file of archivos) {
        // el tipo de archivo debe ser "image/<foo>" o "video/<foo>"
        let fileFamily = file.type.split("/")[0];
        typeValid &&= fileFamily == "image" || fileFamily == "video";
    }

    return lengthValid && typeValid;
    };



const validateSelect = (select) => {
    if (!select) return false;
    return true;
}



const validateForm = () => {
    //Se seleccionan los elementos desde JavaScript
    let formularioRegistroAve = document.forms["formularioA"];
    let tipo = formularioRegistroAve["tipo"].value
    let ave = formularioRegistroAve["ave"].value
    let lugar = formularioRegistroAve["lugar"].value
    let fecha = formularioRegistroAve["fecha"].value
    let hora = formularioRegistroAve["hora"].value
    let archivo = formularioRegistroAve["archivo"].files 

    //Código para acumular y controlar los errores de validación 
    let invalidInputs = [];
    let isValid = true;
    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid &&= false;
    };    

    if (!validateTipo(tipo)) {
        setInvalidInput("Tipo");
    }
    if (!validateAve(ave)) {
        setInvalidInput("Nombre");
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
    if (!validateArchivos(archivo)) {
        setInvalidInput("Archivos");
    }    


    // finalmente mostrar la validación
    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");
    let formContainer = document.querySelector(".main-container");

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
        // formularioRegistroAve.submit();
        // no tenemos un backend al cual enviarle los datos
        });

        let backButton = document.createElement("button");
        backButton.innerText = "Volver";
        backButton.addEventListener("click", () => {
        // Mostrar el formulario nuevamente
        formularioRegistroAve.style.display = "block";
        validationBox.hidden = true;
        });

        validationListElem.appendChild(submitButton);
        validationListElem.appendChild(backButton);

        // hacer visible el mensaje de validación
        validationBox.hidden = false;
    }
    return isValid; //Esto me sirve para el avistamiento.js
};



