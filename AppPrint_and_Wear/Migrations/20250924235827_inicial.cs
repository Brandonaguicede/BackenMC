using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppPrint_and_Wear.Migrations
{
    /// <inheritdoc />
    public partial class inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Contraceña",
                table: "Clientes",
                newName: "Contraseña");

            migrationBuilder.RenameColumn(
                name: "Contraceña",
                table: "Administradores",
                newName: "Contraseña");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Contraseña",
                table: "Clientes",
                newName: "Contraceña");

            migrationBuilder.RenameColumn(
                name: "Contraseña",
                table: "Administradores",
                newName: "Contraceña");
        }
    }
}
