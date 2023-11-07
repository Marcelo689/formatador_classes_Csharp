namespace Universal.Fabrica.Web.Areas.Operacoes.Models.CadastrarTemplate{
    public class Template{
        public int Id {get;set;}
        public string Nome {get;set;}
        public DateTime Data {get;set;}
        public DateTime? DataFinalizado {get;set;}
        public decimal Salario {get;set;}
        public double Peso {get;set;}
        public float Altura {get;set;}
        public int? TipoBananaCodigo {get;set;}
        public string TipoBananaDescricao {get;set;}
    }
}
