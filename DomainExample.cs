namespace Universal.Tois.RecebimentoTabaco.Domain.DomainService
{
    using System.Collections.Generic;
    using System.Linq;
    using Universal.Data.Pagination;
    using Universal.Extensions;
    using Universal.Tois.DB.FarmersCatalog.Data;
    using Universal.Tois.DB.GeneralCatalog.Data;
    using Universal.Tois.DB.ReceivingCatalog.Data;
    using Universal.Tois.Enumeration.CommercialCatalog;
    using Universal.Tois.Enumeration.Common;
    using Universal.Tois.Enumeration.FarmersCatalog;
    using Universal.Tois.RecebimentoTabaco.Dto.CadastrarPoliticaNegociacaoCompra;
    using Universal.Tois.RecebimentoTabaco.Dto.Common;

    /// <summary>
    /// Implement the functionalities of the <see cref="CadastrarPoliticaNegociacaoCompraAppDomainService"/> class.
    /// </summary>
    public partial class CadastrarPoliticaNegociacaoCompraAppDomainService
        : Universal.Tois.RecebimentoTabaco.Contracts.Interface.DomainService.ICadastrarPoliticaNegociacaoCompraAppDomainService
    {
        private PagingResult<CadastrarPoliticaNegociacaoCompraTO> GerarPagingResult(PagingParameterTO pagingParameter, IQueryable<PoliticaNegociacaoCompra> listaPoliticaNegociacao)
        {
            PagingResult<CadastrarPoliticaNegociacaoCompraTO> pagingResult = new PagingResult<CadastrarPoliticaNegociacaoCompraTO>();

            int total = listaPoliticaNegociacao.Count();
            pagingResult.Total = total;

            bool contemRegistros = total > 0;
            if (contemRegistros)
            {
                IQueryable<PoliticaNegociacaoCompra> pagina = Paginar(pagingParameter, listaPoliticaNegociacao);

                pagina = OrdenarLista(pagina);

                IQueryable<CadastrarPoliticaNegociacaoCompraTO> listaTO = pagina.Select(e => new CadastrarPoliticaNegociacaoCompraTO
                {
                    Id = e.Id,
                    DataInicio = e.DataInicio,
                    DataFim = e.DataFim,
                    Descricao = e.Descricao,
                    Responsavel = e.Responsavel,
                    TipoTabacoCodigo = e.TipoTabacoCodigo,
                    TipoTabacoDescricao = e.TipoTabaco.Sigla,
                    Ativo = e.DataFim == null
                });

                pagingResult.DataSource = listaTO;
            }

            return pagingResult;
        }
        private PagingResult<ConfiguracaoNegociacaoCompraTO> GerarPagingResult(PagingParameterTO pagingParameter, IQueryable<ConfiguracaoNegociacaoCompra> listaConfiguracoes)
        {
            PagingResult<ConfiguracaoNegociacaoCompraTO> pagingResult = new PagingResult<ConfiguracaoNegociacaoCompraTO>();

            int total = listaConfiguracoes.Count();
            pagingResult.Total = total; 

            bool contemRegistros = total > 0;
            if (contemRegistros)
            {
                IQueryable<ConfiguracaoNegociacaoCompra> pagina = Paginar(pagingParameter, listaConfiguracoes);

                pagina = OrdenarLista(pagina);

                IEnumerable<ConfiguracaoNegociacaoCompraTO> listaTO = pagina.ToList().Select(to =>
                {
                    bool ativo = to.DataFim == null;
                    bool ehNegociacaoComClassificacao = to.TipoNegociacaoCompraTabaco.Codigo == EnumTipoNegociacaoCompra.NegociacaoComClassificacao.GetIntValue();
                    bool ehNegociacaoSwap = to.TipoNegociacaoCompraTabaco.Codigo == EnumTipoNegociacaoCompra.Swap.GetIntValue() &&  to.PoliticaNegociacaoCompra != null;
                    bool politicaNegociacaoExiste = to.PoliticaNegociacaoCompra != null;

                    int politicaNegociacaoCodigo = ehNegociacaoComClassificacao && politicaNegociacaoExiste ? to.PoliticaNegociacaoCompra.Id : 0;
                    string politicaNegociacaoDescricao = ehNegociacaoComClassificacao && politicaNegociacaoExiste ? to.PoliticaNegociacaoCompra.Descricao : string.Empty;
                    return new ConfiguracaoNegociacaoCompraTO
                    {
                        Id = to.Id,
                        PoliticaNegociacaoCompraId = to.PoliticaNegociacaoCompraId,
                        AreaProdutorCodigo = to.AreaProdutor.Id,
                        TipoNegociacaoCompraCodigo = to.TipoNegociacaoCompraTabaco.Codigo,
                        TipoNegociacaoCompraDescricao = to.TipoNegociacaoCompraTabaco.Descricao,
                        AreaProdutorDescricao = to.AreaProdutor.Descricao,
                        TipoTabacoDescricao = to.TipoTabaco.Descricao,
                        TipoTabacoCodigo = to.TipoTabacoCodigo,
                        PrecoMinimo = to.PrecoMinimo,
                        PrecoMaximo = to.PrecoMaximo,
                        SetCamposPrecoVisivel = ehNegociacaoSwap,
                        PoliticaNegociacaoCadastravel = ehNegociacaoComClassificacao,
                        PoliticaNegociacaoCompraCodigo = politicaNegociacaoCodigo,
                        PoliticaNegociacaoCompraDescricao = politicaNegociacaoDescricao,
                        Ativo = ativo,
                    };
                });

                pagingResult.DataSource = listaTO;
            }

            return pagingResult;
        }
        private static IQueryable<T> Paginar<T>(PagingParameterTO pagingParameter, IQueryable<T> listaPoliticaNegociacao)
        {
            return listaPoliticaNegociacao.Skip((pagingParameter.Page - 1) * pagingParameter.Size).Take(pagingParameter.Size);
        }
        public PagingResult<CadastrarPoliticaNegociacaoCompraTO> GetListaPolitica(PoliticaNegociacaoCompraConfiguracaoTO filtros)
        {
            var listaCompleta = PoliticaNegociacaoCompraRepository.FindAll();

            var pagingResult = GerarPagingResult(filtros.PagingParameterTO, listaCompleta);
            return pagingResult;
        }
        private static IQueryable<ConfiguracaoNegociacaoCompra> FiltrarListaConfiguracoes(PoliticaNegociacaoCompraConfiguracaoTO filtros, IQueryable<ConfiguracaoNegociacaoCompra> listaCompleta)
        {
            if (filtros.AtivoEInativos == EnumSimNao.Nao.GetStringValue())
            {
                listaCompleta = listaCompleta.Where(e => e.DataFim == null);
            }

            bool contemTipoTabacoFilter = !string.IsNullOrWhiteSpace(filtros.TipoTabaco);
            if (contemTipoTabacoFilter)
            {
                listaCompleta = listaCompleta.Where(e => e.TipoTabacoCodigo == filtros.TipoTabaco);
            }

            listaCompleta = BuscarPorAreaProdutorNivelSupervisor(listaCompleta);

            bool contemFiltroAreaProdutor = !string.IsNullOrWhiteSpace(filtros.AreaProdutor);
            if (contemFiltroAreaProdutor)
            {
                listaCompleta = listaCompleta.ToList().Where(e => e.AreaProdutor.Descricao == filtros.AreaProdutor).AsQueryable();
            }

            listaCompleta = OrdenarLista(listaCompleta);
            return listaCompleta;
        }
        private static IQueryable<PoliticaNegociacaoCompra> OrdenarLista(IQueryable<PoliticaNegociacaoCompra> listaCompleta)
        {
            listaCompleta = listaCompleta.OrderBy( e => e.DataFim);
            return listaCompleta;
        }
        private static IQueryable<ConfiguracaoNegociacaoCompra> OrdenarLista(IQueryable<ConfiguracaoNegociacaoCompra> listaCompleta)
        {
            listaCompleta = listaCompleta.OrderBy(e => e.DataFim);
            return listaCompleta;
        }
        private static IQueryable<CadastrarPoliticaNegociacaoCompraTO> OrdenarLista(IQueryable<CadastrarPoliticaNegociacaoCompraTO> listaCompleta)
        {
            listaCompleta = listaCompleta.OrderBy(e => e.DataFim);
            return listaCompleta;
        }
        public void AtualizarPolitica(CadastrarPoliticaNegociacaoCompraTO to)
        {
            TipoTabaco tipoTabaco = TipoTabacoRepository.GetByID(to.TipoTabacoCodigo);

            PoliticaNegociacaoCompra politicaAntiga = PoliticaNegociacaoCompraRepository.GetByID(to.Id);
            politicaAntiga.DataFim = PoliticaNegociacaoCompraRepository.DataContext.GetDate();

            PoliticaNegociacaoCompra novaPolitica = new PoliticaNegociacaoCompra
            {
                TipoTabaco  = tipoTabaco,
                Descricao   = to.Descricao,
                DataInicio  = PoliticaNegociacaoCompraRepository.DataContext.GetDate(),
                DataFim     = null,
                Responsavel = UserExtension.GetCurrentUserName(),
            };

            PoliticaNegociacaoCompraRepository.Add(novaPolitica);
        }
        public void InserirPolitica(CadastrarPoliticaNegociacaoCompraTO to)
        {
            TipoTabaco tipoTabaco = TipoTabacoRepository.GetByID(to.TipoTabacoCodigo);

            PoliticaNegociacaoCompra politica = new PoliticaNegociacaoCompra
            {
                TipoTabaco = tipoTabaco,
                Descricao = to.Descricao,
                DataFim = to.DataFim,
                Responsavel = UserExtension.GetCurrentUserName(),
                DataInicio = PoliticaNegociacaoCompraRepository.DataContext.GetDate()
            };

            to.TipoTabacoDescricao = tipoTabaco.Sigla;
            to.DataInicio = politica.DataInicio;
            to.Responsavel = politica.Responsavel;
            to.Id = politica.Id;

            PoliticaNegociacaoCompraRepository.Add(politica, true);
        }
        public PagingResult<ConfiguracaoNegociacaoCompraTO> GetListaPoliticaConfiguracoes(PoliticaNegociacaoCompraConfiguracaoTO filtros)
        {
            IQueryable<ConfiguracaoNegociacaoCompra> configuracoes = ConfiguracaoNegociacaoCompraRepository.FindAll();
            configuracoes = FiltrarListaConfiguracoes(filtros , configuracoes);

            return GerarPagingResult(filtros.PagingParameterTO, configuracoes);
        }
        private static IQueryable<ConfiguracaoNegociacaoCompra> BuscarPorAreaProdutorNivelSupervisor(PoliticaNegociacaoCompra politica)
        {
            return politica.ConfiguracaoNegociacaoCompras.Where(config =>
                config.AreaProdutor.NivelAreaProdutor.Codigo == EnumNivelAreaProdutor.Supervisor.GetIntValue()).AsQueryable();
        }
        private static IQueryable<ConfiguracaoNegociacaoCompra> BuscarPorAreaProdutorNivelSupervisor(IQueryable<ConfiguracaoNegociacaoCompra> listaConfiguracao)
        {
            return listaConfiguracao.Where(config =>
                config.AreaProdutor.NivelAreaProdutor.Codigo == EnumNivelAreaProdutor.Supervisor.GetIntValue());
        }
        public void AtivarInativarPolitica(int politicaId, bool ativo)
        {
            PoliticaNegociacaoCompra politica = PoliticaNegociacaoCompraRepository.GetByID(politicaId);

            if (ativo)
            {
                InativarPolitica(politica);
            }
            else
            {
                AtivarPolitica(politica);
            }

        }
        public void AtivarInativarPoliticaConfiguracao(int configuracaoId, bool ativo)
        {
            ConfiguracaoNegociacaoCompra configuracao = ConfiguracaoNegociacaoCompraRepository.GetByID(configuracaoId);

            if (ativo)
            {
                InativarPoliticaConfiguracao(configuracao);
            }
            else
            {
                AtivarPoliticaConfiguracao(configuracao);
            }

        }
        private static void AtivarPolitica(PoliticaNegociacaoCompra politica)
        {
            politica.Responsavel = UserExtension.GetCurrentUserName();
            politica.DataFim = null;
        }
        private void InativarPolitica(PoliticaNegociacaoCompra politica)
        {
            politica.DataFim = PoliticaNegociacaoCompraRepository.DataContext.GetDate();
            politica.Responsavel = UserExtension.GetCurrentUserName();
        }
        private static void AtivarPoliticaConfiguracao(ConfiguracaoNegociacaoCompra configuracao)
        {
            configuracao.UsuarioInicio = UserExtension.GetCurrentUserName();
            configuracao.DataFim = null;
        }
        private void InativarPoliticaConfiguracao(ConfiguracaoNegociacaoCompra configuracao)
        {
            configuracao.DataFim = PoliticaNegociacaoCompraRepository.DataContext.GetDate();
            configuracao.UsuarioFim = UserExtension.GetCurrentUserName();
        }
        public void InserirConfiguracaoPolitica(ConfiguracaoNegociacaoCompraTO configuracaoTO)
        {
            TipoTabaco tipoTabaco = TipoTabacoRepository.GetByID(configuracaoTO.TipoTabacoCodigo);
            AreaProdutor areaProdutor = AreaProdutorRepository.GetByID(configuracaoTO.AreaProdutorCodigo.GetValueOrDefault());
            TipoNegociacaoCompraTabaco tipoNegociacaoCompraTabaco = TipoNegociacaoCompraTabacoRepository.GetByID(configuracaoTO.TipoNegociacaoCompraCodigo);

            ConfiguracaoNegociacaoCompra configuracaoNegociacaoCompra = new ConfiguracaoNegociacaoCompra
            {
                TipoTabaco = tipoTabaco,
                AreaProdutor = areaProdutor,
                UsuarioInicio = UserExtension.GetCurrentUserName(),
                PrecoMinimo = configuracaoTO.PrecoMinimo,
                PrecoMaximo = configuracaoTO.PrecoMaximo,
                TipoTabacoCodigo = configuracaoTO.TipoTabacoCodigo,
                TipoNegociacaoCompraTabaco = tipoNegociacaoCompraTabaco,
                DataInicio = TipoTabacoRepository.DataContext.GetDate()
            };

            bool hasPolitica = configuracaoTO.PoliticaNegociacaoCompraCodigo != null && configuracaoTO.PoliticaNegociacaoCompraCodigo != 0;
            if (hasPolitica)
            {
                PoliticaNegociacaoCompra politica =  PoliticaNegociacaoCompraRepository.GetByID(configuracaoTO.PoliticaNegociacaoCompraCodigo.GetValueOrDefault());
                configuracaoNegociacaoCompra.PoliticaNegociacaoCompra = politica;
                configuracaoTO.PoliticaNegociacaoCompraDescricao = politica.Descricao;
                configuracaoTO.Descricao = politica.Descricao;
            }
            else
            {
                configuracaoTO.PoliticaNegociacaoCompraDescricao = string.Empty;
            }

            configuracaoTO.TipoTabacoDescricao = tipoTabaco.Descricao;
            configuracaoTO.AreaProdutorDescricao = areaProdutor.Descricao;
            configuracaoTO.TipoNegociacaoCompraDescricao = tipoNegociacaoCompraTabaco.Descricao;
            configuracaoTO.Ativo = true;

            ConfiguracaoNegociacaoCompraRepository.Add(configuracaoNegociacaoCompra, true);
            configuracaoTO.Id = configuracaoNegociacaoCompra.Id;
        }
        public void AtualizarConfiguracaoPolitica(ConfiguracaoNegociacaoCompraTO to)
        {
            ConfiguracaoNegociacaoCompra configuracaoAntiga = ConfiguracaoNegociacaoCompraRepository.GetByID(to.Id);

            PoliticaNegociacaoCompra politica = PoliticaNegociacaoCompraRepository.GetByID(to.PoliticaNegociacaoCompraCodigo.GetValueOrDefault());
            TipoTabaco tipoTabaco = TipoTabacoRepository.GetByID(to.TipoTabacoCodigo);
            AreaProdutor areaProdutor = AreaProdutorRepository.GetByID(to.AreaProdutorCodigo.GetValueOrDefault());
            TipoNegociacaoCompraTabaco tipoNegociacaoCompraTabaco = TipoNegociacaoCompraTabacoRepository.GetByID(to.TipoNegociacaoCompraCodigo);

            ConfiguracaoNegociacaoCompra configuracaoNegociacaoCompra = new ConfiguracaoNegociacaoCompra
            {
                TipoTabaco = tipoTabaco,
                AreaProdutor = areaProdutor,
                UsuarioInicio = UserExtension.GetCurrentUserName(),
                PrecoMinimo = to.PrecoMinimo,
                PrecoMaximo = to.PrecoMaximo,
                TipoTabacoCodigo = to.TipoTabacoCodigo,
                PoliticaNegociacaoCompra = politica,
                TipoNegociacaoCompraTabaco = tipoNegociacaoCompraTabaco,
                DataInicio = TipoTabacoRepository.DataContext.GetDate(),
                DataFim = null
            };

            to.TipoTabacoDescricao = tipoTabaco.Descricao;
            to.AreaProdutorDescricao = areaProdutor.Descricao;
            to.TipoNegociacaoCompraDescricao = tipoNegociacaoCompraTabaco.Descricao;
            to.PoliticaNegociacaoCompraDescricao = politica.Descricao;
            to.Descricao = politica.Descricao;

            InativarPoliticaConfiguracao(configuracaoAntiga);
        }
    }

}
