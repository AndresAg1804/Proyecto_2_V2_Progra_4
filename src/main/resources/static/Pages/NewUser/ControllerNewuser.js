document.addEventListener("DOMContentLoaded",MAINRENDER);
async function MAINRENDER(event) {
    try{ await mainrender();} catch(error){return;}
    await newUser();
}
async function  newUser(){
    document.getElementById("proRadio").addEventListener("change", function() {
        var proInputs = document.getElementById("proInputs");
        if (this.checked) {
            proInputs.style.display = "block";
        } else {
            proInputs.style.display = "none";
        }
    });
    document.getElementById("admRadio").addEventListener("change", function() {
        var proInputs = document.getElementById("proInputs");
        if (this.checked) {
            proInputs.style.display = "none";
        } else {
            proInputs.style.display = "block";
        }
    });
    document.getElementById("DONEnewU").addEventListener('click',addNEWUSER)
}
function addNEWUSER(){
    if(document.getElementById("admRadio").checked){
        let proveedor = {
            nombreP: document.getElementById("NUproveedorNombre").value,
            idP: document.getElementById("NUproveedorId").value
            // Add other attributes of Proveedores as needed
        };

        let Usuario={
            usern:document.getElementById("NUusern").value,
            pasw:document.getElementById("NUpasw").value,
            tipo:document.getElementById('admRadio').value,
            proveedoresByIdprov:proveedor

        };

        let request = new Request('http://localhost:8080/api'+'/user'+'/newU', {method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(Usuario)});


        (async ()=>{
            const response = await fetch(request); //jsuto aqui, aqui se envia el request
            if (!response.ok) {errorMessage(response.status);return;}
            document.location="/Pages/LoginPage/LoginView.html";
        })();
    }
    else{

    }
}