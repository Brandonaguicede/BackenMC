namespace AppPrint_and_Wear.Models
{
    public class DetalleFactura
    {
        public int DetalleFacturaId { get; set; }
        public string Nombre { get; set; }
        public int Cantidad { get; set; }
        public double PrecioUnitario { get; set; }
        public double Subtotal { get; set; }
        // Relaciones
        public int FacturaId { get; set; } // Llave foránea
        public Factura Factura { get; set; } // Propiedad de navegación
        public int ProductoId { get; set; } // Llave foránea
    }
}
