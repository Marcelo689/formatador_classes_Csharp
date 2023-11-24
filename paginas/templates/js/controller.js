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

function gerarValidationResx(labelMensagem, mensagem){
    return `${labelMensagem}	${mensagem}\n`;
}

function adicionarResourceObrigatorio(propriedadeFullName, listaPropriedadesJaUsadas, listaResources){
    var existe = listaPropriedadesJaUsadas.includes(propriedadeFullName);

    if(existe)
        return;
    else{
        listaResources.push(gerarValidationResx(`msgCampo${propriedadeFullName}Obrigatorio`, `O campo ${AdicionarEspacos(propriedadeFullName)} é obrigatório.`));
        listaPropriedadesJaUsadas.push(propriedadeFullName);
    }
}

function adicionarResourceTamanhoMaximo(propriedadeFullName, listaPropriedadesJaUsadasTamanhoMaximo, listaResources, numeroLetras){
    var existe = listaPropriedadesJaUsadasTamanhoMaximo.includes(propriedadeFullName);

    if(existe)
        return;
    else{
        listaResources.push(gerarValidationResx(`msgCampo${propriedadeFullName}TamanhoMaximo`, `O campo ${AdicionarEspacos(propriedadeFullName)} não pode exceder ${numeroLetras} caracteres.`));
        listaPropriedadesJaUsadasTamanhoMaximo.push(propriedadeFullName);
    }
}

function gerarValidacaoModel(listaPropriedades, nomeClassePrincipal, areaName, controllerName){

    var saida = `private void ValidarModel(${nomeClassePrincipal}ViewModel viewmodel){\n`;
    var tamanhoMaximoString  = 50;
    var tipo = new Tipo();
    var listaPropriedadesJaUsadas = [];
    var listaPropriedadesJaUsadasTamanhoMaximo = [];
    var resourcesLabels = [];

    for (let indice = 0; indice < listaPropriedades.length; indice++) {
        const propriedade = listaPropriedades[indice];
        
        if(ehPropriedadeDescricaoComLabelProprio(propriedade.nome)){
            continue;
        }

        var propriedadeNormalizada = normalizaNomePropriedade(propriedade.nome);

        switch (propriedade.tipo) {
            case tipo.string:
                
                saida += "\n";
                saida += `
            ValidaStringDoViewModel(
                texto: viewmodel.${propriedade.nome},
                mensagemEhNulo: App_GlobalResources.${areaName}.${controllerName}.msgCampo${propriedadeNormalizada}Obrigatorio,
                tamanhoMaximo: ${tamanhoMaximoString},
                mensagemTamanhoMaximo: App_GlobalResources.${areaName}.${controllerName}.msgCampo${propriedadeNormalizada}TamanhoMaximo
            );\n`;
            adicionarResourceObrigatorio(propriedadeNormalizada, listaPropriedadesJaUsadas, resourcesLabels);
            adicionarResourceTamanhoMaximo(propriedadeNormalizada, listaPropriedadesJaUsadasTamanhoMaximo, resourcesLabels, tamanhoMaximoString);
                break;
            case tipo.intNullAble:

                saida += "\n";
                saida += `
            ValidaIntNullableLookUpObrigatorioViewModel(
                numeroNullAble: viewmodel.${propriedade.nome},
                mensagemObrigatorio: App_GlobalResources.${areaName}.${controllerName}.msgCampo${propriedadeNormalizada}Obrigatorio
            );\n`;

            adicionarResourceObrigatorio(propriedadeNormalizada, listaPropriedadesJaUsadas, resourcesLabels)
                break;
            // case tipo.decimalNullAble:

            //     saida += "\n";
            //     saida += `
            //     ValidaDecimalMinMax(
            //         min: viewmodel.PrecoMinimo,
            //         max: viewmodel.PrecoMaximo,
            //         mensagemValorMinMaior: App_GlobalResources.${areaName}.${controllerName}.msgPrecoMinMaior
            //     );\n`;

            //     break;
            default:
                break;
        }
    }

    resourcesLabels.forEach( resource => saida += resource);
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
            validationResultViewModel.Result.DataSource = new List<${classeName}ViewModel>();
            ValidationResult<PagingResult<${classeName}TO>> validationPaging${classeName}TO = i${controllerName}AppService.GetLista${classeName}(filtrosTO);
            
            bool sucessoAoBuscarDados = validationPaging${classeName}TO.IsValid;
            if (sucessoAoBuscarDados)
            {
                IEnumerable<${classeName}TO> lista${classeName}TO = validationPaging${classeName}TO.Result.DataSource;
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
    
function primeiraLetraMinuscula(nome){

    nome[0] = nome[0].toLowerCase();
    return nome;
}

function gerarInsert(controllerName, classeName){

    var nomeClassVar = primeiraLetraMinuscula(classeName);

    var texto = `
    public JsonResult Insert${classeName}([DataSourceRequest] DataSourceRequest request, ${classeName}ViewModel viewmodel)
    {
        ValidarModel${classeName}(viewmodel);
        var validationResultViewModel = new ValidationResult<${classeName}ViewModel>();

        bool dadosValidos = ModelState.IsValid;
        if (dadosValidos)
        {
            Dto.${controllerName}.${classeName}TO ${nomeClassVar}TO = (Dto.${controllerName}.${classeName}TO) viewmodel;
            ValidationResult validation${classeName}TO = i${controllerName}AppService.Insert${classeName}(${nomeClassVar}TO);

            bool sucessoAoInserir = validation${classeName}TO.IsValid;
            if (sucessoAoInserir)
            {
                validationResultViewModel.Result = (${classeName}ViewModel) ${nomeClassVar}TO;
            }
            else
            {
                validation${classeName}TO.ValidationResultToModelState(ModelState);
            }
        }

        return Json(validationResultViewModel.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
    }
    `

    return texto;
}
  
function fecharArquivo(){
    var textoSaida = "}\n}";
    return textoSaida;
}
