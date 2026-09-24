from pathlib import Path
import subprocess

root = Path(__file__).resolve().parent.parent
subprocess.run(
    [
        str(root / ".venv/bin/python"),
        "-m",
        "grpc_tools.protoc",
        "--proto_path=protos",
        "--python_out=generated",
        "--grpc_python_out=generated",
        "protos/chat.proto",
    ],
    cwd=root,
    check=True,
)

stub = root / "generated/chat_pb2_grpc.py"
content = stub.read_text()
content = content.replace("import chat_pb2 as chat__pb2", "from . import chat_pb2 as chat__pb2")
stub.write_text(content)
