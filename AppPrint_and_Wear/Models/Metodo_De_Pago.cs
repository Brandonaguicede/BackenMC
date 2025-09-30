namespace AppPrint_and_Wear.Models
{
    public class Metodo_De_Pago
    {
        public int Metodo_De_PagoId { get; set; }
        public string Nombre { get; set; }
        public string Metodo_Tipo { get; set; }
        public string Numero_Tarjeta { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string CVV { get; set; }

        //Relaciones
        public int ClienteId{ get; set; }
        public Cliente Cliente { get; set; } // Propiedad de navegación
        public Carrito_De_Compra Carrito_De_Compra { get; set; } // Propiedad de navegación
    }
}
