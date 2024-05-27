
var apiFacturar="http://localhost:8080/api/facturar";

const stateFacturar = {
    facturaDetalles: [],
    facturaProductos: [],
    clienteFact: {nombreC: "", idC: "", correo: "", telefono: 0, proveedoresByProveedorid: null, facturasByIdC: null},
    item: {nombre:"",  cantidad: 0, precio:0, monto: 0},
    productofac : {nombreP:"",idPr:"",precio:0.0,cant:0,detallesByIdPr:null,proveedoresByIdProd:null},
    mode: "",// ADD, EDIT
    contenido: ""
};


document.addEventListener("DOMContentLoaded",loadedFacturar);
//document.addEventListener("visibilitychange",loadedFacturar);

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
    document.getElementById("finCompra").addEventListener("click", guardarFactura);
    console.log("Se hizo eventos click");

    //set them to be just a new Array() if it's the first time
   /* if (! sessionStorage.getItem('factDet')) {
        sessionStorage.setItem('factDet', JSON.stringify(new Array()));
    }

    if (! sessionStorage.getItem('factProd')) {
        sessionStorage.setItem('factProd', JSON.stringify(new Array()));
    }
    else {
        render_listFacturar()
    }*/



    renderUser();
    render_listFacturar();
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
    espacio =document.getElementById("nombreCli");
    espacio.innerText = "";
    if (sessionStorage.getItem('cliente')) {
    var cliente=JSON.parse(sessionStorage.getItem('cliente'));
    espacio =document.getElementById("nombreCli");
    espacio.innerText = `${cliente.nombreC}`;
    }
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

    //Para actualizar la lista
    sessionStorage.removeItem('factDet');
    sessionStorage.removeItem('factProd');
    sessionStorage.setItem('factDet', JSON.stringify(stateFacturar.facturaDetalles));
    sessionStorage.setItem('factProd', JSON.stringify(stateFacturar.facturaProductos));
    render_listFacturar();
}

function render_listFacturar(){
    var listado=document.getElementById("containerDetalles");
    listado.innerHTML="";
    if (sessionStorage.getItem('factDet') && sessionStorage.getItem('factProd')) {

        let listaDet = JSON.parse(sessionStorage.getItem('factDet'));
        let listaProd = JSON.parse(sessionStorage.getItem('factProd'));
        stateFacturar.facturaDetalles = listaDet;
        stateFacturar.facturaProductos = listaProd;

        stateFacturar.facturaDetalles.forEach(item => renderFacturar(listado, item));
    }
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
                sessionStorage.removeItem('factDet');
                sessionStorage.removeItem('factProd');
                sessionStorage.setItem('factDet', JSON.stringify(stateFacturar.facturaDetalles));
                sessionStorage.setItem('factProd', JSON.stringify(stateFacturar.facturaProductos));
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
                sessionStorage.removeItem('factDet');
                sessionStorage.removeItem('factProd');
                sessionStorage.setItem('factDet', JSON.stringify(stateFacturar.facturaDetalles));
                sessionStorage.setItem('factProd', JSON.stringify(stateFacturar.facturaProductos));
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
    for(var i=0; i<stateFacturar.facturaDetalles.length; i=i+1) {
        if (stateFacturar.facturaDetalles[i].identi === idP) {
            stateFacturar.facturaDetalles.splice(i, 1);
            sessionStorage.removeItem('factDet');
            sessionStorage.setItem('factDet', JSON.stringify(stateFacturar.facturaDetalles));
            render_listFacturar();
        }
    }
        for(var x=0; x<stateFacturar.facturaProductos.length; x=x+1){
            if(stateFacturar.facturaProductos[x].idPr===idP){
                sessionStorage.removeItem('factProd');
                stateFacturar.facturaProductos.splice(x,1);
                sessionStorage.setItem('factProd', JSON.stringify(stateFacturar.facturaProductos));
            }
    }
}


function guardarFactura(){
    var cliente=JSON.parse(sessionStorage.getItem('cliente'));
    var clienteId = cliente.idC;
    var prov = loginstate.Usuarios.proveedoresByIdprov.idP;
    var tot=0;
    for(var i=0; i<stateFacturar.facturaDetalles.length; i=i+1) {
      tot = tot + stateFacturar.facturaDetalles[i].monto;
    }
    tot = tot.toString();

    //let request = new Request(apiFacturar + `/guardaFact?provId=${prov}?clientId=${clienteId}?monto=${tot}`, {method: 'POST'});
    let request = new Request(apiFacturar + `/guardaFact?provId=${prov}&clientId=${clienteId}&monto=${tot}`, {method: 'POST'});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        guardaDetalles();
        stateFacturar.facturaProductos = [];
        stateFacturar.facturaDetalles=[];
        stateFacturar.clienteFact= {nombreC: "", idC: "", correo: "", telefono: 0, proveedoresByProveedorid: null, facturasByIdC: null};
        sessionStorage.removeItem("cliente");
        sessionStorage.removeItem('factDet');
        sessionStorage.removeItem('factProd');
        render_listFacturar();
        renderUser();
    })();
}

function guardaDetalles(){
    var prov = loginstate.Usuarios.proveedoresByIdprov.idP;
    for(var i=0; i<stateFacturar.facturaDetalles.length; i=i+1) {
        var cant=stateFacturar.facturaDetalles[i].cantidad;
        var monto=stateFacturar.facturaDetalles[i].monto;
        monto = monto.toString();
        cant = cant.toString();
        var idprod=stateFacturar.facturaDetalles[i].identi;
        let request = new Request(apiFacturar + `/guardaDet?idP=${prov}&monto=${monto}&cantidad=${cant}&idProd=${idprod}`, {method: 'POST'});
        (async ()=>{
            const response = await fetch(request);
            if (!response.ok) {errorMessage(response.status);return;}
            console.log("se guardo bien un detalle");
        })();
    }

}
