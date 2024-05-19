var backend="http://localhost:8080/api";
var apiC = backend + '/clientes';

var stateC = {
    list: new Array(),
    item: { nombreC: "", idC: "", correo: "", telefono: 0},
    mode: "" // ADD, EDIT
}

document.addEventListener("DOMContentLoaded",loadedClientes);
document.addEventListener("visibilitychange",unloadedClientes);

async function loadedClientes(event){
    try {
        await checkuser();
        console.log(loginstate);
        await mainrender();
        console.log("Se hizo mainRender");
    } catch (error) {
        return;
    }

    document.getElementById("buscarCli").addEventListener("click",searchClientes); //boton de search en html
    document.getElementById("saveCli").addEventListener("click", saveCliente); //boton para abrir el menu de creacion de persona


   state_json=sessionStorage.getItem("personas");
    if(!state_json){
        fetchAndListClientes();
    }
    else{
        stateC=JSON.parse(state_json);
        document.getElementById("nombreBusquedaC").value=stateC.item.nombreC;
        render_listClientes();
    }

    fetchAndListClientes();
}

async function unloadedClientes(event){
    if(document.visibilityState==="hidden" && loginstate.logged){
        sessionStorage.setItem("clientes",JSON.stringify(stateC));
    }
}

function fetchAndListClientes(){ //metodo para obtener la lista actual de personas
    const request = new Request(apiC+`/read?id=${loginstate.Usuarios.proveedoresByIdprov.idP}`, {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateC.list = await response.json();
        render_listClientes(); //una vez cargada la lista llama a la funcion de render_list
    })();
}

function render_listClientes(){
    var listado=document.getElementById("listaClientes"); //agarra la lista del dom
    listado.innerHTML=""; //limpia el html para volver a cargar la lista
    stateC.list.forEach( item=>render_list_itemClientes(listado,item)); //foreach de cada elemento en la lista
}

function render_list_itemClientes(listado,item){
    var tr =document.createElement("tr"); //crea un elemento tr nuevo para cada iteracion del foreach
    tr.innerHTML=`
                    <td>
                        <a><img class="editimg" src="/Images/check.png"></a>
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
                        <a><img class="editimg" src="/Images/edit.png"></a>
                    </td>`;
    tr.querySelector(".editimg").addEventListener("click",()=>{edit(item.cedula);});//para cada elemento con la clase edit y delete se les agrega el evento correspondiente
    /*tr.querySelector("#delete").addEventListener("click",()=>{remove(item.cedula);});*/
    listado.append(tr);//es como hacer un push con html?
}

function searchClientes(){ //funcion para el search
    nombreBusquedaC = document.getElementById("nombreBusquedaC").value; //agarra el valor del elemento del html
    stateC.item.nombreC=nombreBusquedaC;
    const request = new Request(apiC+`/search?nombre=${nombreBusquedaC}`, //lo manda al RestController Personas
        {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateC.list = await response.json();
        render_listClientes(); //renderiza la lista nuevamente con la info que recolecto
    })();
}

function empty_itemCliente(){
    stateC.item={cedula:"", nombre:"",sexo:""};
}

function render_itemClientes(){
    document.querySelectorAll('#itemview input').forEach( (i)=> {i.classList.remove("invalid");});
    document.getElementById("nombreC").value = stateC.item.nombreC;
    document.getElementById("idC").value = stateC.item.idC;
    document.getElementById("correo").value = stateC.item.correo;
    document.getElementById("telefono").value = stateC.item.telefono;
}

function add(){
    load_itemCliente();
    if(!validate_itemCliente()) return;//verifica que todos los campos hayan sido seleccionados
    let request = new Request(apiC, {method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(stateC.item)});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}//si pasa de aqui significa que fue agregado con exito
        fetchAndListClientes();//actualiza la lista
    })();
}

function load_itemCliente(){
    stateC.item={ //solicita todos los campos y los iguala en item
        nombreC:document.getElementById("nombreC").value,
        idC:document.getElementById("idC").value,
        correo:document.getElementById("correo").value,
        telefono:document.getElementById("telefono").value
    };
}

function validate_itemCliente(){ //funcion para verificar que todos los campos hayan sido rellenados
    var error=false;

    document.querySelectorAll('input').forEach( (i)=> {i.classList.remove("invalid");});

    if (stateC.item.nombreC.length==0){
        document.querySelector("#cedula").classList.add("invalid");
        error=true;
    }

    if (stateC.item.idC.length==0){
        document.querySelector("#nombre").classList.add("invalid");
        error=true;
    }

    if (stateC.item.correo.length==0){
        document.querySelector("#correo").classList.add("invalid");
        error=true;
    }

    if (stateC.item.telefono==0){
        document.querySelector("#telefono").classList.add("invalid");
        error=true;
    }
    return !error;
}

//esta funcionalidad falta de implementar
function edit(id){ //este llama a la funcion de read para encontrar a una persona con el id x
    let request = new Request(backend+`/personas/${id}`,
        {method: 'GET', headers: {}});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateC.item = await response.json();
        stateC.mode="EDIT";
        render_itemClientes();
        fetchAndListClientes();
    })();
}
function update() {
    load_itemCliente();
    if (!validate_itemCliente()) return; // verifica que todos los campos hayan sido seleccionados
    let request = new Request(apiC +`/update/${stateC.item.idC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateC.item)
    });
    (async () => {
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}//si pasa de aqui significa que fue agregado con exito
        fetchAndListClientes();//actualiza la lista
    })();
}

function saveCliente(){
    if(stateC.mode=="ADD"){
        add();
    }
    if(stateC.mode=="EDIT"){
        update();
        empty_itemCliente();
    }
}
