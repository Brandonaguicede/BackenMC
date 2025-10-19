using System.ComponentModel.DataAnnotations;
using System.Net.NetworkInformation;

using AppPrint_and_Wear.Models;


namespace TuProyecto.Models
{
 
    public class Producto
    {
        public int ProductoId { get; set; }
        public decimal Precio { get; set; }
       // public List<ColorOpcion> Colores { get; set; } 
       // public List<CartItem> CartItems { get; set; }

        public int CategoriaId { get; set; }      // clave foránea
        public Categoria Categoria { get; set; }  // propiedad de navegación
    }
}
