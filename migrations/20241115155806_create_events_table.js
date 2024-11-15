/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('events', (table) => {
      table.increments('id'); // Auto-Inkrement ID
      table.string('title', 255).notNullable(); // Titel
      table.datetime('start_date').notNullable(); // Startzeit
      table.datetime('end_date').notNullable(); // Endzeit
      table.string('location', 255); // Ort
      table.integer('organizer_id').unsigned(); // Organisator (optional)
      table.timestamps(true, true); // created_at, updated_at
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('events');
  };
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};