
var apiFacturar="http://localhost:8080/api/facturar";

const stateFacturar = {
    facturaDetalles: new Array(),
    facturaProductos: new Array(),
    clienteFact: {nombreC: "", idC: "", correo: "", telefono: 0, proveedoresByProveedorid: null, facturasByIdC: null},
    factura: {
        numFact: 0,
        total: 0,
        detallesByNumFact: "",
        clientesByIdCliente: "",
        proveedoresByIdProveedor: "",
        fecha: ""
    },
    item: {nombre:"",  cantidad: 0, precio:0, monto: 0},
    productofac : {nombreP:"",idPr:"",precio:0.0,cant:0,detallesByIdPr:null,proveedoresByIdProd:null},
    mode: "",// ADD, EDIT
    contenido: ""
};


document.addEventListener("DOMContentLoaded",loadedFacturar);
document.addEventListener("visibilitychange",unloadedFacturar);

async function loadedFacturar(event) {
    try {
        await checkuser();

        await mainrender();
    } catch (error) {
        return;
    }

    document.getElementById("botonSeleccionaCliente").addEventListener("click", putCliente);
    document.getElementById("lupaBusquedaCliente").addEventListener("click", goToClientes);
    document.getElementById("speb").addEventListener("click", putProducto);
    document.getElementById("botonBusquedaProducto").addEventListener("click", goToProductos);
    console.log("Se hizo eventos click");



    renderUser();
    renderFacturar();
}

async function unloadedFacturar(event){
   /* if(document.visibilityState==="hidden" && loginstate.logged){
        sessionStorage.setItem("facturas",JSON.stringify(stateFac));
    }*/
}

function putCliente(){
    clienteSelected = document.getElementById("nombreC").value;
    //let request = new Request(`http://localhost:8080/api/clientes/search?nombre=${clienteSelected}`, {method: 'GET'});  /findClient

    let request = new Request(apiFacturar + `/findClient?cliente=${clienteSelected}`, {method: 'GET'});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateFacturar.clienteFact = await response.json();
        sessionStorage.setItem('cliente', JSON.stringify(stateFacturar.clienteFact));
        renderUser();
    })();

}

function renderUser(){
    var cliente=JSON.parse(sessionStorage.getItem('cliente'));
    espacio =document.getElementById("nombreCli");
    //espacio.innerText = `${stateFacturar.clienteFact.nombreC}`;
    espacio.innerText = `${cliente.nombreC}`;
}

function goToClientes(){
    document.location="/Pages/clientes/view.html";
}

function goToProductos(){

    document.location="/Pages/Productos/ProductosView.html";
}

function putProducto(){
    productoSelected = document.getElementById("idP").value;
    //let request = new Request(`http://localhost:8080/api/clientes/search?nombre=${clienteSelected}`, {method: 'GET'});  /findClient
    if(findProdInList(productoSelected)===0){
    let request = new Request(apiFacturar + `/findProducto?idProd=${productoSelected}`, {method: 'GET'});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateFacturar.productofac= await response.json();
        stateFacturar.facturaProductos.push(stateFacturar.productofac);
        insertarEnLista(stateFacturar.productofac);
    })();
    }
}

function insertarEnLista(producto){
    stateFacturar.facturaDetalles.push({
        nombre:producto.nombreP,  cantidad: 1, precio:producto.precio, monto: producto.precio, identi: producto.idPr
    });
    render_listFacturar();
}

function render_listFacturar(){
    var listado=document.getElementById("containerDetalles");
    listado.innerHTML="";
    stateFacturar.facturaDetalles.forEach( item=>renderFacturar(listado,item));

}

function renderFacturar(listado,item){
    let tr = document.createElement("tr");
    tr.innerHTML = `
                     <td>
                         <a id="eliminaDato"><img src="../../Images/xSymbol.png"/></a>
                    </td>
                    <td>
                        <div>${item.cantidad}</div>
                    </td>
                    <td>
                        <div>${item.nombre}</div>
                    </td>
                    <td>
                        <div>${item.precio}</div>
                    </td>
                    <td>
                        <div>${item.monto}</div>
                    </td>
                    <td >
                        <a id="upCantidad"><img src="../../Images/UpArrow.png"/></a>
                    </td>
                    <td >
                       <a id="downCantidad"><img src="../../Images/DownArrow.png"/></a> 
                    </td>
                    `;
    tr.querySelector("#eliminaDato").addEventListener("click", ()=>{eliminarElemento(item.identi)});
    tr.querySelector("#upCantidad").addEventListener("click", ()=>{aumentarCant(item.identi)});
    tr.querySelector("#downCantidad").addEventListener("click", ()=>{disminuirCant(item.identi)});
    listado.append(tr);

}


function aumentarCant(idP){
    for(var i=0; i<stateFacturar.facturaDetalles.length; i=i+1){
        if(stateFacturar.facturaDetalles[i].identi===idP){
            for(var x=0; x<stateFacturar.facturaProductos.length; x=x+1){
                if(stateFacturar.facturaProductos[x].idPr===idP){
                    var cant=stateFacturar.facturaProductos[x].cant;
                }
            }
            if(stateFacturar.facturaDetalles[i].cantidad+1<=cant) {
                stateFacturar.facturaDetalles[i].cantidad = stateFacturar.facturaDetalles[i].cantidad + 1;
                stateFacturar.facturaDetalles[i].monto = stateFacturar.facturaDetalles[i].cantidad * stateFacturar.facturaDetalles[i].precio;
                render_listFacturar();
            }
        }
    }

}

function disminuirCant(idP){
    for(var i=0; i<stateFacturar.facturaDetalles.length; i=i+1){
        if(stateFacturar.facturaDetalles[i].identi===idP){
            if( stateFacturar.facturaDetalles[i].cantidad-1>=1){
            stateFacturar.facturaDetalles[i].cantidad= stateFacturar.facturaDetalles[i].cantidad-1;
            stateFacturar.facturaDetalles[i].monto = stateFacturar.facturaDetalles[i].cantidad * stateFacturar.facturaDetalles[i].precio;
            render_listFacturar();
            }
        }
    }

}

function findProdInList(idP){
    for(var x=0; x<stateFacturar.facturaProductos.length; x=x+1){
        if(stateFacturar.facturaProductos[x].idPr===idP){
            return 1;
        }
    }
    return 0;
}

function eliminarElemento(idP){

}