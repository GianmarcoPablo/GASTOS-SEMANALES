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
    agregarGastoListado(gastos){
        limpiarHTML()
        gastos.forEach(gasto=>{
            const {nombre,cantidad,id} = gasto
            const nuevoGasto = document.createElement("li")
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center"
            nuevoGasto.dataset.id = id
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">${cantidad}</span>`
            const btnBorrar = document.createElement("button")
            btnBorrar.classList.add("btn","btn-danger","borrar-gasto")
            btnBorrar.textContent = "X"
            nuevoGasto.appendChild(btnBorrar)
            gastoListado.appendChild(nuevoGasto)
        })
    }
}
let presupuesto;
const ui = new UI()

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?")

    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
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
        ui.imprimirAlerta("Todos los campos son obligatorios","error")
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta("Cantidad no valida","error")
    }else{
        const gasto = {nombre,cantidad,id: Date.now() }
        presupuesto.nuevoGasto(gasto)
        ui.imprimirAlerta("Gasto Agregado")

        const {gastos} = presupuesto
        ui.agregarGastoListado(gastos)
        formulario.reset()
    }
}

function limpiarHTML(){
    while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild)
    }
}