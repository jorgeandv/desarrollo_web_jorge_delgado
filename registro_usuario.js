//Seleccionar el boton de registro por su id
let botonRegistro = document.getElementById("boton-register");
let divDeBotones = document.querySelector(".botones-no-formularios")
let formularioRegistro = document.getElementById("formulario-registro");

//Evento que pasa al registrarse
formularioRegistro.addEventListener("submit", function (event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    else {
        botonRegistro.remove();
        let botonAvistamiento = document.createElement("button");
        botonAvistamiento.innerHTML = "<a href='../avistamiento/avistamiento.html'>Registrar un avistamiento</a>";
        botonAvistamiento.setAttribute("id", "boton-avistamiento");
        divDeBotones.appendChild(botonAvistamiento);
        formularioRegistro.reset();     //limpia el formulario
    }

})