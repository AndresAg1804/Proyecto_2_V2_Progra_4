var apiPro="http://localhost:8080/api/productos";

var statePro ={
    facturaDetalles_PRODUCTOS: [],
    facturaProductos_PRODUCTOS: [],
    list: new Array(), //esta es la lsta de personas que se carga
    ProductosC : {nombreP:"",idPr:"",precio:0.0,cant:0,detallesByIdPr:null,proveedoresByIdProd:null},
    mode: ""
}



document.addEventListener("DOMContentLoaded",loadedProductos);
document.addEventListener("visibilitychange",unloadedProductos);

async function loadedProductos(event) {
    try {
        await checkuser();
        console.log(loginstate);
        await mainrender();
        console.log("Se hizo mainRender");
    } catch (error) {
        return;
    }

    document.getElementById("buscarPro").addEventListener("click", searchProducto);
    document.getElementById("savePro").addEventListener("click", saveProducto);
    console.log("Se hizo eventos click");

    /*
        state_jsonProductos = sessionStorage.getItem("productos");
        if(!state_jsonProductos){
            console.log("Se hizo fetchAndList");
            fetchAndListProductos(); //hacer
        }
        else{
            console.log("Entro en sessionStorage existente");
            statePro=JSON.parse(state_jsonProductos);
            document.getElementById("idPrp").value=statePro.item.idPr;
            render_listProductos(); //hacer


        }*/

    fetchAndListProductos();
}

async function unloadedProductos(event){
    if(document.visibilityState==="hidden" && loginstate.logged){
        sessionStorage.setItem("productos",JSON.stringify(statePro));
    }
}


function fetchAndListProductos(){ //metodo para obtener la lista actual de personas
    const request = new Request(apiPro+`/read`, {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        statePro.list = await response.json();
        render_listProductos();
    })();
}

function render_listProductos(){
    var listado=document.getElementById("containerProductos"); //agarra la lista del dom
    listado.innerHTML=""; //limpia el html para volver a cargar la lista
    statePro.list.forEach( item=>render_list_itemProductos(listado,item)); //foreach de cada elemento en la lista
}

function render_list_itemProductos(listado,item) {
    var tr = document.createElement("tr");
    tr.innerHTML = `
                    <td>
                        <a id="add2facturar"><img class="editimg" src="/Images/check.png"></a>
                    </td>
                    <td>
                        <div>${item.idPr}</div>
                    </td>
                    <td>
                        <div>${item.nombreP}</div>
                    </td>
                    <td>
                        <div>${item.precio}</div>
                    </td>
                    <td>
                        <div>${item.cant}</div>
                    </td>
                    <td>
                        <a id="productoEdit"><img class="editimg" src="/Images/edit.png"></a>
                    </td>`;
    tr.querySelector("#productoEdit").addEventListener("click",()=>{load_itemProductoEdit(item.idPr,item.nombreP,item.precio,item.cant)});
    //tr.querySelector("#add2facturar").addEventListener("click",()=>{});
    tr.querySelector("#add2facturar").addEventListener("click",()=>{send2facturar(item.nombreP,item.idPr,item.precio,item.cant)});
    listado.append(tr);
}

function empty_itemProducto(){
    statePro.ProductosC={nombreP:"",idPr:"",precio:0.0,cant:0,proveedoresByIdProd:null};
}

function load_itemProducto(){
    statePro.ProductosC={ //solicita todos los campos y los iguala en item
        //<label for="idPr">ID:</label>
        //<input type="text" name="idPr" id="idPr">
        nombreP:document.getElementById("nombreP").value,
        idPr:document.getElementById("idPr").value,
        precio:document.getElementById("precio").value,
        cant:document.getElementById("cant").value,
        detallesByIdPr:null,
        proveedoresByIdProd:null

    };
    document.getElementById("idPr").disabled = false;

    console.log("loadProducto Exitoso1");
}

function load_itemProductoEdit(idPr,nombreP,precio,cant){
    document.getElementById("idPr").value = idPr;
    document.getElementById("nombreP").value = nombreP;
    document.getElementById("precio").value = precio;
    document.getElementById("cant").value = cant;
    document.getElementById("idPr").disabled = true;

}
function validate_itemProducto(){ //funcion para verificar que todos los campos hayan sido rellenados
    var error=false;
    console.log("validate item inicia");
    //document.querySelectorAll('input').forEach( (i)=> {i.classList.remove("invalid");});
    console.log("validate item inicia2");
    //el #nombreP es para clase o id?

    if (statePro.ProductosC.idPr.length==0){
        //document.querySelector("#nombreP").classList.add("invalid");
        error=true;
        console.log("validate item error1");
    }

    if (statePro.ProductosC.nombreP.length==0){
        //document.querySelector("#nombreP").classList.add("invalid");
        error=true;
        console.log("validate item error2");
    }
    if (statePro.ProductosC.precio==0){
        // document.querySelector("#precio").classList.add("invalid");
        error=true;
        console.log("validate item error3");
    }
    if (statePro.ProductosC.cant==0){
        // document.querySelector("#cant").classList.add("invalid");
        error=true;
        console.log("validate item error4");
    }
    console.log("validate item retorna");
    return !error;
}

