using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Universal.Data.Pagination;
using Universal.Tois.RecebimentoTabaco.Contracts.Interface.AppService;
using Universal.Tois.RecebimentoTabaco.Dto.CadastrarPoliticaNegociacaoCompra;
using Universal.Tois.RecebimentoTabaco.Dto.Common;
using Universal.Tois.RecebimentoTabaco.Web.Areas.Cadastros.Models.CadastrarPoliticaNegociacaoCompra;
using Universal.Tois.WebCommon.Controllers;
using Universal.Validation;
using Universal.Web.Mvc.Extensions;
using Universal.Web.Telerik.Mvc5.Extensions;

namespace Universal.Tois.RecebimentoTabaco.Web.Areas.Cadastros.Controllers
{
#if !DEBUG
        [Authorize( Roles = "CadastrarPoliticaNegociacaoCompra" )]
#endif
    public class CadastrarPoliticaNegociacaoCompraController : ToisController
    {
        private ICadastrarPoliticaNegociacaoCompraAppAppService iCadastrarPoliticaNegociacaoCompraAppService;
        public CadastrarPoliticaNegociacaoCompraController(ICadastrarPoliticaNegociacaoCompraAppAppService cadastrarPoliticaNegociacaoCompraAppService)
        {
            iCadastrarPoliticaNegociacaoCompraAppService = cadastrarPoliticaNegociacaoCompraAppService;
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult SubGrid(int id)
        {
            return PartialView("_SubGrid", id);
        }
        public ActionResult TabPoliticaNegociacao()
        {
            return PartialView("_PoliticaNegociacaoCompra");
        }
        public ActionResult TabPoliticaConfiguracao()
        {
            return PartialView("_ConfiguracaoPoliticaNegociacao");
        }
        public JsonResult ReadPolitica([DataSourceRequest] DataSourceRequest request, PoliticaNegociacaoCompraConfiguracaoViewModel filtrosViewModel)
        {
            PoliticaNegociacaoCompraConfiguracaoTO filtrosTO = (PoliticaNegociacaoCompraConfiguracaoTO) filtrosViewModel;

            filtrosTO.PagingParameterTO = new PagingParameterTO(request.Page, request.PageSize);

            TratarModelo(filtrosTO);

            ValidationResult<PagingResult<PoliticaNegociacaoCompraViewModel>> validationResultViewModel = new ValidationResult<PagingResult<PoliticaNegociacaoCompraViewModel>>();
            validationResultViewModel.Result = new PagingResult<PoliticaNegociacaoCompraViewModel>();
            ValidationResult<PagingResult<CadastrarPoliticaNegociacaoCompraTO>> validationPagingPoliticaNegociacaoTO = iCadastrarPoliticaNegociacaoCompraAppService.GetListaPolitica(filtrosTO);
            IEnumerable< CadastrarPoliticaNegociacaoCompraTO> listaNegociacaoTO = validationPagingPoliticaNegociacaoTO.Result.DataSource;

            bool sucessoAoBuscarDados = validationPagingPoliticaNegociacaoTO.IsValid;
            if (sucessoAoBuscarDados)
            {
                bool listaPreenchida = listaNegociacaoTO != null;
                if (listaPreenchida)
                {
                    validationResultViewModel.Result.DataSource = listaNegociacaoTO.Select(to => (PoliticaNegociacaoCompraViewModel) to).ToList();
                    validationResultViewModel.Result.Total = validationPagingPoliticaNegociacaoTO.Result.Total;
                }
                else
                {
                    validationResultViewModel.ValidationResultToModelState(ModelState);
                }
            }

            return Json(validationResultViewModel.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
        }
        public JsonResult AtualizarPolitica([DataSourceRequest] DataSourceRequest request, PoliticaNegociacaoCompraViewModel viewModel)
        {
            CadastrarPoliticaNegociacaoCompraTO to = (CadastrarPoliticaNegociacaoCompraTO) viewModel; 
            ValidarModelTO(to);
            
            if (ModelState.IsValid)
            {
                ValidationResult atualizarValidation = iCadastrarPoliticaNegociacaoCompraAppService.AtualizarPolitica(to);

                bool falhaAoAtualizar = !atualizarValidation.IsValid;
                if (falhaAoAtualizar)
                {
                    atualizarValidation.ValidationResultToModelState(this.ModelState);
                }
            }

            return Json(new[] { viewModel }.ToDataSourceResult(request, this.ModelState));
        }
        public JsonResult InserirPolitica([DataSourceRequest] DataSourceRequest request, PoliticaNegociacaoCompraViewModel viewModel)
        {
            CadastrarPoliticaNegociacaoCompraTO to = (CadastrarPoliticaNegociacaoCompraTO) viewModel;
            ValidarModelTO(to);

            if (ModelState.IsValid)
            {
                ValidationResult validation = iCadastrarPoliticaNegociacaoCompraAppService.InserirPolitica(to);

                bool fracassoAoInserir = !validation.IsValid;
                if (fracassoAoInserir)
                {
                    validation.ValidationResultToModelState(this.ModelState);
                }
                else
                {
                    viewModel = (PoliticaNegociacaoCompraViewModel) to;
                }
            }

            return Json(new[] { viewModel }.ToDataSourceResult(request, this.ModelState));
        }
        public JsonResult ReadPoliticaConfiguracao([DataSourceRequest] DataSourceRequest request, PoliticaNegociacaoCompraConfiguracaoViewModel filtrosViewModel)
        {
            PoliticaNegociacaoCompraConfiguracaoTO filtrosTO = (PoliticaNegociacaoCompraConfiguracaoTO) filtrosViewModel;
            filtrosTO.PagingParameterTO = new PagingParameterTO(request.Page, request.PageSize);
            TratarModelo(filtrosTO);

            ValidationResult<PagingResult<ConfiguracaoNegociacaoCompraViewModel>> validationResultViewModel = new ValidationResult<PagingResult<ConfiguracaoNegociacaoCompraViewModel>>();
            validationResultViewModel.Result = new PagingResult<ConfiguracaoNegociacaoCompraViewModel>();
            ValidationResult<PagingResult<ConfiguracaoNegociacaoCompraTO>> validationResultPoliticaConfiguracaoTO = iCadastrarPoliticaNegociacaoCompraAppService.GetListaPoliticaConfiguracoes(filtrosTO);
            IEnumerable<ConfiguracaoNegociacaoCompraTO> lista = validationResultPoliticaConfiguracaoTO.Result.DataSource;

            bool sucessoAoBuscar = validationResultPoliticaConfiguracaoTO.IsValid;
            if (sucessoAoBuscar)
            {
                bool listaPreenchida = lista != null;
                if (listaPreenchida)
                {
                    validationResultViewModel.Result.DataSource = lista.Select(to => (ConfiguracaoNegociacaoCompraViewModel) to).ToList();
                    validationResultViewModel.Result.Total = validationResultPoliticaConfiguracaoTO.Result.Total;
                }
                else
                {
                    validationResultViewModel.ValidationResultToModelState(ModelState);
                }
            }

            return Json(validationResultViewModel.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
        }
        public JsonResult InserirConfiguracaoPolitica([DataSourceRequest] DataSourceRequest request, ConfiguracaoNegociacaoCompraViewModel viewModel)
        {
            ConfiguracaoNegociacaoCompraTO to = (ConfiguracaoNegociacaoCompraTO) viewModel;
            ValidarModelConfiguracaoTO(viewModel);

            if (ModelState.IsValid)
            {
                ValidationResult validation = iCadastrarPoliticaNegociacaoCompraAppService.InserirConfiguracaoPolitica(to);

                bool fracassoAoInserir = !validation.IsValid;
                if (fracassoAoInserir)
                {
                    validation.ValidationResultToModelState(this.ModelState);
                }
                else
                {
                    viewModel = (ConfiguracaoNegociacaoCompraViewModel) to;
                }
            }

            return Json(new[] { viewModel }.ToDataSourceResult(request, this.ModelState));
        }
        public JsonResult UpdatePoliticaConfiguracao([DataSourceRequest] DataSourceRequest request, ConfiguracaoNegociacaoCompraViewModel viewModel)
        {
            ConfiguracaoNegociacaoCompraTO to = (ConfiguracaoNegociacaoCompraTO)viewModel;
            ValidarModelConfiguracaoTO(viewModel);

            if (ModelState.IsValid)
            {
                ValidationResult validation = iCadastrarPoliticaNegociacaoCompraAppService.AtualizarConfiguracaoPolitica(to);

                bool fracassoAoInserir = !validation.IsValid;
                if (fracassoAoInserir)
                {
                    validation.ValidationResultToModelState(this.ModelState);
                }
                else
                {
                    viewModel = (ConfiguracaoNegociacaoCompraViewModel)to;
                }
            }

            return Json(new[] { viewModel }.ToDataSourceResult(request, this.ModelState));
        }
        public JsonResult AtivarInativarPolitica(int id, bool ativo)
        {
            ValidationResult validation = iCadastrarPoliticaNegociacaoCompraAppService.AtivarInativarPolitica(id, ativo);

            bool fracassouAoAtivarInativar = !validation.IsValid;
            if (fracassouAoAtivarInativar)
            {
                validation.ValidationResultToModelState(this.ModelState);
            }

            return Json(validation, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AtivarInativarPoliticaConfiguracao(int id, bool ativo)
        {
            ValidationResult validation = iCadastrarPoliticaNegociacaoCompraAppService.AtivarInativarConfiguracaoPolitica(id, ativo);

            bool fracassouAoAtivarInativar = !validation.IsValid;
            if (fracassouAoAtivarInativar)
            {
                validation.ValidationResultToModelState(this.ModelState);
            }

            return Json(validation, JsonRequestBehavior.AllowGet);
        }
        private void ValidaStringDoViewModel(string texto, string mensagemEhNulo, bool contemValidacaoTamanhoMaximo = true, int tamanhoMaximo = 0, string mensagemTamanhoMaximo = "")
        {
            if (string.IsNullOrWhiteSpace(texto))
            {
                this.ModelState.AddModelError(string.Empty, mensagemEhNulo);
            }
            else if (contemValidacaoTamanhoMaximo && texto.Length > tamanhoMaximo)
            {
                this.ModelState.AddModelError(string.Empty, mensagemTamanhoMaximo);
            }
        }
        private void ValidarModelTO(CadastrarPoliticaNegociacaoCompraTO to)
        {
            ValidaStringDoViewModel(
                texto: to.Descricao,
                mensagemEhNulo: App_GlobalResources.Cadastros.CadastrarPoliticaNegociacaoCompra.msgCampoDescricaoVazio,
                tamanhoMaximo: 50,
                mensagemTamanhoMaximo: App_GlobalResources.Cadastros.CadastrarPoliticaNegociacaoCompra.msgCampoDescricaoTamanhoMaximo
             );

            ValidaStringDoViewModel(
                texto: to.TipoTabacoCodigo,
                mensagemEhNulo: App_GlobalResources.Cadastros.CadastrarPoliticaNegociacaoCompra.msgCampoTipoTabacoVazio,
                contemValidacaoTamanhoMaximo : false
            );
        }
        private void ValidarModelConfiguracaoTO(ConfiguracaoNegociacaoCompraViewModel viewModel)
        {
            ValidaDecimalMinMax(
                min: viewModel.PrecoMinimo,
                max: viewModel.PrecoMaximo,
                mensagemValorMinMaior: App_GlobalResources.Cadastros.CadastrarPoliticaNegociacaoCompra.msgPrecoMinMaior);

            ValidaIntNullableLookUpObrigatorioViewModel(
                numeroNullAble: viewModel.AreaProdutorCodigo,
                mensagemObrigatorio: App_GlobalResources.Cadastros.CadastrarPoliticaNegociacaoCompra.msgAreaProdutorObrigatorio
            );

            ValidaStringNullAble(
                campoString: viewModel.TipoTabacoCodigo,
                mensagemObrigatorio: App_GlobalResources.Cadastros.CadastrarPoliticaNegociacaoCompra.msgCampoTipoTabacoVazio
            );

            ValidaIntNullableLookUpObrigatorioViewModel(
                numeroNullAble: viewModel.TipoNegociacaoCompraCodigo,
                mensagemObrigatorio: App_GlobalResources.Cadastros.CadastrarPoliticaNegociacaoCompra.msgTipoNegociacaoCompraObrigatorio
            );
        }
        private void ValidaStringNullAble(string campoString, string mensagemObrigatorio, bool contemValidacaoTamanhoMaximo = false, string mensagemTamanhoInvalido = "", int tamanhoMaximo = 0)
        {
            if (string.IsNullOrWhiteSpace(campoString))
            {
                this.ModelState.AddModelError(string.Empty, mensagemObrigatorio);
            }

            if (contemValidacaoTamanhoMaximo)
            {
                bool tamanhoInvalido = campoString.Length > tamanhoMaximo;

                if (tamanhoInvalido)
                {
                    this.ModelState.AddModelError(string.Empty, mensagemTamanhoInvalido);
                }
            }
        }
        private void ValidaIntNullableLookUpObrigatorioViewModel(int? numeroNullAble, string mensagemObrigatorio)
        {
            if (!numeroNullAble.HasValue)
            {
                this.ModelState.AddModelError(string.Empty, mensagemObrigatorio);
            }
        }
        private void ValidaDecimalMinMax(decimal? min, decimal? max, string mensagemValorMinMaior)
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

        }
        private string PreencheStringCasoNula(string texto)
        {
            if (texto == null)
            {
                return string.Empty;
            }
            else
            {
                return texto;
            }
        }
        private void TratarModelo(PoliticaNegociacaoCompraConfiguracaoTO filtros)
        {
            filtros.Descricao = PreencheStringCasoNula(filtros.Descricao);
            filtros.TipoTabaco = PreencheStringCasoNula(filtros.TipoTabaco);
            filtros.AreaProdutor = PreencheStringCasoNula(filtros.AreaProdutor);
            filtros.AtivoEInativos = PreencheStringCasoNula(filtros.AtivoEInativos);
        }

    }
}