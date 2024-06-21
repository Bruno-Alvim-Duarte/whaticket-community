import { Op, literal } from "sequelize";
import Contact from "../../models/Contact";
import Message from "../../models/Message";
import User from "../../models/User";

const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

type response = {
  messages: {
    id: string;
    body: string;
    name?: string;
    date: string;
  }[];

  hasMore: boolean;
};

const listMessagesSearchedService = async (
  ticketId: string,
  pageNumber: string,
  q: string,
  userId: string
): Promise<response> => {
  const limit = 40;
  const offset = limit * (Number(pageNumber) - 1);
  const query = removeAccents(q as string).toLowerCase();

  const { count, rows: messages } = await Message.findAndCountAll({
    where: {
      [Op.and]: [
        { ticketId },
        literal(
          `normalize_text(body) REGEXP '[[:<:]][a-zA-Z]*${query}[a-zA-Z]*[[:>:]]'`
        )
      ]
    },
    include: [{ model: Contact, as: "contact", attributes: ["name"] }],
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });

  const user = await User.findByPk(userId);

  const result = messages.map(message => ({
    id: message.id,
    body: message.body,
    name: message.fromMe ? user?.name : message.contact.name,
    date: message.createdAt.toLocaleDateString("pt-BR")
  }));

  const hasMore = count > offset + messages.length;
  return { messages: result, hasMore };
};

export default listMessagesSearchedService;
