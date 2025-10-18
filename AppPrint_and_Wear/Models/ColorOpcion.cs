using System.ComponentModel.DataAnnotations;

namespace AppPrint_and_Wear.Models
{
    public class ColorOpcion
    {
        public int ColorOpcionId {  get; set; }

        [Required]
        public string Hex { get; set; } = string.Empty;  // Ejemplo: "#FFFFFF"

        [Required]
        [Display(Name = "Imagen Frontal")]
        public string ImagenFrente { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Imagen Posterior")]
        public string ImagenEspalda { get; set; } = string.Empty;
    }
}
