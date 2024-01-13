import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('tasks', function (table) {
      table.increments('id').primary();
      table.text('name');
      table.text('description');
      table.timestamp('schedule', { useTz: true }).defaultTo(knex.fn.now(6));
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now(6));
      table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now(6));
      table.string('status').notNullable().defaultTo('new');
      table.integer('user_id');
    })
    .createTable('servicebearertokens', (table) => {
      table.increments('id').primary();
      table.json('token');
      table.string('user_id');
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now(6));
      table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now(6));
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tasks').dropTable('servicebearertokens');
}
