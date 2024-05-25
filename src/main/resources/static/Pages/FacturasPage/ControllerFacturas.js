var apiFacturas="http://localhost:8080/api/facturas";

var stateFac = {
    list:  new Array(),
    factura: { numFact: 0, total: 0, detallesByNumFact:"",clientesByIdCliente: "",proveedoresByIdProveedor:"", fecha:""},
    facturaDetalles: new Array(),
    mode: "" ,// ADD, EDIT
    contenido:""
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
    // if(document.visibilityState==="hidden" && loginstate.logged){
    //     sessionStorage.setItem("facturas",JSON.stringify(stateFac));
    // }
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

/*function searchProducto(){ //funcion para el search
    load_itemProducto();
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
}*/
function searchFacturas(){

    idBusquedaFact = document.getElementById("numFact").value;
    if(idBusquedaFact.length==0){
        fetchAndListFact();
    }
    else {
        /*@GetMapping("/search")
   public Iterable<Facturas> findbyProvAndNumF(@RequestParam int numFact,@AuthenticationPrincipal UserDetailsIMP user){
        return service.findAllByIdProveedorAndNumFact(user.getPROVEDOR().getIdP(),numFact);
   }*/
        stateFac.factura.numFact = idBusquedaFact;
        const request = new Request(apiFacturas + `/search?numFact=${idBusquedaFact}`,
            {method: 'GET', headers: { }});
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                errorMessage(response.status);
                return;
            }
            stateFac.list = await response.json();
            render_listFacturas();
        })();
    }
}






async function xmlMaking(numFact){
    const request = new Request(apiFacturas + `/facturaXML?numFact=${numFact}`, {method: 'GET', headers: { }});
    await (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateFac.factura = await response.json();

    })();
    const request2 = new Request(apiFacturas + `/detallesXML?numFact=${numFact}`, {method: 'GET', headers: { }});
    await (async ()=>{
        const response2 = await fetch(request2);
        if (!response2.ok) {errorMessage(response2.status);return;}
        stateFac.facturaDetalles = await response2.json();
    })();

    stateFac.contenido=`<?xml version="1.0" encoding="UTF-8"?>
        <FacturacionElectronica>
        <Clave>456654546423131354898754132165849843516548413621879887131847</Clave>
        <CodigoActividad>123488112</CodigoActividad>
        <NumeroConsecutivo>0001112220003330002222</NumeroConsecutivo>
        <FechaEmision>${stateFac.factura.fecha}</FechaEmision>
        <Emisor>
            <Nombre>${stateFac.factura.proveedoresByIdProveedor.nombreP}</Nombre>
            <Identificacion>
            <Tipo>01</Tipo>
            <IdentificacionRegistrada>${stateFac.factura.proveedoresByIdProveedor.idP}</IdentificacionRegistrada>
            </Identificacion>
            <NombreComercial>${stateFac.factura.proveedoresByIdProveedor.nombreP}</NombreComercial>
        </Emisor>
        <Receptor>
            <Nombre>${stateFac.factura.proveedoresByIdProveedor.nombreP}</Nombre>
            <Identificacion>
            <Tipo>02</Tipo>
            <IdentificacionRegistrada>${stateFac.factura.clientesByIdCliente.idC}</IdentificacionRegistrada>
            </Identificacion>
        </Receptor>
    `;

     stateFac.facturaDetalles.forEach( item=>render_XML(item));


    stateFac.contenido=stateFac.contenido+`
    <ResumenFactura>
        <NumeroFactura>${stateFac.factura.numFact}</NumeroFactura>
        <MontoTotal>${stateFac.factura.total}</MontoTotal>
    </ResumenFactura>`;

    stateFac.contenido=stateFac.contenido+`</FacturacionElectronica>`;

    var blob = new Blob([stateFac.contenido],{type:'text/xml'});
    window.open(URL.createObjectURL(blob));
}
function render_XML(item){
    stateFac.contenido=stateFac.contenido+`
        <DetallesServicio>
            <detalle>
                <codigoProducto>${item.productoByIdProd.idPr}</codigoProducto>
                <nombre>${item.productoByIdProd.nombreP}</nombre>
                <precio>${item.productoByIdProd.precio}</precio>
                <cantidad>${item.productoByIdProd.cant}</cantidad>
                <montoFinal>${item.monto}</montoFinal>
            </detalle>
        
        </DetallesServicio>
        `;
}

/* cierre: </FacturacionElectronica>
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



