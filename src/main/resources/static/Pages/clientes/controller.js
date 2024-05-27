var backend="http://localhost:8080/api";
var apiC = backend + '/clientes';

var stateC = {
    list: new Array(),
    item: { nombreC: "", idC: "", correo: "", telefono: 0, proveedoresByProveedorid: null, facturasByIdC: null, nombreBC: ""},
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

    document.getElementById("buscarCli").addEventListener("click",searchClientes); 
    document.getElementById("saveCli").addEventListener("click", saveCliente);


   state_json = sessionStorage.getItem("clientes");
    if(!state_json){
        fetchAndListClientes();
    }
    else{
        stateC = JSON.parse(state_json);
        document.getElementById("nombreBusquedaC").value=stateC.item.nombreBC;
        await searchClientes();
        sessionStorage.setItem("clientes",JSON.stringify(stateC));
    }
}

async function unloadedClientes(event){
    if(document.visibilityState==="hidden" && loginstate.logged){
        sessionStorage.setItem("clientes",JSON.stringify(stateC));
        stateC.mode="ADD";
    }
}

function fetchAndListClientes(){
    const request = new Request(apiC+`/read`, {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateC.list = await response.json();
        render_listClientes();
    })();
}

function render_listClientes(){
    var listado=document.getElementById("containerClientes");
    listado.innerHTML="";
    stateC.list.forEach( item=>render_list_itemClientes(listado,item));
}

function render_list_itemClientes(listado,item){
    var tr =document.createElement("tr");
    tr.innerHTML=`
                    <td>
                        <a><img class="editimg" src="/Images/check.png"></a>
                    </td>
                    <td>
                        <div>${item.nombreC}</div>
                    </td>
                    <td>
                        <div>${item.idC}</div>
                    </td>
                    <td>
                        <div>${item.correo}</div>
                    </td>
                    <td>
                        <div>${item.telefono}</div>
                    </td>
                    <td>
                        <a id="clienteEdit"><img class="editimg" src="/Images/edit.png"></a>
                    </td>`;
    tr.querySelector("#clienteEdit").addEventListener("click",()=>{load_itemClienteEdit(item.nombreC,item.idC,item.correo,item.telefono)});
    tr.querySelector(".editimg").addEventListener("click",()=>{sendClienteFacturar(item.nombreC,item.idC,item.correo,item.telefono)});
    listado.append(tr);
}

function searchClientes(){ //funcion para el search
    nombreBusquedaC = document.getElementById("nombreBusquedaC").value;
    stateC.item.nombreBC=nombreBusquedaC;
    const request = new Request(apiC+`/search?nombre=${nombreBusquedaC}`,
        {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateC.list = await response.json();
        render_listClientes();
    })();
}

function empty_itemCliente(){
    stateC.item={cedulaC:"", nombreC:"", correo:"", telefono: 0};
}

function load_itemCliente(){
    document.getElementById("idC").disabled = false;
    stateC.item={ //solicita todos los campos y los iguala en item
        nombreC:document.getElementById("nombreC").value,
        idC:document.getElementById("idC").value,
        correo:document.getElementById("correo").value,
        telefono:document.getElementById("telefono").value
    };
}

function load_itemClienteEdit(nombreC,idC,correo,telefono){
    stateC.mode="EDIT";
    document.getElementById("nombreC").value = nombreC;
    document.getElementById("idC").value = idC;
    document.getElementById("correo").value = correo;
    document.getElementById("telefono").value = telefono;
    document.getElementById("idC").disabled = true;
}

function validate_itemCliente(){
    var error=false;

    document.querySelectorAll('input').forEach( (i)=> {i.classList.remove("invalid");});

    if (stateC.item.nombreC.length===0){
        document.querySelector("#nombreC").classList.add("invalid");
        error=true;
    }

    if (stateC.item.idC.length===0){
        document.querySelector("#idC").classList.add("invalid");
        error=true;
    }

    if (stateC.item.correo.length===0){
        document.querySelector("#correo").classList.add("invalid");
        error=true;
    }

    if (stateC.item.telefono.length===0){
        document.querySelector("#telefono").classList.add("invalid");
        error=true;
    }
    return !error;
}

function saveCliente(){
    load_itemCliente();

    if(!validate_itemCliente()) return;
    let request = new Request(apiC+`/add?mode=${stateC.mode}`, {method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(stateC.item)});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        fetchAndListClientes();
        limpiarFormulario();
        stateC.mode="ADD";
        empty_itemCliente();
    })();
}

function limpiarFormulario(){
    document.getElementById("nombreC").value = "";
    document.getElementById("idC").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("telefono").value = "";
}

function sendClienteFacturar(nombreC,idC,correo,telefono){
    stateC.item.nombreC=nombreC;
    stateC.item.idC=idC;
    stateC.item.correo=correo;
    stateC.item.telefono=telefono;
    stateC.item.proveedoresByProveedorid=null;
    stateC.item.facturasByIdC=null;
    sessionStorage.setItem("cliente",JSON.stringify(stateC.item));
    document.location="/Pages/FacturarPage/FacturarView.html";
}