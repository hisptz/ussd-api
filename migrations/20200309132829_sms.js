exports.up = function(knex, Promise) {
  return knex.schema.createTable('sms', table => {
    table.increments('sms_id').primary();
    table.string('text');
    table.string('status');
    table.json('phone_numbers');
    table.string('session_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sms');
};
