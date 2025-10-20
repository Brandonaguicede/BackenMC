using AppPrint_and_Wear.Data;
using AppPrint_and_Wear.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace AppPrint_and_Wear.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDBContext _context; // <-- agrega esto

        public HomeController(ILogger<HomeController> logger, ApplicationDBContext context)
        {
            _logger = logger;
            _context = context; // <-- inicializa el contexto
        }
        public IActionResult Index()
        {
            return View();
        }
      


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }


        public IActionResult Diseno(int productoId)
        {
            var producto = _context.Productos.FirstOrDefault(p => p.ProductoId == productoId);
            return View(producto);
        }



    }
}
