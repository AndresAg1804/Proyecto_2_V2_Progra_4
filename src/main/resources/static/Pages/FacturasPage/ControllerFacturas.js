var apiC = backend + "/facturas";

var stateFac = {
    list: new Array(),
    item: { numfact: "", total: ""},
    mode: "" // ADD, EDIT
}

document.addEventListener("DOMContentLoaded",MenuMAINRENDER);
async function MenuMAINRENDER(event) {
    try{ await mainrender();
    await renderSearch();
    } catch(error){return;}
    await one();
}

function renderSearch(){
 html=` <form class="producto-buscar">
                <div class="form-group-buscar">
                    <label for="Numfact">Numfact:</label>
                    <input type="text" name="numFact" id="Numfact" value="">
                    <button type="submit" id="searchCli">Buscar</button>
                </div>
            </form>`;
    document.getElementById('busqueda').innerHTML = html;
    document.getElementById('searchCli').addEventListener('click', search);


}

function search(){

}

