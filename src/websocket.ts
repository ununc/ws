import WebSocket from "ws";
import { WebSocketMessage, ExtWebSocket } from "./types";
import { StateManager } from "./stateManager";

export class WebSocketServer {
  private readonly wss: WebSocket.Server;
  private readonly clients: Set<ExtWebSocket> = new Set();
  private readonly stateManager: StateManager;
  private readonly heartbeatInterval: NodeJS.Timeout;

  constructor(server: any) {
    this.wss = new WebSocket.Server({
      server,
      clientTracking: true,
    });

    this.stateManager = new StateManager();
    this.heartbeatInterval = setInterval(() => {
      this.checkConnections();
    }, 30000);
  }

  private checkConnections() {
    this.clients.forEach((client) => {
      if (!client.isAlive) {
        this.clients.delete(client);
        return client.terminate();
      }

      client.isAlive = false;
      client.ping();
    });
  }

  public async initialize(): Promise<void> {
    await this.stateManager.initialize();

    this.wss.on("connection", async (ws: WebSocket) => {
      const extWs = ws as ExtWebSocket;
      console.log("New client connected");

      extWs.isAlive = true;
      this.clients.add(extWs);

      // 현재 상태 전송
      const currentState = this.stateManager.getState();
      extWs.send(
        JSON.stringify({
          type: "INIT_STATE",
          state: currentState,
        })
      );

      extWs.on("pong", () => {
        extWs.isAlive = true;
      });

      extWs.on("message", async (data: WebSocket.Data) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());

          // DROP_UPDATE 메시지의 경우 상태 저장
          if (message.type === "DROP_UPDATE") {
            await this.stateManager.saveState({
              sections: message.sections,
              items: message.items,
              lastUpdated: Date.now(),
            });
          }

          // 다른 클라이언트들에게 메시지 브로드캐스트
          this.broadcastMessage(message, extWs);
        } catch (error) {
          console.error("Failed to handle message:", error);
        }
      });

      extWs.on("close", () => {
        console.log("Client disconnected");
        this.clients.delete(extWs);
      });

      extWs.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(extWs);
      });
    });
  }

  private broadcastMessage(
    message: WebSocketMessage,
    sender: ExtWebSocket
  ): void {
    const messageStr = JSON.stringify(message);

    this.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  public close(): void {
    clearInterval(this.heartbeatInterval);
    this.wss.close();
  }
}
