var apiPro="http://localhost:8080/api/productos";

var statePro ={
    list: new Array(), //esta es la lsta de personas que se carga
    ProductosC : {nombreP:"",idPr:"",precio:0.0,cant:0,detallesByIdPr:null,proveedoresByIdProd:null},
    mode: "" // ADD, EDIT
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

        NO ESTA FUNCIONANDO EL SESSIONSTORAGE AQUI
    }*/

    fetchAndListProductos();
}

async function unloadedProductos(event){
    if(document.visibilityState==="hidden" && loginstate.logged){
        sessionStorage.setItem("productos",JSON.stringify(statePro));
    }
}
//aqui voy tengo que hacer el metodo en el RestController de productos
function fetchAndListProductos(){ //metodo para obtener la lista actual de personas
    const request = new Request(apiPro+`/read?id=${loginstate.Usuarios.proveedoresByIdprov.idP}`, {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        console.log("Fetch Exitoso");
        statePro.list = await response.json();
        render_listProductos(); //una vez cargada la lista llama a la funcion de render_list
    })();
}

function render_listProductos(){
    var listado=document.getElementById("containerProductos"); //agarra la lista del dom
    listado.innerHTML=""; //limpia el html para volver a cargar la lista
    statePro.list.forEach( item=>render_list_itemProductos(listado,item)); //foreach de cada elemento en la lista
}

function render_list_itemProductos(listado,item) {
    var tr = document.createElement("tr"); //crea un elemento tr nuevo para cada iteracion del foreach
    //<a href="/presentation/Facturar/AddProduct(idP=${item.id})}"><img class="editimg" src="../../../static/Images/check.png"></a>
    //<a href="/set/editpro(idPr=${item.id},nombreP=${item.nombre},precio=${item.precio},cant=${item.cant})}"><img class="editimg" src="../../../static/Images/edit.png"></a>
    tr.innerHTML = `
                    <td>
                        <a><img class="editimg" src="/Images/check.png"></a>
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
                        <a><img class="editimg" src="/Images/edit.png"></a>
                    </td>`;//cambia y agrega el html necesario para 1 linea de la tabla
    //tr.querySelector("#edit").addEventListener("click",()=>{edit(item.cedula);});//para cada elemento con la clase edit y delete se les agrega el evento correspondiente
    //tr.querySelector("#delete").addEventListener("click",()=>{remove(item.cedula);});
    //tr.querySelector("#xml").addEventListener("click",()=>{render_xml(item.cedula,item.nombre,item.sexo)});
    listado.append(tr);//es como hacer un push con html?
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
        proveedoresByIdProd:loginstate.Usuarios.proveedoresByIdprov

    };


console.log("loadProducto Exitoso1");
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
    let request = new Request(apiPro+'/add', {method: 'POST', //falta hacer el metodo en el RestController
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(statePro.ProductosC)}); //creo que a esto le van a hacer falta parametros... el idpro,idPr
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}//si pasa de aqui significa que fue agregado con exito
        fetchAndListProductos();//actualiza la lista
    })();
}

function searchProducto(){ //funcion para el search
    idBusqueda = document.getElementById("idPrp").value;
    statePro.ProductosC.idProd=idBusqueda;
    const request = new Request(apiPro+`/search?id=${idBusqueda}`, //falta hacer el metodo en el RestController
        {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        statePro.list = await response.json();
        render_list(); //renderiza la lista nuevamente con la info que recolecto
    })();
}

