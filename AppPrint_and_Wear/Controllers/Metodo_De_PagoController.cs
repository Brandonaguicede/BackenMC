using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using AppPrint_and_Wear.Data;
using AppPrint_and_Wear.Models;

namespace AppPrint_and_Wear.Controllers
{
    public class Metodo_De_PagoController : Controller
    {
        private readonly ApplicationDBContext _context;

        public Metodo_De_PagoController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: Metodo_De_Pago
        public async Task<IActionResult> Index()
        {
            var applicationDBContext = _context.Metodo_De_Pagos.Include(m => m.Cliente);
            return View(await applicationDBContext.ToListAsync());
        }

        // GET: Metodo_De_Pago/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var metodo_De_Pago = await _context.Metodo_De_Pagos
                .Include(m => m.Cliente)
                .FirstOrDefaultAsync(m => m.Metodo_De_PagoId == id);
            if (metodo_De_Pago == null)
            {
                return NotFound();
            }

            return View(metodo_De_Pago);
        }

        // GET: Metodo_De_Pago/Create
        public IActionResult Create()
        {
            ViewData["ClienteId"] = new SelectList(_context.Clientes, "ClienteId", "Nombre");
            return View();
        }

        // POST: Metodo_De_Pago/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Metodo_De_PagoId,Nombre,Metodo_Tipo,Numero_Tarjeta,ExpirationDate,CVV,ClienteId")] Metodo_De_Pago metodo_De_Pago)
        {
            if (ModelState.IsValid)
            {
                _context.Add(metodo_De_Pago);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["ClienteId"] = new SelectList(_context.Clientes, "ClienteId", "ClienteId", metodo_De_Pago.ClienteId);
            return View(metodo_De_Pago);
        }

        // GET: Metodo_De_Pago/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var metodo_De_Pago = await _context.Metodo_De_Pagos.FindAsync(id);
            if (metodo_De_Pago == null)
            {
                return NotFound();
            }
            ViewData["ClienteId"] = new SelectList(_context.Clientes, "ClienteId", "ClienteId", metodo_De_Pago.ClienteId);
            return View(metodo_De_Pago);
        }

        // POST: Metodo_De_Pago/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Metodo_De_PagoId,Nombre,Metodo_Tipo,Numero_Tarjeta,ExpirationDate,CVV,ClienteId")] Metodo_De_Pago metodo_De_Pago)
        {
            if (id != metodo_De_Pago.Metodo_De_PagoId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(metodo_De_Pago);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!Metodo_De_PagoExists(metodo_De_Pago.Metodo_De_PagoId))
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
            ViewData["ClienteId"] = new SelectList(_context.Clientes, "ClienteId", "ClienteId", metodo_De_Pago.ClienteId);
            return View(metodo_De_Pago);
        }

        // GET: Metodo_De_Pago/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var metodo_De_Pago = await _context.Metodo_De_Pagos
                .Include(m => m.Cliente)
                .FirstOrDefaultAsync(m => m.Metodo_De_PagoId == id);
            if (metodo_De_Pago == null)
            {
                return NotFound();
            }

            return View(metodo_De_Pago);
        }

        // POST: Metodo_De_Pago/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var metodo_De_Pago = await _context.Metodo_De_Pagos.FindAsync(id);
            if (metodo_De_Pago != null)
            {
                _context.Metodo_De_Pagos.Remove(metodo_De_Pago);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool Metodo_De_PagoExists(int id)
        {
            return _context.Metodo_De_Pagos.Any(e => e.Metodo_De_PagoId == id);
        }
    }
}
