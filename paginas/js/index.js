
function Carregar(){

    var request = new XMLHttpRequest();

    var urlTela = tela.value;

    const contemURL = urlTela != "";

    if(contemURL){
        request.open("GET", `${urlTela}`);
        request.send();
        
        request.onreadystatechange = function(){
            var data = request.responseText;
            screenGrid.innerHTML = data;
        }
    }
}