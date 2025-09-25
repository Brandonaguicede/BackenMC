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
    public class ClientesController : Controller
    {
        private readonly ApplicationDBContext _context;

        public ClientesController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: Clientes
        public async Task<IActionResult> Index()
        {
            return View(await _context.Clientes.ToListAsync());
        }

        // GET: Clientes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(m => m.ClienteId == id);
            if (cliente == null)
            {
                return NotFound();
            }

            return View(cliente);
        }

        // GET: Clientes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Clientes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        // POST: Clientes/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ClienteId,Carrito_De_Compra,Nombre,Apellidos,Contraseña,Telefono,Correo,Direccion,FechaNacimiento")] Cliente cliente)
        {
            if (ModelState.IsValid)
            {
                // Validar si ya existe un cliente con ese correo
                var existe = await _context.Clientes.AnyAsync(c => c.Correo == cliente.Correo);

                if (existe)
                {
                    TempData["MensajeError"] = "El correo ya está registrado. Por favor, inicie sesión.";
                    return RedirectToAction("Index", "Home");
                }

                // Si no existe, registramos al cliente
                _context.Add(cliente);
                await _context.SaveChangesAsync();

                TempData["MensajeExito"] = "¡Registro exitoso! Ahora inicia sesión.";
                return RedirectToAction("Index", "Home");
            }

            return View(cliente);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string correo, string contraseña)
        {
            if (string.IsNullOrEmpty(correo) || string.IsNullOrEmpty(contraseña))
            {
                return Json(new { success = false, message = "Por favor complete ambos campos." });
            }

            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Correo == correo);

            if (cliente == null)
                return Json(new { success = false, message = "El correo no está registrado. Por favor, regístrese." });

            if (cliente.Contraseña != contraseña)
                return Json(new { success = false, message = "Contraseña incorrecta." });

            // Aquí inicias sesión, ejemplo: 
            // await SignInAsync(cliente);

            return Json(new { success = true, message = $"¡Bienvenido, {cliente.Nombre}!" });
        }






        // GET: Clientes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }
            return View(cliente);
        }

        // POST: Clientes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ClienteId,Carrito_De_Compra,Nombre,Apellidos,Contraseña,Telefono,Correo,Direccion,FechaNacimiento")] Cliente cliente)
        {
            if (id != cliente.ClienteId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(cliente);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ClienteExists(cliente.ClienteId))
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
            return View(cliente);
        }

        // GET: Clientes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(m => m.ClienteId == id);
            if (cliente == null)
            {
                return NotFound();
            }

            return View(cliente);
        }

        // POST: Clientes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente != null)
            {
                _context.Clientes.Remove(cliente);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.ClienteId == id);
        }
    }
}
