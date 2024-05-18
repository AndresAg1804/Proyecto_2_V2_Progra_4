var apiPro=backend+'/productos';

var statePro ={
    list: new Array(), //esta es la lsta de personas que se carga
    item : {nombre:"",idPr:"",precio:0.0,idProd:"",cant:0},
    mode: "" // ADD, EDIT
}



document.addEventListener("DOMContentLoaded",loadedProductos);
document.addEventListener("visibilitychange",unloadedProductos);

async function loadedProductos(event) {
    try {
        await mainrender();
    } catch (error) {
        return;
    }

    document.getElementById("buscarPro").addEventListener("click", searchProducto);
    document.getElementById("savePro").addEventListener("click", saveProducto);


    state_jsonProductos = sessionStorage.getItem("productos");
    if(!state_jsonProductos){
        fetchAndListProductos(); //hacer
    }
    else{
        statePro=JSON.parse(state_jsonProductos);
        document.getElementById("idPrp").value=statePro.item.idPr;
        render_listProductos(); //hacer
    }
}

async function unloadedProductos(event){
    if(document.visibilityState==="hidden" && loginstate.logged){
        sessionStorage.setItem("productos",JSON.stringify(statePro));
    }
}
//aqui voy tengo que hacer el metodo en el RestController de productos
function fetchAndListProductos(){ //metodo para obtener la lista actual de personas
    const request = new Request(apiPro+`/read?id=${loginstate.Usuarios.usern}`, {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
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
                        <a><img class="editimg" src="../../../static/Images/check.png"></a>
                    </td>
                    <td>
                        <div>${item.idPr}</div>
                    </td>
                    <td>
                        <div>${item.nombre}</div>
                    </td>
                    <td>
                        <div>${item.precio}</div>
                    </td>
                    <td>
                        <div>${item.cant}</div>
                    </td>
                    <td>
                        <a><img class="editimg" src="../../../static/Images/edit.png"></a>
                    </td>`;//cambia y agrega el html necesario para 1 linea de la tabla
    //tr.querySelector("#edit").addEventListener("click",()=>{edit(item.cedula);});//para cada elemento con la clase edit y delete se les agrega el evento correspondiente
    //tr.querySelector("#delete").addEventListener("click",()=>{remove(item.cedula);});
    //tr.querySelector("#xml").addEventListener("click",()=>{render_xml(item.cedula,item.nombre,item.sexo)});
    listado.append(tr);//es como hacer un push con html?
}

function empty_itemProducto(){
    statePro.item={nombre:"",idPr:"",precio:0.0,idProd:"",cant:0};
}

function load_itemProducto(){
    statePro.item={ //solicita todos los campos y los iguala en item
        nombre:document.getElementById("nombreP").value,
        precio:document.getElementById("precio").value,
        cant:document.getElementById("cant").value
    };
}

function validate_itemProducto(){ //funcion para verificar que todos los campos hayan sido rellenados
    var error=false;

    document.querySelectorAll('input').forEach( (i)=> {i.classList.remove("invalid");});

    //el #nombreP es para clase o id?

    if (statePro.item.nombre.length==0){
        document.querySelector("#nombreP").classList.add("invalid");
        error=true;
    }
    if (statePro.item.precio==0){
        document.querySelector("#precio").classList.add("invalid");
        error=true;
    }
    if (statePro.item.cant==0){
        document.querySelector("#cant").classList.add("invalid");
        error=true;
    }
    return !error;
}

function saveProducto(){
    load_itemProducto();
    if(!validate_itemProducto()) return;//verifica que todos los campos hayan sido seleccionados
    let request = new Request(api, {method: 'POST', //falta hacer el metodo en el RestController
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(statePro.item)}); //creo que a esto le van a hacer falta parametros... el idpro,idPr
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}//si pasa de aqui significa que fue agregado con exito
        fetchAndListProductos();//actualiza la lista
    })();
}

function searchProducto(){ //funcion para el search
    idBusqueda = document.getElementById("idPrp").value;
    statePro.item.idProd=idBusqueda;
    const request = new Request(api+`/search?id=${idBusqueda}`, //falta hacer el metodo en el RestController
        {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        statePro.list = await response.json();
        render_list(); //renderiza la lista nuevamente con la info que recolecto
    })();
}

