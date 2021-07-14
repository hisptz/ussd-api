exports.up = function(knex, Promise) {
    return knex.schema.createTable('dataset_outliers', table => {
      table.increments('id').primary();
      table.string('dataset');
      table.string('period');
      table.json('outliers').defaultTo('{}');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('dataset_outliers');
  };
  