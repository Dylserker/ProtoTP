import { appendFile } from "node:fs/promises";

await appendFile(
  new URL("../src/generated/chat_pb.js", import.meta.url),
  "\n// Exports statiques pour l'interop ES modules avec Vite.\nexports.ChatMessage = proto.chat.v1.ChatMessage;\nexports.Empty = proto.chat.v1.Empty;\n",
);
