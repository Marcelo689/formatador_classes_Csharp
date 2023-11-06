function retornaTiposUnique(lista){

    var listaTipos = [];
    lista.forEach( item => {
        var tipo = item.tipo;
        var naoIncluiTipo = !listaTipos.includes(tipo);

        if(naoIncluiTipo){
            listaTipos.push(tipo);
        } 
    });

    return listaTipos;
}

function gerarMetodosValidar(listaPropriedades, dados){
    
    var tiposContidos = retornaTiposUnique(listaPropriedades);
    var Tipos = new Tipo();
    var saida = "";

    if(tiposContidos.includes(Tipos.string)){
        saida += `
        \n      private void ValidaStringDoViewModel(string texto, string mensagemEhNulo, bool contemValidacaoTamanhoMaximo = true, int tamanhoMaximo = 0, string mensagemTamanhoMaximo = "")
        {
            if (string.IsNullOrWhiteSpace(texto))
            {
                this.ModelState.AddModelError(string.Empty, mensagemEhNulo);
            }
            else if (contemValidacaoTamanhoMaximo && texto.Length > tamanhoMaximo)
            {
                this.ModelState.AddModelError(string.Empty, mensagemTamanhoMaximo);
            }
        }\n
        `;
    }

    if(tiposContidos.includes(Tipos.intNullAble)){
        saida += `
        \n      private void ValidaIntNullableLookUpObrigatorioViewModel(int? numeroNullAble, string mensagemObrigatorio)
        {
            if (!numeroNullAble.HasValue)
            {
                this.ModelState.AddModelError(string.Empty, mensagemObrigatorio);
            }
        }\n
        `;
    }

    if(tiposContidos.includes(Tipos.decimalNullAble)){
        saida += `
        \n      private void ValidaDecimalMinMax(decimal? min, decimal? max, string mensagemValorMinMaior)
        {
            bool valoresNaoPreenchidos = !(min.HasValue && max.HasValue);
            if (valoresNaoPreenchidos)
            {
                return;
            }

            bool valorMinimoMaior = min.Value > max.Value;
            if (valorMinimoMaior)
            {
                this.ModelState.AddModelError(string.Empty, mensagemValorMinMaior);
            }

        }\n
        `;
    }

    saida += gerarValidacaoModel(listaPropriedades, dados.ClassePrincipal, dados.Area, dados.ControllerName);

    return saida;
}

function gerarValidacaoModel(listaPropriedades, nomeClassePrincipal, areaName, controllerName){

    var saida = `private void ValidarModel(${nomeClassePrincipal}ViewModel viewmodel){\n`;

    var tipo = new Tipo();

    for (let indice = 0; indice < listaPropriedades.length; indice++) {
        const propriedade = listaPropriedades[indice];

        switch (propriedade.tipo) {
            case tipo.string:
                
                saida += "\n";
                saida += `
            ValidaStringDoViewModel(
                texto: viewmodel.${propriedade.nome},
                mensagemEhNulo: App_GlobalResources.${areaName}.${controllerName}.msgCampo${propriedade.nome}Obrigatorio,
                tamanhoMaximo: 50,
                mensagemTamanhoMaximo: App_GlobalResources.${areaName}.${controllerName}.msgCampo${propriedade.nome}TamanhoMaximo
            );\n`;

                break;
            case tipo.intNullAble:

                saida += "\n";
                saida += `
            ValidaIntNullableLookUpObrigatorioViewModel(
                numeroNullAble: viewModel.${propriedade.nome},
                mensagemObrigatorio: App_GlobalResources.${areaName}.${controllerName}.msgCampo${propriedade.nome}Obrigatorio
            );\n`;

                break;
            // case tipo.decimalNullAble:

            //     saida += "\n";
            //     saida += `
            //     ValidaDecimalMinMax(
            //         min: viewModel.PrecoMinimo,
            //         max: viewModel.PrecoMaximo,
            //         mensagemValorMinMaior: App_GlobalResources.Cadastros.CadastrarPoliticaNegociacaoCompra.msgPrecoMinMaior
            //     );\n`;

            //     break;
            default:
                break;
        }
    }
    saida += "      }\n";

    return saida;
}

function gerarArquivoController(){
    var classeConteudo = entrada.value;
    var dados = getNamespace(classeConteudo);

    dados.PreencheCamposDefault();
    dados.ClassePrincipal = normalizaClasseName(dados.ClassePrincipal);
    
    var areaName = dados.Area;
    var controllerName = dados.ControllerName;
    var solutionName = dados.Solution;
    var classeName = dados.ClassePrincipal;
    
    var listaPropriedades = getListProps(classeConteudo);

    var textoSaida = "";

    textoSaida += geraNamespace(solutionName, areaName, controllerName);
    textoSaida += gerarControlador(controllerName);
    textoSaida += gerarRead(controllerName, classeName);
    textoSaida += gerarInsert(controllerName, classeName);
    textoSaida += gerarMetodosValidar(listaPropriedades, dados);
    textoSaida += fecharArquivo();

    saida.value = textoSaida;
    
    copiaAposFormatado();
}

