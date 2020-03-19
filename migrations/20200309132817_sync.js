exports.up = function(knex, Promise) {
  return knex.schema.createTable('sync', table => {
    table.increments('id').primary();
    table.string('syncserver_id');
    table.string('session_id');
    table.boolean('synced');
    table.integer('retries');
    table.boolean('notified');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sync');
};
