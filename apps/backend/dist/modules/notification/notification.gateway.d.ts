import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationGateway implements OnGatewayConnection {
    private readonly jwtService;
    private readonly logger;
    server: Server;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): void;
    broadcastNotification(payload: {
        recipient: string;
        title: string;
        message: string;
    }): void;
}
