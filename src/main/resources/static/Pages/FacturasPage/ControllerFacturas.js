var backend="http://localhost:8080/api";
var apiFacturas=backend+'/facturas';

var stateFac = {
    list:  new Array(),
    factura: { numfact: 0, total: 0, clientesByIdCliente: null, fecha:""},
    mode: "" // ADD, EDIT
}


document.addEventListener("DOMContentLoaded",loadedFact);
document.addEventListener("visibilitychange",unloadedFact);

async function loadedFact(event) {
    console.log("Llamo a load");
    try {
        await checkuser();
        console.log(loginstate);
        await mainrender();
        console.log("Se hizo mainRender");
    } catch (error) {
        return;
    }

    document.getElementById("buscarFactura").addEventListener("click", searchFacturas);
    console.log("Se hizo eventos click");

    fetchAndListFact();
}

async function unloadedFact(event){
    if(document.visibilityState==="hidden" && loginstate.logged){
        sessionStorage.setItem("facturas",JSON.stringify(stateFac));
    }
}

function fetchAndListFact(){
    console.log("Llamo a fetch");
    const request = new Request(apiFacturas+`/findAll?idP=${loginstate.Usuarios.proveedoresByIdprov.idP}`, {method: 'GET', headers: { }});
    console.log(loginstate.Usuarios.proveedoresByIdprov.idP);
    (async ()=>{
        console.log("Llamo a fetch");
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        console.log("Fetch Exitoso");
        stateFac.list = await response.json();
        render_listFacturas();
    })();

}

function render_listFacturas(){
    var listado=document.getElementById("containerFacturas");
    listado.innerHTML="";
    statePro.list.forEach( item=>render_list_itemFact(listado,item));
}

function render_list_itemFact(listado,item) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
                    <td>
                        <div>${item.numfact}</div>
                    </td>
                    <td>
                        <div>${item.clientesByIdCliente.nombreC}</div>
                    </td>
                    <td>
                        <div>${item.total}</div>
                    </td>
                    <td>
                        <div>${item.fecha}</div>
                    </td>
                    <td>
                        <a><img src="/Images/pdf.png">/a>
                    </td>
                    <td>
                        <a><img src="/Images/XML.png"></a>
                    </td>`;
    tr.querySelector("#pdfMaker").addEventListener("click", ()=>{pdfMaking()});
    tr.querySelector("#xmlMaker").addEventListener("click", ()=>{xmlMaking()});

    //tr.querySelector("#edit").addEventListener("click",()=>{edit(item.cedula);});//para cada elemento con la clase edit y delete se les agrega el evento correspondiente
    //tr.querySelector("#delete").addEventListener("click",()=>{remove(item.cedula);});
    //tr.querySelector("#xml").addEventListener("click",()=>{render_xml(item.cedula,item.nombre,item.sexo)});
    listado.append(tr);//es como hacer un push con html?
}


function searchFacturas(){
    numFactura= document.getElementById("numFact").value;
    let request = new Request(apiFacturas + `search?idP=${loginstate.idP}?numFact=${numFactura}`, {method: 'GET'});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateFac.list = await response.json();
        render_listFacturas();
    })();

}





function pdfMaking(){}
function xmlMaking(){}



