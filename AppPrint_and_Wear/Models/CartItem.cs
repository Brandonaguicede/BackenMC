using TuProyecto.Models;

namespace AppPrint_and_Wear.Models
{
    public class CartItem
    {
        public int CartItemId { get; set; }
        public int Cantidad { get; set; }
        public double SubTotal { get; set; }

        //relaciones
        public int Carrito_De_Compra_Id { get; set; } //llave foranea
        public Carrito_De_Compra Carrito_De_Compra { get; set; } 
        public int ProductoId { get; set; }
        public Producto Productos { get; set; }
    }
}
