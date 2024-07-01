import { Op, fn, col, where } from "sequelize";
import Contact from "../../models/Contact";
import Message from "../../models/Message";
import User from "../../models/User";
import Ticket from "../../models/Ticket";

const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

type response = {
  messages: Message[];
  hasMore: boolean;
};

type parameters = {
  ticketId: number;
  pageNumber: number;
  q: string;
};

const listMessagesSearchedService = async (
  queryParameters: parameters
): Promise<response> => {
  const { ticketId, pageNumber, q } = queryParameters;
  const limit = 40;
  const offset = limit * (Number(pageNumber) - 1);
  const query = removeAccents(q).toLowerCase();

  const { count, rows: messages } = await Message.findAndCountAll({
    where: {
      [Op.and]: [
        { ticketId },
        {
          body: where(
            fn("normalize_text", col("body")),
            "LIKE",
            `%${query.trim()}%`
          )
        }
      ]
    },
    include: [
      { model: Contact, as: "contact", attributes: ["name"] },
      {
        model: Ticket,
        as: "ticket",
        attributes: [],
        include: [{ model: User, as: "user", attributes: ["name"] }]
      }
    ],
    attributes: [
      "id",
      "body",
      [fn("DATE_FORMAT", col("Message.createdAt"), "%d/%m/%Y"), "date"],
      [
        fn(
          "IF",
          col("Message.fromMe"),
          col("ticket.user.name"),
          col("contact.name")
        ),
        "name"
      ]
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });

  const hasMore = count > offset + messages.length;
  return { messages, hasMore };
};

export default listMessagesSearchedService;
