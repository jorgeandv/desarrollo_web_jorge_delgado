const arregloAuxiliar = []; //Ayuda para ver que no ingrese un option con el mismo tipo
const datos = [];   //Acá meto los avistamientos del usuario, cada elemento de datos es un objeto

//Desplegar los tipos
const poblarTipos = () => {
    let tipoSelect = document.getElementById("select-tipo");
    for (const ingresados of datos) {   //ingresados es cada elemento de datos, cada elemento de datos es un objeto (arreglo asociativo)
        let tipo = ingresados["tipo"];
        if (!arregloAuxiliar.includes(tipo)) {
            let option = document.createElement("option");
            option.value = tipo;
            option.text = tipo;     
            tipoSelect.appendChild(option);
            arregloAuxiliar.push(tipo);
        }        
    }
}


//Seleccionar el boton de registro por su id
let formularioRegistroAve = document.getElementById("formulario-registro-ave");
//Selecciono los inputs
let tipo = document.getElementById("tipo")
let ave = document.getElementById("ave")
let lugar = document.getElementById("lugar")
let fecha = document.getElementById("fecha")
let hora = document.getElementById("hora")
let archivo = document.getElementById("archivo");


//Evento que pasa al registrarse 
formularioRegistroAve.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }
    //Creamos el objeto con los 5 datos que registra el usuario
    const avistamiento = {
        tipo: tipo.value,
        ave: ave.value,
        lugar: lugar.value,
        fecha: fecha.value,
        hora: hora.value,
        archivo: archivo.files[0],
    }

    //Metemos el objeto al arreglo datos
    datos.push(avistamiento)
    poblarTipos();
    formularioRegistroAve.reset(); 
    console.log(datos);
})



let formularioListaAvistamientos = document.getElementById("formulario-lista-avistamientos");

formularioListaAvistamientos.addEventListener("submit", function (event) {
    event.preventDefault();
    const datosFiltradosTipo = datos.filter((dato) => {
        let tipoSelect = document.getElementById("select-tipo");
        return dato["tipo"] == tipoSelect.value;
        });
    console.log(datosFiltradosTipo);
    // formularioListaAvistamientos.reset();
    
    let selectOrdenar = document.getElementById("select-ordenar-por")
    let selectDireccion = document.getElementById("select-direccion")
    //Ordenamos por fecha
    if (selectOrdenar.value == "fecha" && selectDireccion.value == "ascendente") {
        datosFiltradosTipo.sort((a,b) => new Date(a.fecha) -new Date (b.fecha))
    }
    else if (selectOrdenar.value == "fecha" && selectDireccion.value == "descendente") {
        datosFiltradosTipo.sort((a,b) => new Date(b.fecha) -new Date (a.fecha))
    }
    
    //Ordenamos por lugar
    if (selectOrdenar.value == "lugar" && selectDireccion.value == "ascendente") {
        datosFiltradosTipo.sort((a,b) => a.lugar.localeCompare(b.lugar))
    }
    else if (selectOrdenar.value == "lugar" && selectDireccion.value == "descendente") {
        datosFiltradosTipo.sort((a,b) => b.lugar.localeCompare(a.lugar))
    }
    console.log(datosFiltradosTipo);
    
    let div = document.getElementById("mostrar")
    div.textContent = "";  //  limpia el contenido anterior antes de mostrar los nuevos resultados
    for (const elemento of datosFiltradosTipo) {
        let nuevoParrafo = document.createElement("p")
        nuevoParrafo.textContent = `El ave es de tipo ${elemento.tipo}, su nombre es ${elemento.ave}, fue avistada en ${elemento.lugar} el ${elemento.fecha} a las ${elemento.hora}`
        div.appendChild(nuevoParrafo);
    }
})





