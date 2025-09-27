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
    public class Carrito_De_CompraController : Controller
    {
        private readonly ApplicationDBContext _context;

        public Carrito_De_CompraController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: Carrito_De_Compra
        public async Task<IActionResult> Index()
        {
            var applicationDBContext = _context.Carrito_De_Compras.Include(c => c.Cliente);
            return View(await applicationDBContext.ToListAsync());
        }

        // GET: Carrito_De_Compra/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var carrito_De_Compra = await _context.Carrito_De_Compras
                .Include(c => c.Cliente)
                .FirstOrDefaultAsync(m => m.Carrito_De_CompraId == id);
            if (carrito_De_Compra == null)
            {
                return NotFound();
            }

            return View(carrito_De_Compra);
        }

        // GET: Carrito_De_Compra/Create
        public IActionResult Create()
        {
            ViewData["ClienteId"] = new SelectList(_context.Clientes, "ClienteId", "ClienteId");
            return View();
        }

        // POST: Carrito_De_Compra/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Carrito_De_CompraId,Total,ClienteId")] Carrito_De_Compra carrito_De_Compra)
        {
            if (ModelState.IsValid)
            {
                _context.Add(carrito_De_Compra);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["ClienteId"] = new SelectList(_context.Clientes, "ClienteId", "ClienteId", carrito_De_Compra.ClienteId);
            return View(carrito_De_Compra);
        }

        // GET: Carrito_De_Compra/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var carrito_De_Compra = await _context.Carrito_De_Compras.FindAsync(id);
            if (carrito_De_Compra == null)
            {
                return NotFound();
            }
            ViewData["ClienteId"] = new SelectList(_context.Clientes, "ClienteId", "ClienteId", carrito_De_Compra.ClienteId);
            return View(carrito_De_Compra);
        }

        // POST: Carrito_De_Compra/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Carrito_De_CompraId,Total,ClienteId")] Carrito_De_Compra carrito_De_Compra)
        {
            if (id != carrito_De_Compra.Carrito_De_CompraId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(carrito_De_Compra);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!Carrito_De_CompraExists(carrito_De_Compra.Carrito_De_CompraId))
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
            ViewData["ClienteId"] = new SelectList(_context.Clientes, "ClienteId", "ClienteId", carrito_De_Compra.ClienteId);
            return View(carrito_De_Compra);
        }

        // GET: Carrito_De_Compra/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var carrito_De_Compra = await _context.Carrito_De_Compras
                .Include(c => c.Cliente)
                .FirstOrDefaultAsync(m => m.Carrito_De_CompraId == id);
            if (carrito_De_Compra == null)
            {
                return NotFound();
            }

            return View(carrito_De_Compra);
        }

        // POST: Carrito_De_Compra/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var carrito_De_Compra = await _context.Carrito_De_Compras.FindAsync(id);
            if (carrito_De_Compra != null)
            {
                _context.Carrito_De_Compras.Remove(carrito_De_Compra);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool Carrito_De_CompraExists(int id)
        {
            return _context.Carrito_De_Compras.Any(e => e.Carrito_De_CompraId == id);
        }
    }
}
