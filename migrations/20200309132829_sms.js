exports.up = function(knex, Promise) {
  return knex.schema.createTable('sms', table => {
    table.increments('sms_id').primary();
    table.string('text');
    table.string('status');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sms');
};
