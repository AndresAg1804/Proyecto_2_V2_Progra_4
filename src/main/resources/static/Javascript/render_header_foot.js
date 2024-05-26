


async function mainrender(){
    try{
        await renderheader();
        await renderfoot();
    } catch(error){
        return;
    }

}

function renderheader(){
//     html=`
//             <div>
//                 <div>
//                     <p>Facturación </p> <p>electronica</p></div>
// <!--                <div><img class="logo" src="../../../static/Images/logo.png" /></div>-->
//             </div>
//
//             <ul class="Menu">
//                 <li>
//                     <a href="#">Acerca De</a>
//                 </li>
//             </ul>
//         `;
//         document.getElementById('header').innerHTML = html;
    if (!loginstate.logged){
        html=`
            <div>
                <div>
                    <p>Facturación </p> <p>electronica</p></div>
<!--                <div><img class="logo" src="../../../static/Images/logo.png" alt=""/></div>-->
            </div>

            <ul class="Menu">
                <li>
                    <a href="#">Acerca De</a>
                </li>
                <li>
                    <a href="#" id="gologin">Login</a>
                </li>
                


            </ul>
        `;
        document.getElementById('header').innerHTML = html;
        if(document.location.pathname == "/Pages/LoginPage/LoginView.html") {
            document.getElementById('LoginB').addEventListener("click", login);
            document.getElementById("newU_A").addEventListener('click', MOVE2newUser);
        }
        document.getElementById('gologin').addEventListener("click",GOLOGINVIEW);

        //ojo que si se hace un get element by ID que no existe error
    }
    else{
        html=`
            <div>
                <div>
                    <p>Facturación </p> <p>electronica</p></div>
<!--                <div><img class="logo" src="../../../static/Images/logo.png" alt=""/></div>-->
            </div>

            <ul class="Menu">
                <li>
                    <a id="LogoutA" class="LogoutA" href="#">Logout</a>
                </li>
                <li>
                    <a class="editME" id="editME" href="#">${loginstate.Usuarios.usern}</a>
                    
                </li>
                <li>
                <a href="#" id="gofacturas">Facturas</a>
                    <a href="#" id="goproductos">Productos</a>
                    <a href="#" id="goclientes">Clientes</a>
                    <a href="#" id="gofacturar">Facturar</a>
                </li>
            </ul>
        `;
        document.getElementById('header').innerHTML = html;
        document.getElementById('LogoutA').addEventListener('click', logout);
        document.getElementById('goproductos').addEventListener("click",GOPRODUCTOS);
        document.getElementById('gofacturas').addEventListener("click",GOFACTURAS);
        document.getElementById('goclientes').addEventListener("click",GOCLIENTE);
        document.getElementById('gofacturar').addEventListener("click",GOFACTURAr);
        document.getElementById('editME').addEventListener("click",editME);

    }
}
function renderfoot(){
    html=`
         <footer>
            facturasOnline@best.team.com
        </footer>
        `;
    document.getElementById('footer').innerHTML = html;
}
function GOLOGINVIEW(){
    document.location="/Pages/LoginPage/LoginView.html";
}
function GOPRODUCTOS(){
    document.location="/Pages/Productos/ProductosView.html";
}

function GOCLIENTE(){
    document.location="/Pages/clientes/view.html";
}

function GOFACTURAS(){
    document.location="/Pages/FacturasPage/FacturasView.html";
}
function GOFACTURAr(){
    document.location="/Pages/FacturarPage/FacturarView.html";
}
function editME(){
    document.location="/Pages/editME/editMEview.html";
}