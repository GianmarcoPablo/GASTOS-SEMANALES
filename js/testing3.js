// variables y selectores
const formulario = document.querySelector("#agregar-gasto")
const gastoListado = document.querySelector("#gastos ul")

cargarEventListeners()
function cargarEventListeners(){
    document.addEventListener("DOMContentLoaded",preguntarPresupuesto)
    formulario.addEventListener("submit",agregarGasto)
}

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto) 
        this.restante = Number(presupuesto)
        this.gastos = []
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto]
        console.log(this.gastos)
    }
}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto,restante} = cantidad
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
        divMensaje.textContent = mensaje
        const errores = document.querySelectorAll(".error-message")
        if(errores.length === 0){
            document.querySelector(".primario").insertBefore(divMensaje, formulario)
        }
        setTimeout(()=>{
            divMensaje.remove()
        },3000)
    }
}

const ui = new UI

let presupuesto;
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presuspuestp?")
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ){
        window.location.reload()
    }
    presupuesto = new Presupuesto(presupuestoUsuario)
    ui.insertarPresupuesto(presupuesto)
    console.log(presupuesto)
}

function agregarGasto(e){
    e.preventDefault()

    const nombre = document.querySelector("#gasto").value
    const cantidad = document.querySelector("#cantidad").value

    if(nombre === "" || cantidad === ""){
        ui.imprimirAlerta("Todos los mensajes son obligatorios","error")
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta("Cantidad no valida","error")
    }else{
        const gastos = {nombre,cantidad,id: Date.now()}
        presupuesto.nuevoGasto(gastos)
        ui.imprimirAlerta("Gasto agregado")
    }
}