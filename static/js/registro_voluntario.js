//Seleccionar el formulario y los selects por su id
let formularioRegistro = document.getElementById("formulario-registro");
let regionSelect = document.getElementById("region");
let comunaSelect = document.getElementById("comuna");

//Todas las comunas, sin la opción inicial
const todasLasComunas = Array.from(comunaSelect.options).slice(1);

//Muestra solo las comunas de la región elegida
const poblarComunas = () => {
    comunaSelect.textContent = ""; 

    let opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.text = "Seleccione una comuna";
    comunaSelect.appendChild(opcionInicial);

    for (const comuna of todasLasComunas) {
        if (comuna.dataset.region === regionSelect.value) {
            comunaSelect.appendChild(comuna);
        }
    }
};

regionSelect.addEventListener("change", poblarComunas);
poblarComunas();

//Evento que pasa al registrarse
formularioRegistro.addEventListener("submit", function (event) {
    event.preventDefault();
    validateForm();
});