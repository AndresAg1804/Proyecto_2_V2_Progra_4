document.addEventListener("DOMContentLoaded",MenuMAINRENDER);

var apiFacturas = backend + "/facturas";

var stateFac = {
    list: new Array(),
    item: { numfact: "", total: ""},
    mode: "" // ADD, EDIT
}


async function MenuMAINRENDER(event) {
    try{ await mainrender();
    await renderSearch();
    } catch(error){return;}
    await one();
}

function renderSearch() {
    let request = new Request(apiFacturas + `findAll?idP=${loginstate.idP}`, {method: 'GET'});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateFac.list = await response.json();
        render_list();
    })();

    document.getElementById('busqueda').innerHTML = ` <form class="producto-buscar">
                <div class="form-group-buscar">
                    <label for="Numfact">Numfact:</label>
                    <input type="text" name="numFact" id="Numfact" value="">
                    <button type="submit" id="searchCli">Buscar</button>
                </div>
            </form>`;
    document.getElementById('searchCli').addEventListener('click', search);


}

function search(){
    numFactura= document.getElementById("Numfact").value;
    let request = new Request(apiFacturas + `search?idP=${loginstate.idP}?numFact=${numFactura}`, {method: 'GET'});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        stateFac.list = await response.json();
        render_list();
    })();

}

function render_itemFactura(){
    
}




