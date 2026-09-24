export type View = "discussion" | "quests" | "inventory" | "members" | "almanax" | "profile";

export type Quest = {
  title: string;
  description: string;
  reward: string;
  progress: string;
  status: "En cours" | "Disponible" | "Terminée";
  tone: string;
};

export type Bot = {
  name: string;
  role: string;
  avatar: string;
  tone: string;
  preview: string;
  time: string;
  unread: number;
  messages: string[];
};

export type BotMessage = {
  text: string;
  mine: boolean;
  time: string;
};
