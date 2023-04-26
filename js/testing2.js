//cuando inicie la pp preguntamos el presupuesto al usuario
//validamos el presupuesto del usuario si no cumple las condiociones se ejecuta window.location.reload()
//guardamos el presupuesto del usuario en la classe presupuesto 
//luego lo mostramos en la interfaz
//luego cuando enviemos los datos del formulario vamos a validar los inputs si no son correctos mostramos un mensaje den la ui

const $formulario = document.querySelector("#agregar-gasto")
const $gastoListado = document.querySelector("#gastos")

eventListeners()
function eventListeners(){
    document.addEventListener("DOMContentLoaded",preguntarPresupuesto)    
    $formulario.addEventListener("submit",agregarGasto)
}

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto =  Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto]
    }
}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad
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

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);

        const errores = document.querySelectorAll(".error-message")
        if(errores.length === 0){
            document.querySelector(".primario").insertBefore(divMensaje,$formulario)
        }
        
    }
    agregarGastoListado(gastos){
        limpiarHTML()
        gastos.forEach(gasto=>{
            const {nombre,cantidad,id} = gasto
            const nuevoGasto = document.createElement("li")
            nuevoGasto.className = `list-group-item d-flex justify-content-between align-items-center`
            nuevoGasto.dataset.id = id

            nuevoGasto.innerHTML =`
                ${nombre} <span class="badge badge-primary badge-pull">${cantidad}</span>
            `

            const btnBorrar = document.createElement("button")
            btnBorrar.classList.add("btn","btn-danger","borrar-gasto")
            btnBorrar.textContent = "X"
            nuevoGasto.appendChild(btnBorrar)

            $gastoListado.appendChild(nuevoGasto)
        })
    }
}

const ui = new UI()
let presupuesto

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("Ingresa tu presupuesto")
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
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
        return
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta("Cantidad no valida","error")
        return
    }else{
        ui.imprimirAlerta("Gasto agregado Correctamente","exito")
        $formulario.reset()

        //genera un objeto con el gasto y cantidad
        const gasto = {nombre,cantidad,id: Date.now()} //object literal enjasment
        presupuesto.nuevoGasto(gasto)

        const {gastos} = presupuesto
        ui.agregarGastoListado(gastos)
    }
}

function limpiarHTML(){
    while($gastoListado.firstChild){
        $gastoListado.removeChild($gastoListado.firstChild)
    }
}