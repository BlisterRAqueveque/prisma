import { Usuario } from '@/usuarios/model/usuario.model';
import { Logger, OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  constructor(private readonly socketService: SocketService) {}
  //? Logger
  private readonly logger = new Logger('Socket');
  //! The instance of the server
  @WebSocketServer() server: Server;

  /**
   * @description
   * All socket with they credentials
   */
  clients: { [key: string]: { socket: Socket; user: Usuario } } = {};

  //? Fx when the module inits
  onModuleInit() {
    //* Init module
    this.logger.log('Initialized');
    //* Listening when a new socket connects
    this.server.on('connection', async (socket: Socket) => {
      this.logger.log(`User connected, id: ${socket.id}`);
      //* Get the token
      const token = socket.handshake.headers.authorization;
      let user: Usuario;
      //* From the token, get the user
      try {
        user = await this.socketService.returnUserInfo(token);
      } catch (error) {
        this.logger.log('User without credentials');
      }
      //? The event name
      const ev = 'user-connection';
      //? The sending args
      const args = `Conectado: ${
        user
          ? (user.nombre_completo ?? 'Usuario no identificado')
          : 'Usuario sin credenciales'
      }`;
      //? Send the args to all connected clients, to the event
      for (let key in this.clients) {
        const socket = this.clients[key].socket;
        this.sendSubscribeMessage(socket, ev, args);
      }
      //* Save the user in the list
      this.clients[socket.id] = { socket, user };

      //! El problema es que emite el evento inclusive al recientemente conectado
      // this.server.emit(
      //   'user-connection',
      //   user
      //     ? (user.nombre_completo ?? 'Usuario no identificado')
      //     : 'Usuario sin credenciales',
      // );

      //! Listening when the socket disconnect
      socket.on('disconnect', () => {
        //? The event name
        const ev = 'user-disconnection';
        //? The sending args
        const args = `Desconectado: ${
          user
            ? (user.nombre_completo ?? 'Usuario no identificado')
            : 'Usuario sin credenciales'
        }`;
        //? Send the args to all connected clients, to the event
        for (let key in this.clients) {
          const socket = this.clients[key].socket;
          this.sendSubscribeMessage(socket, ev, args);
        }

        this.logger.log(`User disconnected, id : ${socket.id}`);
        //! El problema es que emite el evento inclusive al recientemente conectado
        // this.server.emit(
        //   'user-disconnection',
        //   user
        //     ? (user.nombre_completo ?? 'Usuario no identificado')
        //     : 'Usuario sin credenciales',
        // );
      });
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  /**
   * @description
   * Return the user by his token
   * @param token User's token
   * @returns User
   */
  private sendSubscribeMessage(socket: Socket, event: string, args: any) {
    socket.emit(event, args);
  }
}
