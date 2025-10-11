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
    public class PersonalizacionsController : Controller
    {
        private readonly ApplicationDBContext _context;

        public PersonalizacionsController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: Personalizacions - Página principal de personalización
        public async Task<IActionResult> Index()
        {
            // Esta será la página donde el usuario personaliza su camisa
            // No mostramos la lista, sino el formulario de personalización
            return View();
        }

        // POST: Personalizacions/GuardarPersonalizacion - Guardar la personalización
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GuardarPersonalizacion([Bind("CamisaId,TextoEstampado,ImagenEstampado,PosicionEstampado,Color,Talla,Estilo,TipoEstampado,Cantidad")] Personalizacion personalizacion)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Add(personalizacion);
                    await _context.SaveChangesAsync();

                    // Guardar datos en TempData para mostrar en confirmación
                    TempData["Mensaje"] = "¡Personalización guardada exitosamente!";
                    TempData["PersonalizacionId"] = personalizacion.Id;

                    return RedirectToAction(nameof(Confirmacion), new { id = personalizacion.Id });
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Error al guardar la personalización: " + ex.Message);
                }
            }

            // Si hay errores, volver a la página de personalización
            return View("Index", personalizacion);
        }

        // GET: Personalizacions/Confirmacion/5 - Página de confirmación
        public async Task<IActionResult> Confirmacion(int? id)
        {
            if (id == null)
            {
                return RedirectToAction(nameof(Index));
            }

            var personalizacion = await _context.Personalizaciones
                .FirstOrDefaultAsync(m => m.Id == id);

            if (personalizacion == null)
            {
                return RedirectToAction(nameof(Index));
            }

            return View(personalizacion);
        }

        // GET: Personalizacions/MisPersonalizaciones - Ver todas las personalizaciones del usuario
        public async Task<IActionResult> MisPersonalizaciones()
        {
            var personalizaciones = await _context.Personalizaciones.ToListAsync();
            return View(personalizaciones);
        }

        // GET: Personalizacions/Details/5 - Ver detalles de una personalización
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var personalizacion = await _context.Personalizaciones
                .FirstOrDefaultAsync(m => m.Id == id);

            if (personalizacion == null)
            {
                return NotFound();
            }

            return View(personalizacion);
        }

        // GET: Personalizacions/Edit/5 - Editar una personalización existente
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var personalizacion = await _context.Personalizaciones.FindAsync(id);
            if (personalizacion == null)
            {
                return NotFound();
            }
            return View(personalizacion);
        }

        // POST: Personalizacions/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,CamisaId,TextoEstampado,ImagenEstampado,PosicionEstampado,Color,Talla,Estilo,TipoEstampado,Cantidad")] Personalizacion personalizacion)
        {
            if (id != personalizacion.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(personalizacion);
                    await _context.SaveChangesAsync();

                    TempData["Mensaje"] = "Personalización actualizada exitosamente";
                    return RedirectToAction(nameof(MisPersonalizaciones));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PersonalizacionExists(personalizacion.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return View(personalizacion);
        }

        // GET: Personalizacions/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var personalizacion = await _context.Personalizaciones
                .FirstOrDefaultAsync(m => m.Id == id);

            if (personalizacion == null)
            {
                return NotFound();
            }

            return View(personalizacion);
        }

        // POST: Personalizacions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var personalizacion = await _context.Personalizaciones.FindAsync(id);
            if (personalizacion != null)
            {
                _context.Personalizaciones.Remove(personalizacion);
                await _context.SaveChangesAsync();

                TempData["Mensaje"] = "Personalización eliminada exitosamente";
            }

            return RedirectToAction(nameof(MisPersonalizaciones));
        }

        private bool PersonalizacionExists(int id)
        {
            return _context.Personalizaciones.Any(e => e.Id == id);
        }
    }
}