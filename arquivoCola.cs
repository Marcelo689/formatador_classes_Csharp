namespace CadastrarTemplate.Operacoes{
    public class Template{ 

      [Display(ResourceType = typeof(.Web.App_GlobalResources.Operacoes.CadastrarTemplate),
        Name =  nameof(Web.App_GlobalResources.Operacoes.CadastrarTemplate.labelId))]
        public int Id { get;set; }

      [Display(ResourceType = typeof(.Web.App_GlobalResources.Operacoes.CadastrarTemplate),
        Name =  nameof(Web.App_GlobalResources.Operacoes.CadastrarTemplate.labelNome))]
        public string Nome { get;set; }

      [Display(ResourceType = typeof(.Web.App_GlobalResources.Operacoes.CadastrarTemplate),
        Name =  nameof(Web.App_GlobalResources.Operacoes.CadastrarTemplate.labelSenha))]
        public string Senha { get;set; }

      [Display(ResourceType = typeof(.Web.App_GlobalResources.Operacoes.CadastrarTemplate),
        Name =  nameof(Web.App_GlobalResources.Operacoes.CadastrarTemplate.labelEmail))]
        public string Email { get;set; }

        public static explicit operator CadastrarTemplateViewModel(CadastrarTemplateTO to)
        {
            return new CadastrarTemplateViewModel{
                Id = to.Id,
                Nome = to.Nome,
                Senha = to.Senha,
                Email = to.Email,
            };
        }
    }
}
public class Pessoa{

  [Display(ResourceType = typeof(Solucao.Web.App_GlobalResources.Area.Controller),
    Name = nameof(Web.App_GlobalResources.Area.Controller.labelNome))]
  public string Nome {get;set;}
  public int Idade {get;set;}

  [Display(ResourceType = typeof(Solucao.Web.App_GlobalResources.Area.Controller),
    Name = nameof(Web.App_GlobalResources.Area.Controller.labelVivo))]

  public static explicit operator Pessoa(PessoaTO to)
  {
    return new Pessoa{
        Nome = to.Nome,
        Idade = to.Idade,
        Vivo = to.Vivo,
    };
  }
  public bool Vivo {get;set;}

}