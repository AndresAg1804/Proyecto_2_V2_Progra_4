


async function mainrender(){
    try{
        await renderheader();
        await renderfoot();
    } catch(error){
        return;
    }
    console.log("mainrender");
    await one();
}

function renderheader(){
    html=`
            <div>
                <div>
                    <p>Facturación </p> <p>electronica</p></div>
<!--                <div><img class="logo" src="../../../static/Images/logo.png" /></div>-->
            </div>

            <ul class="Menu">
                <li>
                    <a href="#">Acerca De</a>
                </li>
            </ul>
        `;
        document.getElementById('header').innerHTML = html;
}
function renderfoot(){
    html=`
         <footer>
            facturasOnline@best.team.com
        </footer>
        `;
    document.getElementById('footer').innerHTML = html;
}