function getListProps(classe){

    var listaProps = [];

    var linhasClasse = classe.split("\n");

    for(var indice =0 ; indice < linhasClasse.length; indice++){
        var linha = linhasClasse[indice];
        var linha = linha.trimLeft();

        var naoContemPublic = linha.indexOf("public") == -1;
        var contemClass = linha.indexOf("class") != -1;

        if(naoContemPublic || contemClass){
            continue;
        }else{

            var propType = linha.split(" ")[1];
            var propName = linha.split(" ")[2];

            var itemProp = new Propriedade(propType, propName);

            listaProps.push(itemProp);
        }
    }

    return listaProps;
}

function geraNamespace(solutionName, areaName, controllerName){
    var texto = `
    using Kendo.Mvc.UI;
    using Universal.Validation;
    using Universal.Data.Pagination;
    using Universal.Tois.${solutionName}.Contracts.Interface.AppService;
    using Universal.Tois.${solutionName}.Web.Areas.${areaName}.Models.${controllerName};
    using System.Web.Http.Results;
    using Kendo.Mvc.Extensions;
    using Universal.Web.Telerik.Mvc5.Extensions;
    using System.Web.Mvc;
    using Universal.Tois.${solutionName}.Dto.Common;
    using Universal.Web.Mvc.Extensions;
    using Universal.Tois.${solutionName}.Dto.${controllerName};
    using System.Collections.Generic;
    using System.Linq;

namespace Universal.Tois.${solutionName}.Web.Areas.${areaName}.Controllers
{
    #if !DEBUG
        [Authorize( Roles = "${controllerName}" )]
    #endif
    `;

    return texto;
}

function gerarControlador(NomeController){  
    var arquivoControllador =  
        `\n
    public class ${NomeController}Controller : ToisController {\n

        public I${NomeController}AppService i${NomeController}AppService { get;}

        public ${NomeController}Controller(I${NomeController}AppService i${NomeController}AppService)
        {
            i${NomeController}AppService = i${NomeController}AppService;
        }

        public ActionResult Index(){
            return View();
        }
    `

    return arquivoControllador;
}

function gerarRead(controllerName, classeName){
    var classeNormalizada = classeName.replace("ViewModel", "");
    var texto = `
        public JsonResult Read${classeNormalizada}([DataSourceRequest] DataSourceRequest request, ${classeNormalizada}FilterViewModel filtrosViewModel)
        {
            ${classeNormalizada}FilterTO filtrosTO = (${classeNormalizada}FilterTO) filtrosViewModel;

            filtrosTO.PagingParameterTO = new PagingParameterTO(request.Page, request.PageSize);

            TratarModelo(filtrosTO);

            ValidationResult<PagingResult<${classeName}ViewModel>> validationResultViewModel = new ValidationResult<PagingResult<${classeName}ViewModel>>();
            validationResultViewModel.Result = new PagingResult<${classeName}ViewModel>();
            ValidationResult<PagingResult<${classeName}TO>> validationPaging${classeName}TO = i${controllerName}AppService.GetLista${classeName}(filtrosTO);
            IEnumerable<${classeName}TO> lista${classeName}TO = validationPaging${classeName}TO.Result.DataSource;

            bool sucessoAoBuscarDados = validationPaging${classeName}TO.IsValid;
            if (sucessoAoBuscarDados)
            {
                bool listaPreenchida = lista${classeName}TO != null;
                if (listaPreenchida)
                {
                    validationResultViewModel.Result.DataSource = lista${classeName}TO.Select(to => (${classeName}ViewModel) to).ToList();
                    validationResultViewModel.Result.Total = validationPaging${classeName}TO.Result.Total;
                }
                else
                {
                    validationResultViewModel.ValidationResultToModelState(ModelState);
                }
            }

            return Json(validationResultViewModel.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
        }`;

    return texto;
}
    
function gerarInsert(controllerName, classeName){
    var texto = `
        public JsonResult Inserir${classeName}([DataSourceRequest] DataSourceRequest request, ${controllerName}ViewModel viewModel)
        {
            ValidarModelTO(viewModel);
            ${controllerName}TO to = (${controllerName}TO) viewModel;

            if (ModelState.IsValid)
            {
                ValidationResult validation = i${controllerName}AppService.Inserir${controllerName}(to);

                bool fracassoAoInserir = !validation.IsValid;
                if (fracassoAoInserir)
                {
                    validation.ValidationResultToModelState(this.ModelState);
                }
                else
                {
                    viewModel = (${controllerName}ViewModel) to;
                }
            }

            return Json(new[] { viewModel }.ToDataSourceResult(request, this.ModelState));
        }
    `

    return texto;
}
  
function fecharArquivo(){
    var textoSaida = "}\n}";
    return textoSaida;
}
