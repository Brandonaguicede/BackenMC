namespace AppPrint_and_Wear.Models
{
    public class Producto
    {
        public int ProductoId { get; set; }
        public string Nombre { get; set; }
        public string Descriccion { get; set; }
        public double Precio { get; set; }
        public int Stock { get; set; }

        //relacion 
        public List<CartItem> CartItems { get; set; }

        public int Id { get; set; }
        public Categoria Categorias { get; set; }
    }
}
