import { ChatServiceClient } from "../generated/ChatServiceClientPb";

export const client = new ChatServiceClient("http://localhost:8080", null, null);
