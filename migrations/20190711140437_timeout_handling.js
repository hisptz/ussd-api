
exports.up = function(knex, Promise) {
    return knex.schema.table('sessions', table => {
        table.string('mssdn');
        table.datetime('started');
        table.boolean('done');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('sessions', table => {
        table.dropColumn('mssdn');
        table.dropColumn('started');
        table.dropColumn('done');
    });
};
