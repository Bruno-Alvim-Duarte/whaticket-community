import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert("Tickets", [
      {
        id: 1,
        status: "open",
        contactId: 1,
        userId: 1,
        whatsappId: 1,
        isGroup: 0,
        unreadMessages: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Tickets", {});
  }
};
