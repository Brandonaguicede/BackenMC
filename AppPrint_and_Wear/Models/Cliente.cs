namespace AppPrint_and_Wear.Models
{
    public class Cliente : Persona
    {
        public int ClienteId { get; set; }

        // Propiedad de navegación 1 cliente tiene 1 carrito
        public int Carrito_De_Compra { get; set; }
        public Carrito_De_Compra Carrito { get; set; }
        // Relaciones con método de pago
        public List<Metodo_De_Pago> Metodo_De_Pagos { get; set; }
    }
}
