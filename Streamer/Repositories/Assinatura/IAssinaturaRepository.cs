namespace Streamer.Data
{
 
    public interface IAssinaturaRepository
    {
        void Cadastrar(Assinatura assinatura);

        List<Assinatura> Listar();

        Assinatura? BuscarId(int id);

        void Remover(Assinatura assinatura);
    }
}
