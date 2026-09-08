const validateNombre = (nombre) => {
    if(!nombre) return false;
    //Validación del largo del nombre
    let lengthValid = nombre.trim().length >= 2;

    //Validación del formato del nombre
    let re = /^[a-zA-ZÀ-ÿñÑ\s]{2,}$/;
    let formatValid = re.test(nombre);

    return lengthValid && formatValid;
};



const validateApellido = (apellido) => {
    if(!apellido) return false;
    //Validación del largo del apellido
    let lengthValid = apellido.trim().length >= 2;

    //Validación del formato del apellido
    let re = /^[a-zA-ZÀ-ÿñÑ\s]{2,}$/;
    let formatValid = re.test(apellido);

    return lengthValid && formatValid;
};



const validateEmail = (email) => {
    if(!email) return false;
    //Validación del largo del email
    let lengthValid = email.trim().length >= 6;

    //Validación del formato del email
    let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let formatValid = re.test(email);

    return lengthValid && formatValid;
};



const validateTelefono = (telefono) => {
    if(!telefono) return false;
    //Validación del largo del telefono
    let lengthValid = telefono.trim().length >= 8;
    
    //Validación del formatodel telefono
    let re = /^[0-9]+$/;
    let formatValid = re.test(telefono);

    return lengthValid && formatValid;
};



const validateRegion = (region) => {
    if(!region) return false;
    //Validación del largo de la región
    let lengthValid = region.trim().length >= 5;

    //Validación del formato de la región
    let re = /^[a-zA-ZÀ-ÿñÑ\s]{2,}$/;
    let formatValid = re.test(region);

    return lengthValid && formatValid;
};



const validateComuna = (comuna) => {
    if(!comuna) return false;
    //Validación del largo de la comuna
    let lengthValid = comuna.trim().length >= 4;

    //Validación del formato de la comuna
    let re = /^[a-zA-ZÀ-ÿñÑ\s]{2,}$/;
    let formatValid = re.test(comuna);

    return lengthValid && formatValid;
};



const validatePostal = (postal) => {
    if(!postal) return false;
    //Validación del largo del numero postal
    let lengthValid = postal.trim().length >= 7;
    //Validación del formato del numero postal
    let re = /^\d{7}$/;
    let formatValid = re.test(postal);

    return lengthValid && formatValid;
};



const validateForm = () => {
    //Se seleccionan los elementos desde JavaScript
    let formularioRegistro = document.forms["formularioR"];
    let nombre = formularioRegistro["nombre"].value
    let apellido = formularioRegistro["apellido"].value
    let email = formularioRegistro["email"].value
    let telefono = formularioRegistro["telefono"].value
    let region = formularioRegistro["region"].value
    let comuna = formularioRegistro["comuna"].value
    let postal = formularioRegistro["postal"].value

  //Código para acumular y controlar los errores de validación 
    let invalidInputs = [];
    let isValid = true;
    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid &&= false;
    };    

    if (!validateNombre(nombre)) {
        setInvalidInput("Nombre");
    }
    if (!validateApellido(apellido)) {
        setInvalidInput("Apellido");
    }
    if (!validateEmail(email)) {
        setInvalidInput("Email");
    }
    if (!validateTelefono(telefono)) {
        setInvalidInput("Telefono");
    }
    if (!validateRegion(region)) {
        setInvalidInput("Region");
    }
    if (!validateComuna(comuna)) {
        setInvalidInput("Comuna");
    }
    if (!validatePostal(postal)) {
        setInvalidInput("Postal");
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
    } 
    else {
        // Ocultar el formulario
        formularioRegistro.style.display = "none";

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
        // myForm.submit();
        // no tenemos un backend al cual enviarle los datos
        });

        let backButton = document.createElement("button");
        backButton.innerText = "Volver";
        backButton.addEventListener("click", () => {
            // Mostrar el formulario nuevamente
            formularioRegistro.style.display = "block";
            validationBox.hidden = true;
        });

        validationListElem.appendChild(submitButton);
        validationListElem.appendChild(backButton);

        // hacer visible el mensaje de validación
        validationBox.hidden = false;
    }
    return isValid;   //Esto me sirve para el registro_usuario.js
};


