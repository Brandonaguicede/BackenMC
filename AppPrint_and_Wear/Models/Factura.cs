namespace AppPrint_and_Wear.Models
{
    public class Factura
    {
        public int FacturaId { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
        public double Total { get; set; }
        // Relaciones
        public int Carrito_De_CompraId { get; set; } // Llave foránea
        public Carrito_De_Compra Carrito_De_Compra { get; set; } // Propiedad de navegación
        public List<DetalleFactura> Detalle_Facturas { get; set; } = new List<DetalleFactura>(); // evita erroress de null reference
    }
}
