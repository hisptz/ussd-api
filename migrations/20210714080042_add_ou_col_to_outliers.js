exports.up = (knex, Promise) => {
  return knex.schema.table('dataset_outliers', (table) => {
    table.string('orgUnit');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.table('dataset_outliers', (table) => {
    table.dropColumn('orgUnit');
  });
};
