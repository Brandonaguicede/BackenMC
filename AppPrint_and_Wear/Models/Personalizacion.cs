using System.ComponentModel.DataAnnotations;

namespace AppPrint_and_Wear.Models
{
    public class Personalizacion
    {
        // ID principal
        public int Id { get; set; }

        // Relación con Camisa (si tienes una tabla de camisas)
       // public int? CamisaId { get; set; }

        // Propiedades básicas de personalización
        [Required(ErrorMessage = "Seleccione un color")]
        [Display(Name = "Color")]
        public string Color { get; set; }

        [Required(ErrorMessage = "Seleccione una talla")]
        [Display(Name = "Talla")]
        public string Talla { get; set; }

        [Required(ErrorMessage = "Seleccione un estilo")]
        [Display(Name = "Estilo")]
        public string Estilo { get; set; }

        // Estampado y personalización
        [StringLength(100, ErrorMessage = "El texto no puede exceder 100 caracteres")]
        [Display(Name = "Texto Personalizado")]
        public string TextoEstampado { get; set; }

        [Display(Name = "Imagen del Estampado")]
        public string ImagenEstampado { get; set; } // URL o ruta de la imagen

        [Display(Name = "Posición del Estampado")]
        public string PosicionEstampado { get; set; } // Frente, Espalda, Manga

        [Display(Name = "Tipo de Estampado")]
        public string TipoEstampado { get; set; } // Vinilo, Sublimación, Bordado

        // Cantidad y precio
        [Required(ErrorMessage = "Ingrese la cantidad")]
        [Range(1, 100, ErrorMessage = "La cantidad debe ser entre 1 y 100")]
        [Display(Name = "Cantidad")]
        public int Cantidad { get; set; } = 1;

        [Display(Name = "Precio Base")]
        public decimal PrecioBase { get; set; } = 25.00m;

        // Fecha de creación
        [Display(Name = "Fecha de Creación")]
        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        // Método para calcular el precio total
        public decimal CalcularPrecioTotal()
        {
            decimal precio = PrecioBase;

            // Agregar costo por texto personalizado
            if (!string.IsNullOrEmpty(TextoEstampado))
            {
                precio += 3.00m;
            }

            // Agregar costo por estampado según tipo
            if (!string.IsNullOrEmpty(TipoEstampado) && TipoEstampado != "ninguno")
            {
                switch (TipoEstampado.ToLower())
                {
                    case "vinilo":
                        precio += 5.00m;
                        break;
                    case "sublimacion":
                        precio += 5.00m;
                        break;
                    case "bordado":
                        precio += 8.00m;
                        break;
                }
            }

            // Agregar costo por imagen personalizada
            if (!string.IsNullOrEmpty(ImagenEstampado))
            {
                precio += 10.00m;
            }

            return precio * Cantidad;
        }

        // Método para obtener descripción completa
        public string ObtenerDescripcion()
        {
            return $"Camisa {Color} - Talla {Talla} - Estilo {Estilo}";
        }
    }
}