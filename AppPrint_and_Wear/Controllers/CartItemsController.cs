﻿using System;
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
    public class CartItemsController : Controller
    {
        private readonly ApplicationDBContext _context;

        public CartItemsController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: CartItems
        public async Task<IActionResult> Index()
        {
            var applicationDBContext = _context.CartItems.Include(c => c.Productos);
            return View(await applicationDBContext.ToListAsync());
        }

        // GET: CartItems/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var cartItem = await _context.CartItems
                .Include(c => c.Productos)
                .FirstOrDefaultAsync(m => m.CartItemId == id);

            if (cartItem == null) return NotFound();

            return View(cartItem);
        }

        // GET: CartItems/Create
        public IActionResult Create()
        {
            // Mostrar solo productos con stock > 0
            var productosDisponibles = _context.Productos
                .Where(p => p.Stock > 0)
                .ToList();

            ViewData["ProductoId"] = new SelectList(productosDisponibles, "ProductoId", "Descripcion");
            return View();
        }

        // POST: CartItems/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CartItemId,Cantidad,Carrito_De_Compra_Id,ProductoId")] CartItem cartItem)
        {
            if (!ModelState.IsValid) return View(cartItem);

            var producto = await _context.Productos.FindAsync(cartItem.ProductoId);
            if (producto == null)
            {
                ModelState.AddModelError("", "Producto no encontrado.");
                return View(cartItem);
            }

            if (producto.Stock <= 0)
            {
                ModelState.AddModelError("", "No hay stock disponible para este producto.");
                return View(cartItem);
            }

            if (cartItem.Cantidad > producto.Stock)
            {
                ModelState.AddModelError("", $"No hay suficiente stock. Stock disponible: {producto.Stock}");
                return View(cartItem);
            }

            // Calcular subtotal automáticamente antes de guardar
            cartItem.SubTotal = cartItem.Cantidad * producto.Precio;

            _context.Add(cartItem);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // GET: CartItems/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) return NotFound();

            // Mostrar solo productos con stock > 0
            var productosDisponibles = _context.Productos
                .Where(p => p.Stock > 0)
                .ToList();

            ViewData["ProductoId"] = new SelectList(productosDisponibles, "ProductoId", "Descripcion", cartItem.ProductoId);
            return View(cartItem);
        }

        // POST: CartItems/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CartItemId,Cantidad,Carrito_De_Compra_Id,ProductoId")] CartItem cartItem)
        {
            if (id != cartItem.CartItemId) return NotFound();

            var producto = await _context.Productos.FindAsync(cartItem.ProductoId);
            if (producto == null)
            {
                ModelState.AddModelError("", "Producto no encontrado.");
                return View(cartItem);
            }

            if (producto.Stock <= 0)
            {
                ModelState.AddModelError("", "No hay stock disponible para este producto.");
                return View(cartItem);
            }

            if (cartItem.Cantidad > producto.Stock)
            {
                ModelState.AddModelError("", $"No hay suficiente stock. Stock disponible: {producto.Stock}");
                return View(cartItem);
            }

            // Calcular subtotal automáticamente antes de actualizar
            cartItem.SubTotal = cartItem.Cantidad * producto.Precio;

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(cartItem);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CartItemExists(cartItem.CartItemId)) return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }

            return View(cartItem);
        }

        // GET: CartItems/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var cartItem = await _context.CartItems
                .Include(c => c.Productos)
                .FirstOrDefaultAsync(m => m.CartItemId == id);

            if (cartItem == null) return NotFound();

            return View(cartItem);
        }

        // POST: CartItems/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem != null)
            {
                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool CartItemExists(int id)
        {
            return _context.CartItems.Any(e => e.CartItemId == id);
        }
    }
}
