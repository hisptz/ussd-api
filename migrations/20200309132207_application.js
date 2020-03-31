exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('application', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('update_date');
      table.string('description');
      table.string('session_key');
      table.string('user_response');
      table.string('datastore_key');
      table.string('key');
      table.string('first_request');
      table.string('continue_request');
      table.string('terminated_by_provider');
      table.string('timed_out');
      table.string('phone_number_key');
      table.string('no_user_message');
      table.string('starting_menu');
      table.text('sync_servers');
      table.string('auth_based_on');
      table.json('session_timeout_determinant');
      table.text('phone_number_mapping');
      table.text('auto_generated_field');
    }),
    knex.schema.table('sessions', table => {
      table.string('application_id');
      table.string('msisdn');
      table.boolean('done');
      table.datetime('started');
    }),
    knex.schema.table('datavalues', table => {
      table.string('data_set');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('application'),

    knex.schema.table('sessions', table => {
      table.dropColumn('application_id');
      table.dropColumn('done');
      table.dropColumn('started');
      table.dropColumn('msisdn');
    }),
    knex.schema.table('datavalues', table => {
      table.dropColumn('data_set');
    })
  ]);
};
