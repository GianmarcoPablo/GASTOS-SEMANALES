//cuando inicie la pp preguntamos el presupuesto al usuario
//validamos el presupuesto del usuario si no cumple las condiociones se ejecuta window.location.reload()
//guardamos el presupuesto del usuario en la classe presupuesto 
//luego lo mostramos en la interfaz
//luego cuando enviemos los datos del formulario vamos a validar los inputs si no son correctos mostramos un mensaje den la ui

const $formulario = document.querySelector("#agregar-gasto")
const $gastoListado = document.querySelector("#gastos")

cargarEventListeners()
function cargarEventListeners(){
    document.addEventListener("DOMContentLoaded",preguntarPresupuesto)
    $formulario.addEventListener("submit",agregarGasto)
}

class Presupuesto{
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto]
        this.calcularRestante()
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto)=>total+=gasto.cantidad,0)
        this.restante = this.presupuesto - gastado
        console.log(this.restante)
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto=>gasto.id !== id)
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
        setTimeout(() => {
            divMensaje.remove()
        }, 3000);

        const errores = document.querySelectorAll(".error-message")
        if(errores.length === 0){
            document.querySelector(".primario").insertBefore(divMensaje,$formulario)
        }
    }
    mostrarGastoListado(gastos){
        limpiarHTML()
        gastos.forEach(gasto=>{
            const {nombre,cantidad,id} = gasto
            const nuevoGasto = document.createElement("li")
            nuevoGasto.className = `list-group-item d-flex justify-content-between align-items-center`
            nuevoGasto.dataset.id = id

            nuevoGasto.innerHTML =`
                ${nombre} <span class="badge badge-primary badge-pull"> $ ${cantidad}</span>
            `

            const btnBorrar = document.createElement("button")
            btnBorrar.classList.add("btn","btn-danger","borrar-gasto")
            btnBorrar.textContent = "X"
            btnBorrar.onclick = () =>{
                eliminarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar)

            $gastoListado.appendChild(nuevoGasto)
        })
    }
    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto,restante} = presupuestoObj
        const restanteDiv = document.querySelector(".restante")

        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove("alert-sucess","alert-warning")
            restanteDiv.classList.add("alert-danger")
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove("alert-success")
            restanteDiv.classList.add("alert-warning")
        }
        if(restante <=0){
            ui.imprimirAlerta("El presupuesto se ah agotado","error")
            $formulario.querySelector("button[type='submit']").disabled = true
        }
    }
}

const ui = new UI()
let presupuesto;

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("Inserte el presupuesto")
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) ||presupuestoUsuario <= 0){
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
        ui.imprimirAlerta("Gasto agregado correcamente")
        $formulario.reset()
        const gasto = {nombre,cantidad,id: Date.now()}
        presupuesto.nuevoGasto(gasto)
        const {gastos,restante} = presupuesto
        ui.mostrarGastoListado(gastos)
        ui.actualizarRestante(restante)
        ui.comprobarPresupuesto(presupuesto)
    }
}

function limpiarHTML(){
    while($gastoListado.firstChild){
        $gastoListado.removeChild($gastoListado.firstChild)
    }
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id)
}