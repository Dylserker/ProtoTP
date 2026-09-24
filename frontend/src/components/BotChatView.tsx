import type { FormEvent } from "react";
import { botConversations } from "../data/gameData";
import type { Bot, BotMessage } from "../types/game";

type BotChatViewProps = {
  selectedBot: Bot;
  botMessages: Record<string, BotMessage[]>;
  message: string;
  onSelectBot: (bot: Bot) => void;
  onMessageChange: (message: string) => void;
  onSend: (event: FormEvent) => void;
};

export default function BotChatView({ selectedBot, botMessages, message, onSelectBot, onMessageChange, onSend }: BotChatViewProps) {
  return (
    <section className="bots-view">
      <div className="page-heading"><div><p className="eyebrow">Messagerie privée</p><h1>Conversations de guilde</h1></div><span className="quest-total">3 compagnons disponibles</span></div>
      <div className="bot-layout"><div className="bot-list"><div className="bot-list-head"><strong>Compagnons</strong><span>EN LIGNE</span></div>{botConversations.map((bot) => <button className={`bot-preview ${selectedBot.name === bot.name ? "selected" : ""}`} type="button" key={bot.name} onClick={() => onSelectBot(bot)}><span className={`member-avatar ${bot.tone}`}>{bot.avatar}</span><span className="bot-preview-copy"><strong>{bot.name}</strong><small>{bot.role}</small><em>{bot.preview}</em></span><span className="bot-time">{bot.time}{bot.unread > 0 && <b>{bot.unread}</b>}</span></button>)}</div><article className="bot-chat"><header><span className={`member-avatar ${selectedBot.tone}`}>{selectedBot.avatar}</span><div><strong>{selectedBot.name}</strong><small>{selectedBot.role} · répond automatiquement</small></div><i /></header><div className="bot-messages">{botMessages[selectedBot.name].map((item, index) => <div className={`bot-bubble ${item.mine ? "mine" : ""}`} key={`${item.time}-${index}`}>{item.text}<time>{item.time}</time></div>)}</div><form className="bot-composer" onSubmit={onSend}><input value={message} onChange={(event) => onMessageChange(event.target.value)} placeholder={`Écrire à ${selectedBot.name}...`} /><button type="submit" aria-label="Envoyer">➤</button></form></article></div>
    </section>
  );
}
