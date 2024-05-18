


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
                <li>
                    <a href="#" id="goproductos">Productos</a>
                </li>


            </ul>
        `;
        document.getElementById('header').innerHTML = html;
        document.getElementById('LoginB').addEventListener("click",login);
        document.getElementById("newU_A").addEventListener('click',MOVE2newUser);
        document.getElementById('gologin').addEventListener("click",GOLOGINVIEW);
        document.getElementById('goproductos').addEventListener("click",GOPRODUCTOS);
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
                    <a class="user" href="#">${loginstate.Usuarios.usern}</a>
                    <a class="user" href="#">${loginstate.Usuarios.proveedoresByIdprov.idP}</a>
                </li>
            </ul>
        `;
        document.getElementById('header').innerHTML = html;
        document.getElementById('LogoutA').addEventListener('click', logout);

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
    document.location="/Pages/ProductosPage/ProductosView.html";
}