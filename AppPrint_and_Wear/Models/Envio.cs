namespace AppPrint_and_Wear.Models
{
    public class Envio
    {
        public int EnvioId { get; set; }
        public string Direccion_De_Envio { get; set; }
        public DateTime ShippingDate { get; set; }
        public string Tiempo_Estimado { get; set; }
        public string Numero_De_Rastreo { get; set; }
        public string Estado { get; set; }

        // llave foranea hacia Carrito_De_Compra
        public int Carrito_De_CompraId { get; set; }  // llave
        public Carrito_De_Compra Carrito { get; set; }  // propiedad de navegación

    }
}
