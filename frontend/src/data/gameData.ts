import type { Bot, BotMessage, Quest } from "../types/game";

export const quests: Quest[] = [
  { title: "Le banquet du Chabrulé", description: "Réunir la guilde autour d'un festin avant la tombée de la nuit.", reward: "1 200 kamas · titre Festoyeur", progress: "7 / 12 aventuriers", status: "En cours", tone: "gold" },
  { title: "Les plumes du Kwak", description: "Rapporter des plumes colorées pour restaurer la bannière de Dylserker.", reward: "Cape du Vent · 450 XP", progress: "3 / 10 plumes", status: "En cours", tone: "teal" },
  { title: "Le message du maître Pandawa", description: "Décoder le parchemin reçu depuis les brumes de Pandala.", reward: "Accès à la salle secrète", progress: "À commencer", status: "Disponible", tone: "rose" },
  { title: "Nettoyage du zaap", description: "Chasser les Chafers qui bloquent le passage vers le village.", reward: "900 kamas · 2 potions", progress: "Objectif atteint", status: "Terminée", tone: "stone" },
];

export const botConversations: Bot[] = [
  { name: "Abyssal", role: "Bot · maître du donjon", avatar: "A", tone: "amber", preview: "Le chemin est libre, Dylserker. On part quand tu veux.", time: "12:41", unread: 2, messages: ["Le chemin est libre, Dylserker. On part quand tu veux.", "J'ai repéré une salle secrète derrière les statues."] },
  { name: "Loupiotte", role: "Bot · alchimiste", avatar: "L", tone: "teal", preview: "J'ai préparé quelques potions pour la quête.", time: "12:28", unread: 0, messages: ["J'ai préparé quelques potions pour la quête.", "Les fleurs de lin sont encore fraîches, profite-en."] },
  { name: "Nox-Arcana", role: "Bot · archiviste", avatar: "N", tone: "rose", preview: "Le parchemin parle d'un ancien passage.", time: "11:56", unread: 1, messages: ["Le parchemin parle d'un ancien passage.", "Je peux traduire les runes si tu me rejoins à la bibliothèque."] },
];

export const botReplies: Record<string, string[]> = {
  Abyssal: ["Je note ça dans le plan du donjon.", "Parfait, je prépare les clés et je te rejoins au zaap.", "Avec ton Sacrieur, cette salle ne va pas tenir longtemps."],
  Loupiotte: ["Je peux préparer une potion pour ça.", "Bonne idée. J'ajoute quelques fleurs de lin à la liste.", "Reviens vers moi quand tu seras prêt pour le mélange."],
  "Nox-Arcana": ["Je vais consulter les archives de la guilde.", "Cette phrase ressemble à une ancienne énigme de Pandala.", "Je crois avoir trouvé une piste dans le grimoire poussiéreux."],
};

export function initialBotMessages(): Record<string, BotMessage[]> {
  return Object.fromEntries(botConversations.map((bot) => [bot.name, bot.messages.map((text, index) => ({ text, mine: index % 2 === 1, time: index === 0 ? "12:41" : "12:42" }))]));
}
