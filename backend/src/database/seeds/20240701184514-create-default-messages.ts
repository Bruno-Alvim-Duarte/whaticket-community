import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    const messages = [];
    for (let i = 0; i < 60; i += 1) {
      messages.push({
        id: i + 1,
        body: `Mensagem ${i + 1}`,
        ack: 0,
        read: 1,
        fromMe: i % 2 === 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ticketId: 1,
        contactId: 1
      });
    }
    messages.push({
      id: 62,
      body: "Ménsagem 62",
      ack: 0,
      read: 1,
      fromMe: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ticketId: 1,
      contactId: 1
    });
    messages.push({
      id: 63,
      body: "Mé-nsagem 63",
      ack: 0,
      read: 1,
      fromMe: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ticketId: 1,
      contactId: 1
    });
    return queryInterface.bulkInsert("Messages", messages);
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Messages", {});
  }
};
