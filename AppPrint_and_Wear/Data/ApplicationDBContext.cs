using AppPrint_and_Wear.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using TuProyecto.Models;

namespace AppPrint_and_Wear.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
            : base(options)
        {
        }

       public DbSet<Administrador> Administradores { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
       public DbSet<Categoria> Categorias { get; set; }

        public DbSet<Carrito_De_Compra> Carrito_De_Compras { get; set; }
        public DbSet<Envio> Envios { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Metodo_De_Pago> Metodo_De_Pagos { get; set; }
        public DbSet<CartItem> CartItems { get; set; }



        //no aparecen esas malditas 
        public DbSet<Factura> Facturas { get; set; }
        public DbSet <DetalleFactura> DetalleFacturas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Evita cascada automática en todas las relaciones
            foreach (var foreignKey in modelBuilder.Model.GetEntityTypes()
                         .SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }
    }
}
