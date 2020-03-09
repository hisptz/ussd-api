exports.up = function(knex, Promise) {
  return knex.schema.createTable('menu', table => {
    table.increments('menu_id').primary();
    table.string('application_id');
    table.string('title');
    table.string('type');
    table.json('options');
    table.string('previous_menu');
    table.string('data_id');
    table.string('next_menu');
    table.string('data_type');
    table.string('data_name');
    table.string('auth_key');
    table.string('fail_message');
    table.string('retry_message');
    table.string('number_of_retries');
    table.string('submission_message');
    table.string('submit_data');
    table.json('p_rules');
    table.string('period_type');
    table.string('maximum_value');
    table.string('use_for_year');
    table.string('years_back');
    table.string('field_value_type');
    table.string('field_short_name');
    table.string('data_element');
    table.string('category_combo');
    table.string('data_set');
    table.string('program');
    table.string('program_stage:');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('menu');
};
