var apiFacturas="http://localhost:8080/api/facturas";

var stateFac = {
    list:  new Array(),
    factura: { numFact: 0, total: 0, detallesByNumFact:null,clientesByIdCliente: null,proveedoresByIdProveedor:null, fecha:""},
    mode: "" // ADD, EDIT
}



document.addEventListener("DOMContentLoaded",loadedFact);
document.addEventListener("visibilitychange",unloadedFact);

async function loadedFact(event) {
    try {
        await checkuser();

        await mainrender();
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

    const request = new Request(apiFacturas+`/findAll`, {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateFac.list = await response.json();
        render_listFacturas();
    })();

}

function render_listFacturas(){
    var listado=document.getElementById("containerFacturas");
    listado.innerHTML="";
    stateFac.list.forEach( item=>render_list_itemFact(listado,item));
}

function render_list_itemFact(listado,item) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
                    <td>
                        <div>${item.numFact}</div>
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
                        <a id="pdfMaker" href='/api/facturas/${item.numFact}/pdf' target = "_blank"><img src="/Images/pdf.png" style="width: 15px"></a>
                    </td>
                    <td>
                        <a id="xmlMaker"><img src="/Images/XML.png" style="width: 15px"></a>
                    </td>`;
    tr.querySelector("#xmlMaker").addEventListener("click", ()=>{xmlMaking(item.numFact)});


    listado.append(tr);
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






function xmlMaking(numFact){

}

/*
* function render_xml(cedula,nombre,sexo){

    contenido=`<?xml version="1.0" encoding="UTF-8"?>
        <Persona>
            <cedula>${cedula}</cedula>
            <nombre>${nombre}</nombre>
            <sexo>${sexo}</sexo>
        </Persona>
    `;

    //document.getElementById("xmlframe").src="data:text/xml,"+contenido;
    //toggle_xmlview();//hacer esta funcion

    var blob = new Blob([contenido],{type:'text/xml'});
    window.open(URL.createObjectURL(blob));
}
*/



