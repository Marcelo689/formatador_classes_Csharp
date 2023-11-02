var classe = document.getElementById("entrada");


function CriarGrid(){
    var classeCompleta     = entrada.value;   
    
    var dados = getNamespace(entrada.value);
    
    var nomeReduzidoClasse = normalizaClasseName(dados.ClassePrincipal);
    var controllerName     = dados.ControllerName;
    var nomeSolucao        = dados.Solution;
    var areaName           = dados.Area; 
    var numeroPropriedades = 10;

    var cabecalho = `
    @using ${nomeSolucao}.Web.Areas.${areaName}.Models.${controllerName}
    @model ${controllerName}ViewModel

    @{
        const string CONTROLLER_NAME = "${controllerName}";
        object AREA = "${controllerName}";
        var estiloColunaInteira      = new { style = "text-align:right" };
        var estiloColunaString       = new { style = "text-align:left" };
        var estiloColunaCentralizada = new { style = "text-align:center" };

        var tamanhoPaginaInicial = 10;
        
        int numeroColunas = ${numeroPropriedades};
        var larguraPorColuna = 100 / numeroColunas;
        var percentualLargura = larguraPorColuna.ToString() + "%";
    }\n\n
    `
    var grid = cabecalho +
    `@(Html.Kendo().Grid<${controllerName}ViewModel>()
        .Name("grid")
        .Pageable(pageable => pageable.
            PageSizes( new int[]{ tamanhoPaginaInicial, tamanhoPaginaInicial *2 , tamanhoPaginaInicial * 3})
        )
        .Columns(cols =>
        {`;
        grid += RetornaColumns(classeCompleta);
        grid += `\n         cols.Command(command =>
        {
            command.Edit();
            command.Destroy();
        }).Width(200);
    })
    .ToolBar(toolbar => toolbar.Create())
    .Editable(editable => editable.Mode(GridEditMode.InLine))
    .DataSource(dataSource => dataSource
        .Ajax()
        .PageSize(tamanhoPaginaInicial)
        .Read(read => read.Action("Read${nomeReduzidoClasse}", CONTROLLER_NAME, AREA}))
        .Create(create => create.Action("Inserir${nomeReduzidoClasse}", CONTROLLER_NAME, AREA}))
        .Update(update => update.Action("Atualizar${nomeReduzidoClasse}", CONTROLLER_NAME, AREA}))
        .Destroy(destroy => destroy.Action("Remover${nomeReduzidoClasse}", CONTROLLER_NAME, AREA}))
    )`

    saida.innerHTML = grid;
    
    copiaAposFormatado();
}

function geraColunaGrid(nomePropriedade, tipoPropriedade, largura = "percentualLargura"){

    console.log(tipoPropriedade);
    var estiloColuna = "estiloColunaCentralizada";
    if(tipoPropriedade == "string"){
        estiloColuna = "estiloColunaString";
    }else if(tipoPropriedade == "int"){
        estiloColuna = "estiloColunaInteira";
    }

    return `\n          cols.Bound(c => c.${nomePropriedade})
                .Width(${largura})
                .Editable("Functions.naoEditavel")
                .HeaderHtmlAttributes(${estiloColuna})
                .HtmlAttributes(${estiloColuna});`;
}

function contemPalavrasIndesejadas(palavra, palavrasIndesejadas){

    var listaPalavrasExcluidas = ["id", "class"];

    listaPalavrasExcluidas.forEach(palavra => {
        var indice = palavra.indexOf("")
    });
}

function RetornaColumns(classe){
    var saida = "";

    var linhas = classe.split("\n");
    for (let index = 0; index < linhas.length; index++) {

        var linha = linhas[index];

        var contemPublic = linha.indexOf("public") != -1;

        if(contemPublic){
            var indicePublic = linha.indexOf("public");

            var contemClass =linha.indexOf("class") != -1;

            if(contemClass){
                continue;
            }

            var nomePropriedade = linha.substr(indicePublic).split(" ")[2];
            var tipoPropriedade = linha.substr(indicePublic).split(" ")[1];

            var larguraColuna = 60;
            saida +=  geraColunaGrid(nomePropriedade, tipoPropriedade) + "\n" ;
        }

    }
    
    return saida;
}

function RetornaColunasGrid(){
    var entradaString = entrada.value;

    const entradaContemValor =  entradaString != undefined;

    if(entradaContemValor){
        var saida = document.getElementById("saida");
        saida.innerHTML = RetornaColumns(entradaString);
    }
}
