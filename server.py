from concurrent import futures
from datetime import datetime, timezone
import threading

import grpc

from generated import chat_pb2, chat_pb2_grpc


class ChatService(chat_pb2_grpc.ChatServiceServicer):
    def __init__(self) -> None:
        self._messages: list[chat_pb2.ChatMessage] = []
        self._lock = threading.Lock()

    def SendMessage(self, request, context):
        if not request.user.strip():
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Le nom est obligatoire")
        if not request.text.strip():
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Le message est vide")

        message = chat_pb2.ChatMessage(
            user=request.user.strip(),
            text=request.text.strip(),
            timestamp=request.timestamp or datetime.now(timezone.utc).isoformat(),
        )
        with self._lock:
            self._messages.append(message)
        return message

    def History(self, request, context):
        with self._lock:
            messages = list(self._messages)
        yield from messages


def serve() -> None:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    chat_pb2_grpc.add_ChatServiceServicer_to_server(ChatService(), server)
    server.add_insecure_port("[::]:50052")
    server.start()
    print("Serveur gRPC en ecoute sur localhost:50052")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
