exports.up = (knex, Promise) => {
  return knex.schema.table('sessions', (table) => {
    table.string('current_menu_action');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.table('sessions', (table) => {
    table.dropColumn('current_menu_action');
  });
};
