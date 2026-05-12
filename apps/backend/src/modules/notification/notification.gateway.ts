import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('connection:accepted', { message: 'Realtime notification gateway connected' });
  }

  broadcastNotification(payload: { recipient: string; title: string; message: string }) {
    this.server.emit(`notification:${payload.recipient}`, payload);
  }
}
