//Seleccionar el formulario por su id
let formularioRegistroAve = document.getElementById("formulario-registro-ave");

//Evento que pasa al registrar: primero se valida con JavaScript.
//Si es válido, validateForm muestra el botón "Enviar", que manda los datos a Flask.
formularioRegistroAve.addEventListener("submit", function (event) {
    event.preventDefault();
    validateForm();
});
