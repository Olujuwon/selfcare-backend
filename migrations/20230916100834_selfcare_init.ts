import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('display_name');
      table.text('email').unique({ indexName: 'user_unique_email' });
      table.boolean('is_email_verified').notNullable().defaultTo(false);
      table.text('phone_number');
      table.text('photo_url');
      table.text('password');
      table.text('status').notNullable().defaultTo('active');
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now(6));
      table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now(6));
    })
    .createTable('tasks', function (table) {
      table.increments('id').primary();
      table.text('name');
      table.text('description');
      table.timestamp('schedule', { useTz: true }).defaultTo(knex.fn.now(6));
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now(6));
      table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now(6));
      table.string('status').notNullable().defaultTo('new');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    })
    .createTable('servicebearertokens', (table) => {
      table.increments('id').primary();
      table.json('token');
      table.integer('user_id').unsigned();
      table.string('status').notNullable().defaultTo('active');
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now(6));
      table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now(6));
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tasks', (table) => {
    table.dropForeign('user_id');
  });
  await knex.schema.alterTable('servicebearertokens', (table) => {
    table.dropForeign('user_id');
  });
  return knex.schema.dropTable('users').dropTable('tasks').dropTable('servicebearertokens');
}
