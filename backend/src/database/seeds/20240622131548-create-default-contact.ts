import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert("Contacts", [
      {
        id: 1,
        name: "Contato",
        email: "contato@gmail.com",
        number: "5531999999999",
        profilePicUrl:
          "https://pps.whatsapp.net/v/t61.24694-24/319739152_160270213439015_8392190432417842812_n.jpg?ccb=11-4&oh=01_Q5AaIE0hRwr2B4IxEf9_6ZQaidIxzOKTB_WezcihHY-HUl2Y&oe=667F6464&_nc_sid=e6ed6c&_nc_cat=101",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Contacts", {});
  }
};
