import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import BotChatView from "./components/BotChatView";
import ProfileView from "./components/ProfileView";
import QuestView from "./components/QuestView";
import { botConversations, botReplies, initialBotMessages, quests } from "./data/gameData";
import { ChatMessage, Empty } from "./generated/chat_pb";
import { client } from "./grpc/client";
import type { Bot, BotMessage, View } from "./types/game";
import "./styles.css";

type Message = {
  user: string;
  text: string;
  timestamp: string;
};

function toMessage(value: ChatMessage): Message {
  return {
    user: value.getUser(),
    text: value.getText(),
    timestamp: value.getTimestamp(),
  };
}

export default function App() {
  const [name, setName] = useState("Dylserker");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<View>("discussion");
  const [selectedBot, setSelectedBot] = useState<Bot>(botConversations[0]);
  const [botMessages, setBotMessages] = useState<Record<string, BotMessage[]>>(initialBotMessages);

  const loadHistory = () => {
    setError("");
    const stream = client.history(new Empty(), {});
    setConnected(true);
    const received: Message[] = [];
    stream.on("data", (value: ChatMessage) => {
      received.push(toMessage(value));
      setMessages([...received]);
    });
    stream.on("error", (value: Error) => {
      setConnected(false);
      setError(`Impossible de charger l'historique : ${value.message}`);
    });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const request = new ChatMessage()
      .setUser(name.trim())
      .setText(text.trim())
      .setTimestamp(new Date().toISOString());

    setError("");
    client.sendMessage(request, {}, (rpcError, response) => {
      if (rpcError) {
        setError(`${rpcError.code} : ${rpcError.message}`);
        return;
      }
      if (response) {
        setMessages((current) => [...current, toMessage(response)]);
      }
    });
    setText("");
  };

  const sendBotMessage = (event: FormEvent) => {
    event.preventDefault();
    const message = text.trim();
    if (!message) return;

    const now = new Date();
    const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setBotMessages((current) => ({ ...current, [selectedBot.name]: [...current[selectedBot.name], { text: message, mine: true, time }] }));
    setText("");

    window.setTimeout(() => {
      const replies = botReplies[selectedBot.name];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setBotMessages((current) => ({ ...current, [selectedBot.name]: [...current[selectedBot.name], { text: reply, mine: false, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }] }));
    }, 900);
  };

  const navigation = [
    { id: "discussion" as View, icon: "⌁", label: "Discussion", count: messages.length },
    { id: "quests" as View, icon: "◇", label: "Quêtes", count: quests.filter((quest) => quest.status !== "Terminée").length },
    { id: "inventory" as View, icon: "♢", label: "Inventaire" },
    { id: "members" as View, icon: "♙", label: "Membres", count: 8 },
    { id: "almanax" as View, icon: "◈", label: "Almanax" },
  ];

  const renderPlaceholder = () => <section className="placeholder-view"><span>◈</span><p className="eyebrow">Grimoire de Dylserker</p><h1>{navigation.find((item) => item.id === view)?.label}</h1><p>Cette page du grimoire arrive bientôt. Les compagnons gardent déjà une place pour toi.</p><button type="button" onClick={() => setView("quests")}>Voir les quêtes <span>→</span></button></section>;

  return (
    <main className="world-shell">
      <aside className="sidebar">
        <div className="brand-mark"><span className="brand-orb">✦</span><div><strong>Le Zaap</strong><small>canal de guilde</small></div></div>
        <button className="character-card" type="button" onClick={() => setView("profile")}><div className="avatar">D</div><div><strong>{name || "Aventurier"}</strong><span>Sacrieur · niveau oméga 102</span></div><span className="online-dot" /></button>
        <nav className="nav-list" aria-label="Navigation principale">
          <p className="nav-label">Mon grimoire</p>
          {navigation.slice(0, 3).map((item) => <button className={`nav-item ${view === item.id ? "active" : ""}`} type="button" key={item.id} onClick={() => setView(item.id)}><span>{item.icon}</span> {item.label} {item.count !== undefined && <b>{item.count}</b>}</button>)}
          <p className="nav-label">La guilde</p>
          {navigation.slice(3).map((item) => <button className={`nav-item ${view === item.id ? "active" : ""}`} type="button" key={item.id} onClick={() => setView(item.id)}><span>{item.icon}</span> {item.label} {item.count !== undefined && <b>{item.count}</b>}</button>)}
        </nav>
        <div className="sidebar-footer"><span className={connected ? "status online" : "status"}><i /> {connected ? "Serveur connecté" : "Connexion en cours"}</span><small>Amakna · 12:42</small></div>
      </aside>

      <section className="content-area">
        <header className="topbar"><div className="breadcrumb"><span>Monde des Douze</span><b>/</b><strong>{view === "profile" ? "Profil de Dylserker" : "Canal de guilde"}</strong></div><div className="top-actions"><span className="kama">◈ 12 480</span><button className="icon-button" type="button" aria-label="Notifications">♧<i /></button><button className="mini-avatar" type="button" aria-label="Ouvrir le profil de Dylserker" onClick={() => setView("profile")}>D</button></div></header>
        <div className="content-grid">
          {view === "quests" ? <QuestView onInvite={() => setView("discussion")} /> : view === "members" ? <BotChatView selectedBot={selectedBot} botMessages={botMessages} message={text} onSelectBot={setSelectedBot} onMessageChange={setText} onSend={sendBotMessage} /> : view === "profile" ? <ProfileView onBack={() => setView("discussion")} /> : view === "discussion" ? <section className="chat-column">
            <div className="page-heading"><div><p className="eyebrow">La taverne du Chabrulé</p><h1>Parchemins de la guilde</h1></div><button className="refresh-button" onClick={loadHistory} type="button"><span>↻</span> Actualiser</button></div>
            <div className="quest-strip"><span className="quest-icon">☼</span><div><small>QUÊTE ACTIVE · OBJECTIF DE GROUPE</small><strong>Réunir les aventuriers à la taverne</strong></div><span className="quest-progress">{messages.length}/12</span></div>
            <div className="chat-panel">
              <div className="chat-panel-head"><div><span className="channel-pip" /><strong># général</strong><small> · conversations de la guilde</small></div><span className="member-count">♙ 8 en ligne</span></div>
              <div className="messages" aria-live="polite">
                {messages.length === 0 ? <div className="empty"><span>☾</span><strong>Le canal est silencieux</strong><p>Pose le premier message et fais sonner la cloche de guilde.</p></div> : messages.map((message, index) => <article className="message" key={`${message.timestamp}-${index}`}><div className="message-avatar">{message.user.slice(0, 1).toUpperCase()}</div><div className="message-body"><div className="message-meta"><strong>{message.user}</strong><span className="role">aventurier</span><time>{new Date(message.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</time></div><p>{message.text}</p></div></article>)}
              </div>
              <form className="composer" onSubmit={send}><div className="composer-avatar">{name.slice(0, 1).toUpperCase() || "?"}</div><div className="composer-input"><input aria-label="Ton message" value={text} onChange={(event) => setText(event.target.value)} placeholder="Écrire un parchemin..." /><span>Entrée pour envoyer · Shift + Entrée pour une nouvelle ligne</span></div><button className="send" type="submit" aria-label="Envoyer le message" disabled={!connected || !name.trim() || !text.trim()}>➤</button></form>
              <label className="name-field">Identité <input value={name} onChange={(event) => setName(event.target.value)} /></label>
              {error && <p className="error">{error}</p>}
            </div>
          </section> : renderPlaceholder()}
          <aside className="right-rail">
            <div className="rail-card map-card"><div className="map-lines" /><p className="eyebrow">Carte du monde</p><h2>Le territoire<br /><em>d’Amakna</em></h2><div className="map-pin">✦</div><span className="map-caption">Position actuelle<br /><strong>Zaap du village</strong></span></div>
            <div className="rail-card members-card"><div className="rail-title"><h3>Compagnons</h3><span>8 / 12</span></div><div className="member-list"><div><span className="member-avatar amber">A</span><p><strong>Abyssal</strong><small>En combat</small></p><i /></div><div><span className="member-avatar teal">L</span><p><strong>Loupiotte</strong><small>Au zaap</small></p><i /></div><div><span className="member-avatar rose">N</span><p><strong>Nox-Arcana</strong><small>En donjon</small></p><i /></div></div><button className="all-members" type="button">Voir tous les membres <span>→</span></button></div>
            <div className="quote-card"><span>❝</span><p>Le courage n’est pas l’absence de peur, c’est avancer malgré les Chafers.</p><small>— Proverbe d’Amakna</small></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
