import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIo } from '../../../../types';
import * as service from '@/services/pokerService';
import { Player } from '@/models/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      socket.use(([event, ...args], next) => {
        next();
      });

      socket.on('disconnect', () => {
        const player = service.removePlayer(socket.id);
        if (player) {
          const remainingPlayers = service.getPlayers(player.room.id)
          // if (remainingPlayers.length === 0) {
          //   service.removeRoom(player.room.id)
          // }

          io.in(player.room.id).emit('players-in-room', remainingPlayers);
        }
      });

      socket.on('create-room', ({ roomName }, callback) => {
        const { data, error } = service.createRoom(roomName)
        if (error) {
          return callback({ error })
        }

        return callback({ id: data?.id })
      })

      socket.on('join-game', ({ name, room }, callback) => {
        const { data, error } = service.addPlayer(socket.id, name, room);
        if (error || !data) {
          return callback({ error });
        }

        socket.join((data as Player).room.id);
        io.in(room).emit('players-in-room', service.getPlayers(room));

        callback({ data });
      });

      socket.on('select-card', (card) => {
        const player = service.getPlayer(socket.id);
        if (player) {
          const room = service.getRoom(player.room.id)
          if (!room?.running) return;

          const updated = service.updatePlayerCard(player, card);
          if (updated) {
            io.in(player.room.id).emit('players-in-room', service.getPlayers(player.room.id));
          }
        }
      });

      socket.on('reveal-cards', () => {
        const player = service.getPlayer(socket.id);
        if (player) {
          service.finishGame(player.room.id)
          io.in(player.room.id).emit('reveal');
        }
      });

      socket.on('restart-game', () => {
        const player = service.getPlayer(socket.id);
        if (player) {
          service.restartGame(player.room.id)
          io.in(player.room.id).emit('restart');
          io.in(player.room.id).emit('players-in-room', service.getPlayers(player.room.id));
        }
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
