namespace AppPrint_and_Wear.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        public string Nombre { get; set; }


        //relacion de uno a muchos con productos
        public List<Producto> Productos { get; set; }
    }
}
