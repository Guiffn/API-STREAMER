using Streamer.Models;

public interface IAuthService
{
        string GerarTokenJwt(Usuario usuario);
        bool VerificarSenha(string senhaTextoPlano, string senhaHash);
        string GerarHashSenha(string senhaTextoPlano);
}
