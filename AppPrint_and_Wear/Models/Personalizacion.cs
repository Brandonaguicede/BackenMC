namespace AppPrint_and_Wear.Models
{
    public class Personalizacion
    {
        public int Id { get; set; }
        public int CamisaId { get; set; }
        public string TextoEstampado { get; set; }
        public string ImagenEstampado { get; set; } // URL o ruta
        public string PosicionEstampado { get; set; } // Frente, Espalda, Manga
    }
}
