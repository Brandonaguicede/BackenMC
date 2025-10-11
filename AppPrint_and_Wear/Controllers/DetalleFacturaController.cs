using AppPrint_and_Wear.Data;
using AppPrint_and_Wear.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace AppPrint_and_Wear.Controllers
{
    public class DetalleFacturaController : Controller
    {
        private readonly ApplicationDBContext _context;

        public DetalleFacturaController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: DetalleFactura
        public async Task<IActionResult> Index()
        {
            var applicationDBContext = _context.DetalleFacturas.Include(d => d.Factura);
            return View(await applicationDBContext.ToListAsync());
        }

        // GET: DetalleFactura/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var detalleFactura = await _context.DetalleFacturas
                .Include(d => d.Factura)
                .FirstOrDefaultAsync(m => m.DetalleFacturaId == id);
            if (detalleFactura == null)
            {
                return NotFound();
            }

            return View(detalleFactura);
        }

        // GET: DetalleFactura/Create
        public IActionResult Create()
        {
            ViewData["FacturaId"] = new SelectList(_context.Facturas, "FacturaId", "FacturaId");
            return View();
        }

        // POST: DetalleFactura/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("DetalleFacturaId,Nombre,Cantidad,PrecioUnitario,Subtotal,FacturaId,ProductoId")] DetalleFactura detalleFactura)
        {
            if (ModelState.IsValid)
            {
                _context.Add(detalleFactura);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["FacturaId"] = new SelectList(_context.Facturas, "FacturaId", "FacturaId", detalleFactura.FacturaId);
            return View(detalleFactura);
        }

        // GET: DetalleFactura/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var detalleFactura = await _context.DetalleFacturas.FindAsync(id);
            if (detalleFactura == null)
            {
                return NotFound();
            }
            ViewData["FacturaId"] = new SelectList(_context.Facturas, "FacturaId", "FacturaId", detalleFactura.FacturaId);
            return View(detalleFactura);
        }

        // POST: DetalleFactura/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("DetalleFacturaId,Nombre,Cantidad,PrecioUnitario,Subtotal,FacturaId,ProductoId")] DetalleFactura detalleFactura)
        {
            if (id != detalleFactura.DetalleFacturaId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(detalleFactura);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DetalleFacturaExists(detalleFactura.DetalleFacturaId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["FacturaId"] = new SelectList(_context.Facturas, "FacturaId", "FacturaId", detalleFactura.FacturaId);
            return View(detalleFactura);
        }

        // GET: DetalleFactura/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var detalleFactura = await _context.DetalleFacturas
                .Include(d => d.Factura)
                .FirstOrDefaultAsync(m => m.DetalleFacturaId == id);
            if (detalleFactura == null)
            {
                return NotFound();
            }

            return View(detalleFactura);
        }

        // POST: DetalleFactura/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var detalleFactura = await _context.DetalleFacturas.FindAsync(id);
            if (detalleFactura != null)
            {
                _context.DetalleFacturas.Remove(detalleFactura);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool DetalleFacturaExists(int id)
        {
            return _context.DetalleFacturas.Any(e => e.DetalleFacturaId == id);
        }
    }
}
