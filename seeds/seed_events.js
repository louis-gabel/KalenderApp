/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Lösche bestehende Einträge
  await knex('events').del();

  // Füge Testdaten hinzu
  return knex('events').insert([
    {
      title: 'Node.js Seminar',
      start_date: new Date('2024-11-20T10:00:00Z'),
      end_date: new Date('2024-11-20T12:00:00Z'),
      location: 'Online',
      organizer_id: 1,
    },
    {
      title: 'MariaDB Grundlagen',
      start_date: new Date('2024-11-21T14:00:00Z'),
      end_date: new Date('2024-11-21T16:00:00Z'),
      location: 'Raum A101',
      organizer_id: 2,
    },
  ]);
};
