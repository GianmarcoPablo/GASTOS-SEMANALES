// variables y selectores
const formulario = document.querySelector("#agregar-gasto")
const gastoListado = document.querySelector("#gastos ul")


// eventos
evenlisteners()
function evenlisteners(){
    document.addEventListener("DOMContentLoaded",preguntarPresupuesto)
    formulario.addEventListener("submit",agregarGasto)
}

// clases

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto]
        this.calcularRestante()
    }
    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto)=> total + gasto.cantidad, 0 )
        this.presupuesto = this.presupuesto - gastado;
    }
}

class UI{
    insertarPresupuesto(cantidad){
        //extraemos valor
        const {presupuesto,restante} = cantidad

        //agregamos al html
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }
    imprimirAlerta(mensaje,tipo){
        //crear el div
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
        
        this.limpiarHTML()

        // iterar sobre los gastos
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

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }
    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante
    }
}

//instanciar
const ui = new UI()
let presupuesto

//funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?")
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <=0){
        window.location.reload()
    }
    presupuesto = new Presupuesto(presupuestoUsuario)
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto)
}

//añade gasto
function agregarGasto(e){
    e.preventDefault();

    //leer los datos del formulario
    const nombre = document.querySelector("#gasto").value
    const cantidad = Number(document.querySelector("#cantidad").value) 

    //validar
    if(nombre === "" || cantidad === ""){
        ui.imprimirAlerta("Ambos campo son obligatorios","error")

        return;S
    }else if( cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta("cantidad no válida","error")
        return;
    }

    // generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    //añade un nuevo gasto
    presupuesto.nuevoGasto( gasto )

    //mensaje de todo bien
    ui.imprimirAlerta("gasto agregado correctamente")

    //imprimir gasto
    const { gastos,restante} = presupuesto
    ui.agregarGastoListado(gastos)
    ui.actualizarRestante(restante)
    //reinicia el formulario
    formulario.reset()
}