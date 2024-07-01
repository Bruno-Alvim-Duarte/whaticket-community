import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert("Whatsapps", [
      {
        id: 1,
        status: "qrcode",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "bruno",
        isDefault: 1,
        retries: 0
      }
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Whatsapps", {});
  }
};
