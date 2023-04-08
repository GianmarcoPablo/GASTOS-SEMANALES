const formulario = document.querySelector("#agregar-gasto")
const gastoListado = document.querySelector("#gastos ul")

cargarEventListeners()
function cargarEventListeners(){
    document.addEventListener("DOMContentLoaded",preguntarPresupuesto)
    formulario.addEventListener("submit",agregarGasto)
}

class Presupuesto{
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante()
    }
    calcularRestante(){
        const gastado = this.gastos.reduce( (total,gasto)=> total + gasto.cantidad,0)
        this.restante = this.presupuesto - gastado

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
        divMensaje.classList.add("text-center","alert")

        if(tipo === "error"){
            divMensaje.classList.add("alert-danger")
        }else{
            divMensaje.classList.add("alert-success")
        }
        divMensaje.textContent = mensaje

        document.querySelector(".primario").insertBefore(divMensaje, formulario)

        //quitar del html
        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }
    agregarGastoListado(gastos){
        limpiarHTML()
        gastos.forEach(gasto=>{
            const { cantidad, nombre, id} = gasto;

            // crear un LI
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center"
            nuevoGasto.dataset.id = id

            // agegar al HTML
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad}<span>`
            // boton para borrar el gasto
            const btnBorrar = document.createElement("button")
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "borrar &times"
            nuevoGasto.appendChild(btnBorrar)
            // agegar el html

            gastoListado.appendChild(nuevoGasto)
        })
    }
    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto,restante} = presupuestoObj
        const restanteDiv = document.querySelector(".restante")
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove("alert-success","alert-warning")
            restanteDiv.classList.add("alert-danger")
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove("alert-success")
            restanteDiv.classList.add("alert-warning")
        }

        if(restante <= 0){
            ui.imprimirAlerta("El presupuesto se hagotado","error")
            document.querySelector("button[type='submit']").disabled = true
        }
    }
}

const ui = new UI()
let presupuesto

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?")
    if(presupuestoUsuario === "" || isNaN(presupuestoUsuario) || presupuestoUsuario === null|| presupuestoUsuario <= 0){
        window.location.reload()
    }
    presupuesto = new Presupuesto(presupuestoUsuario)
    ui.insertarPresupuesto(presupuesto)
}

function agregarGasto(e){
    e.preventDefault()

    const nombre = document.querySelector("#gasto").value
    const cantidad = Number(document.querySelector("#cantidad").value)

    if(nombre === "" || cantidad === ""){
        ui.imprimirAlerta("Todos los campos son obligatorios","error")
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta("Cantidad no valida","error")
    }else{
        ui.imprimirAlerta("Gasto agregado")
        const gasto = {nombre,cantidad,id: Date.now()}
        presupuesto.nuevoGasto(gasto)
        const {gastos,restante} = presupuesto
        ui.agregarGastoListado(gastos)
        ui.actualizarRestante(restante)
        ui.comprobarPresupuesto(presupuesto)
        formulario.reset()
    }
}

function limpiarHTML(){
    while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild)
    }
}