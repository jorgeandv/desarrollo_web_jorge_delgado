const validateNombre = (nombre) => {
    if(!nombre) return false;
    //Validación del largo del nombre
    let lengthValid = nombre.trim().length >= 2 && nombre.trim().length <= 100;

    //Validación del formato del nombre
    let re = /^[a-zA-ZÀ-ÿñÑ\s]{2,}$/;
    let formatValid = re.test(nombre);

    return lengthValid && formatValid;
};


const validateApellido = (apellido) => {
    if(!apellido) return false;
    //Validación del largo del apellido
    let lengthValid = apellido.trim().length >= 2 && apellido.trim().length <= 100;

    //Validación del formato del apellido
    let re = /^[a-zA-ZÀ-ÿñÑ\s]{2,}$/;
    let formatValid = re.test(apellido);

    return lengthValid && formatValid;
};


const validateEmail = (email) => {
    if(!email) return false;
    //Validación del largo del email
    let lengthValid = email.trim().length >= 6 && email.trim().length <= 80;

    //Validación del formato del email
    let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let formatValid = re.test(email);

    return lengthValid && formatValid;
};


const validateTelefono = (telefono) => {
    if(!telefono) return false;
    //Validación del largo del telefono
    let lengthValid = telefono.trim().length >= 8 && telefono.trim().length <= 15;

    //Validación del formato del telefono
    let re = /^[0-9]+$/;
    let formatValid = re.test(telefono);

    return lengthValid && formatValid;
};


//Region y comuna ahora son <select>, el valor tiene que ser el id elegido
const validateRegion = (region) => {
    if(!region) return false;
    let re = /^[0-9]{1,9}$/;
    return re.test(region);
};


const validateComuna = (comuna) => {
    if(!comuna) return false;
    let re = /^[0-9]{1,9}$/;
    return re.test(comuna);
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

    //Finalmente mostrar la validación
    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");

    if (!isValid) {
        validationListElem.textContent = "";
        // agregar elementos inválidos al elemento val-list.
        for (const input of invalidInputs) {
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
            // ahora sí hay backend: se envían los datos a la URL de Flask (action del form)
            formularioRegistro.submit();
        });

        let backButton = document.createElement("button");
        backButton.innerText = "Volver";
        backButton.addEventListener("click", () => {
            // Mostrar el formulario nuevamente (vacío = vuelve al display del CSS)
            formularioRegistro.style.display = "";
            validationBox.hidden = true;
        });

        validationListElem.appendChild(submitButton);
        validationListElem.appendChild(backButton);

        // hacer visible el mensaje de validación
        validationBox.hidden = false;
    }
    return isValid;
};