function saveProducto(){
    load_itemProducto();
    console.log("loadProducto Exitoso2");
    if(!validate_itemProducto()) return;//verifica que todos los campos hayan sido seleccionados
    let request = new Request(apiPro+`/add`, {method: 'POST', //falta hacer el metodo en el RestController
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(statePro.ProductosC)}); //creo que a esto le van a hacer falta parametros... el idpro,idPr
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}//si pasa de aqui significa que fue agregado con exito
        fetchAndListProductos();//actualiza la lista
        limpiar()
    })();
}

function searchProducto(){ //funcion para el search
    load_itemProducto(); //for?
    idBusqueda = document.getElementById("idPrp").value;
    statePro.ProductosC.idPr=idBusqueda;
    const request = new Request(apiPro+`/buscar`,
    {method: 'POST',headers: { 'Content-Type': 'application/json'},body: JSON.stringify(statePro.ProductosC)});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        statePro.list = await response.json();
        render_listProductos(); //renderiza la lista nuevamente con la info que recolecto
    })();
}

//Trabjando en agregar un producto desede ProductosView.html hacia-> factutatViwe.html
function send2facturar(nombreP,idPr,precio,cant){
   var x=0;
    if (sessionStorage.getItem('factDet')) {
        x=x+1;
        statePro.facturaDetalles_PRODUCTOS = JSON.parse(sessionStorage.getItem('factDet'));
    } else {
        statePro.facturaDetalles_PRODUCTOS = [];
    }


    if (sessionStorage.getItem('factProd')) {
        x=x+1;
        statePro.facturaProductos_PRODUCTOS = JSON.parse(sessionStorage.getItem('factProd'));
    } else {
        statePro.facturaProductos_PRODUCTOS = [];
    }

   // if(x==2){
  //  statePro.facturaDetalles_PRODUCTOS = JSON.parse(sessionStorage.getItem('factDet'));
  //  statePro.facturaProductos_PRODUCTOS = JSON.parse(sessionStorage.getItem('factProd'));
    for(var x=0; x< statePro.facturaProductos_PRODUCTOS.length; x=x+1){
        if(statePro.facturaProductos_PRODUCTOS[x].idPr===idPr){
            return ;
        }
    }
        statePro.ProductosC.nombreP=nombreP;
        statePro.ProductosC.idPr=idPr;
        statePro.ProductosC.precio=precio;
        statePro.ProductosC.cant=cant;
        statePro.ProductosC.detallesByIdPr=null;
        statePro.ProductosC.proveedoresByIdProd=null;

        statePro.facturaProductos_PRODUCTOS.push(statePro.ProductosC);
        statePro.facturaDetalles_PRODUCTOS.push({
            nombre:nombreP,  cantidad: 1, precio:precio, monto: precio, identi: idPr
        });
    sessionStorage.removeItem('factDet');
    sessionStorage.removeItem('factProd');
        sessionStorage.setItem('factDet', JSON.stringify(statePro.facturaDetalles_PRODUCTOS));
        sessionStorage.setItem('factProd', JSON.stringify(statePro.facturaProductos_PRODUCTOS));

        document.location="/Pages/FacturarPage/FacturarView.html";
 //   }
}
function limpiar(){
    document.getElementById("idPr").value = "";
    document.getElementById("nombreP").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cant").value = "";
}

/*
* @PostMapping("/buscar")
    public Iterable<Producto> buscPro(@RequestBody Producto producto){

        if(producto.getIdPr()==""){


        }
        return service.findAllByProveedorIdAndProductoId();
        //Usuarios u=(Usuarios) session.getAttribute("usuario");
        //session.setAttribute("productos_BUSQUEDA", service.findAllByProveedorIdAndProductoId(u.getProveedoresByIdprov().getIdP(),idPr));
        //model.addAttribute("productos_BUSQUEDA", session.getAttribute("productos_BUSQUEDA"));

    }*/