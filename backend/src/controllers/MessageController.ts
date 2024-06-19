import { Request, Response } from "express";

import { Op } from "sequelize";
import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import { getIO } from "../libs/socket";
import Message from "../models/Message";

import ListMessagesService from "../services/MessageServices/ListMessagesService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import DeleteWhatsAppMessage from "../services/WbotServices/DeleteWhatsAppMessage";
import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";
import Contact from "../models/Contact";
import User from "../models/User";

type IndexQuery = {
  pageNumber: string;
};

type MessageData = {
  body: string;
  fromMe: boolean;
  read: boolean;
  quotedMsg?: Message;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { pageNumber } = req.query as IndexQuery;

  const { count, messages, ticket, hasMore } = await ListMessagesService({
    pageNumber,
    ticketId
  });

  SetTicketMessagesAsRead(ticket);

  return res.json({ count, messages, ticket, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { body, quotedMsg }: MessageData = req.body;
  const medias = req.files as Express.Multer.File[];

  const ticket = await ShowTicketService(ticketId);

  SetTicketMessagesAsRead(ticket);

  if (medias) {
    await Promise.all(
      medias.map(async (media: Express.Multer.File) => {
        await SendWhatsAppMedia({ media, ticket });
      })
    );
  } else {
    await SendWhatsAppMessage({ body, ticket, quotedMsg });
  }

  return res.send();
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId } = req.params;

  const message = await DeleteWhatsAppMessage(messageId);

  const io = getIO();
  io.to(message.ticketId.toString()).emit("appMessage", {
    action: "update",
    message
  });

  return res.send();
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { q } = req.query;
  const { ticketId } = req.params;
  console.log("TicketId: ", ticketId);
  console.log("Query: ", q);

  const messages = await Message.findAll({
    where: {
      [Op.and]: [
        { ticketId },
        { body: { [Op.regexp]: `(?i)[[:<:]][a-zA-Z]*${q}[a-zA-Z]*[[:>:]]` } }
      ]
    },
    include: [{ model: Contact, as: "contact", attributes: ["name"] }]
  });

  const user = await User.findByPk(req.user.id);

  console.log("messages: ", messages);
  const result = messages.map(message => ({
    id: message.id,
    body: message.body,
    name: message.fromMe ? user?.name : message.contact.name,
    date: message.createdAt.toLocaleDateString("pt-BR")
  }));

  return res.json(result);
};
