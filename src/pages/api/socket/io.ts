import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIo } from '../../../../types';
import { addPlayer, removePlayer, getPlayers, getPlayer, finishGame, restartGame, updatePlayerCard } from '@/services/pokerService';

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

      socket.on('join-game', ({ name, room }, callback) => {
        const { user, error } = addPlayer(socket.id, name, room);
        if (error || !user) {
          return callback(error);
        }

        socket.join(user.room);
        io.in(room).emit('players-in-room', getPlayers(room));

        callback();
      });

      socket.on('disconnect', () => {
        const user = removePlayer(socket.id);
        if (user) {
          io.in(user.room).emit('players-in-room', getPlayers(user.room));
        }
      });

      socket.on('select-card', (card) => {
        const player = getPlayer(socket.id);
        if (player) {
          const updated = updatePlayerCard(player, card);
          if (updated) {
            io.in(player.room).emit('players-in-room', getPlayers(player.room));
          }
        }
      });

      socket.on('reveal-cards', () => {
        const player = getPlayer(socket.id);
        if (player) {
          finishGame(player.room)
          io.in(player.room).emit('reveal');
        }
      });

      socket.on('restart-game', () => {
        const player = getPlayer(socket.id);
        if (player) {
          restartGame(player.room)
          io.in(player.room).emit('restart');
          io.in(player.room).emit('players-in-room', getPlayers(player.room));
        }
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
