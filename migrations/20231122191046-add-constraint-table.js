'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */await queryInterface.addConstraint('Products', {
    fields: ['CategoryId'],
    type: 'foreign key',
    name: 'fk_Products_CategoryId_Categories_id',
    references: {
      table: 'Categories',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

    await queryInterface.addConstraint("TransactionHistories", {
      fields: ["ProductId"],
      type: "foreign key",
      name: "products_id_fk",
      references: {
        table: "Products",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"

    })
    await queryInterface.addConstraint("TransactionHistories", {
      fields: ["UserId"],
      type: "foreign key",
      name: "users_id_fk",
      references: {
        table: "Users",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    })

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     *
     */
    await queryInterface.removeConstraint("Product", "categories_id_fk");
    await queryInterface.removeConstraint("TransactionHistories", "products_id_fk");
    await queryInterface.removeConstraint("TransactionHistories", "users_id_fk");
    await queryInterface.dropTable("TransactionHistories");
    await queryInterface.dropTable("Products");
    await queryInterface.dropTable("Users");
    await queryInterface.dropTable("Categories");

  }
};