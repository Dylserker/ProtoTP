import { quests } from "../data/gameData";

export default function QuestView({ onInvite }: { onInvite: () => void }) {
  return (
    <section className="quests-view">
      <div className="page-heading"><div><p className="eyebrow">Tableau des missions</p><h1>Quêtes de la guilde</h1></div><span className="quest-total">3 missions actives</span></div>
      <div className="quest-banner"><div className="quest-banner-symbol">✦</div><div><small>PROCHAINE ÉTAPE</small><h2>Le banquet du Chabrulé</h2><p>Encore 5 compagnons à convaincre pour lancer la fête.</p></div><button type="button" onClick={onInvite}>Inviter la guilde <span>→</span></button></div>
      <div className="quest-grid">{quests.map((quest) => <article className={`quest-card ${quest.tone}`} key={quest.title}><div className="quest-card-top"><span className="quest-card-icon">{quest.status === "Terminée" ? "✓" : "✦"}</span><span className="quest-status">{quest.status}</span></div><h3>{quest.title}</h3><p>{quest.description}</p><div className="quest-card-foot"><span>{quest.reward}</span><strong>{quest.progress}</strong></div>{quest.status !== "Terminée" && <div className="quest-bar"><i style={{ width: quest.status === "Disponible" ? "0%" : quest.title.startsWith("Le banquet") ? "58%" : "30%" }} /></div>}</article>)}</div>
    </section>
  );
}
