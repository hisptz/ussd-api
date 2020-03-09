exports.up = function(knex, Promise) {
  return knex.schema.createTable('sync_server', table => {
    table.increments('id').primary();
    table.string('application_id');
    table.string('url');
    table.string('username');
    table.string('password');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sync_server');
};
