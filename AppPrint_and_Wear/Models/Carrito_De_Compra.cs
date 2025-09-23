namespace AppPrint_and_Wear.Models
{
    public class Carrito_De_Compra
    {
        public int Carrito_De_CompraId { get; set; }
        public double Total { get; set; }

        //relaciones
        public int ClienteId { get; set; }
        //propiedad de navegacion
        public Cliente Cliente { get; set; }
        
        public Envio Envio { get; set; }  // propiedad de navegación

        public List<CartItem> CartItems { get; set; }
    }
}
