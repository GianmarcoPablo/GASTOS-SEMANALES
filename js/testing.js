//VARIABLES Y SELECTORES
const $formulario = document.querySelector("#agregar-gasto")
const $gastoListado = document.querySelector("#gastos")



// EVENTOS

eventListeners()
function eventListeners(){
    document.addEventListener("DOMContentLoaded",preguntarPresupuesto)
    $formulario.addEventListener("submit",agregarGasto)
}


// CLASES

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }
}

class UI{
    insertarPresupuest(cantidad){
        //extraemos valor del objeto
        const {presupuesto,restante } = cantidad
        //agregamos al html
        document.querySelector("#total").textContent = presupuesto
        document.querySelector("#restante").textContent = restante
    }
    imprimirAlerta(mensaje,tipo){
        const divMensaje = document.createElement("div")
        divMensaje.classList.add("text-center","alert","error-message")
        if(tipo === "error"){
            divMensaje.classList.add("alert-danger")
        }else{
            divMensaje.classList.add("alert-success")
        }
        setTimeout(()=>{
            divMensaje.remove()
        },3000)

        const errores = document.querySelectorAll(".error-message")
        if(errores.length === 0){
            document.querySelector(".primario").insertBefore(divMensaje, $formulario)
        }
        divMensaje.textContent = mensaje

    }
}

const ui = new UI()
let presupuesto

// FUNCIONES

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto")
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload()
    }
    presupuesto = new Presupuesto(presupuestoUsuario)
    ui.insertarPresupuest(presupuesto)
}

function agregarGasto(e){
    e.preventDefault()
    //leer datos del formulario
    const $nombre = document.querySelector("#gasto").value
    const $cantidad = document.querySelector("#cantidad").value

    if($nombre === "" || $cantidad === ""){
        ui.imprimirAlerta("Todos los campos son obrligatorios","eror")
    }else if($cantidad <= 0 || isNaN($cantidad)){
        ui.imprimirAlerta("cantidad no valida", "error")
    }else{
        ui.imprimirAlerta("Gasto agregado correctamente","exito")
    }
}