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
    public class EnviosController : Controller
    {
        private readonly ApplicationDBContext _context;

        public EnviosController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: Envios
        public async Task<IActionResult> Index()
        {
            var applicationDBContext = _context.Envios.Include(e => e.Carrito);
            return View(await applicationDBContext.ToListAsync());
        }

        // GET: Envios/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var envio = await _context.Envios
                .Include(e => e.Carrito)
                .FirstOrDefaultAsync(m => m.EnvioId == id);
            if (envio == null)
            {
                return NotFound();
            }

            return View(envio);
        }

        // GET: Envios/Create
        public IActionResult Create()
        {
            ViewData["Carrito_De_CompraId"] = new SelectList(_context.Carrito_De_Compras, "Carrito_De_CompraId", "Carrito_De_CompraId");
            return View();
        }

        // POST: Envios/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("EnvioId,Direccion_De_Envio,ShippingDate,Tiempo_Estimado,Numero_De_Rastreo,Estado,Carrito_De_CompraId")] Envio envio)
        {
            if (ModelState.IsValid)
            {
                _context.Add(envio);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["Carrito_De_CompraId"] = new SelectList(_context.Carrito_De_Compras, "Carrito_De_CompraId", "Carrito_De_CompraId", envio.Carrito_De_CompraId);
            return View(envio);
        }

        // GET: Envios/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var envio = await _context.Envios.FindAsync(id);
            if (envio == null)
            {
                return NotFound();
            }
            ViewData["Carrito_De_CompraId"] = new SelectList(_context.Carrito_De_Compras, "Carrito_De_CompraId", "Carrito_De_CompraId", envio.Carrito_De_CompraId);
            return View(envio);
        }

        // POST: Envios/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("EnvioId,Direccion_De_Envio,ShippingDate,Tiempo_Estimado,Numero_De_Rastreo,Estado,Carrito_De_CompraId")] Envio envio)
        {
            if (id != envio.EnvioId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(envio);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EnvioExists(envio.EnvioId))
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
            ViewData["Carrito_De_CompraId"] = new SelectList(_context.Carrito_De_Compras, "Carrito_De_CompraId", "Carrito_De_CompraId", envio.Carrito_De_CompraId);
            return View(envio);
        }

        // GET: Envios/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var envio = await _context.Envios
                .Include(e => e.Carrito)
                .FirstOrDefaultAsync(m => m.EnvioId == id);
            if (envio == null)
            {
                return NotFound();
            }

            return View(envio);
        }

        // POST: Envios/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var envio = await _context.Envios.FindAsync(id);
            if (envio != null)
            {
                _context.Envios.Remove(envio);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EnvioExists(int id)
        {
            return _context.Envios.Any(e => e.EnvioId == id);
        }
    }
}
