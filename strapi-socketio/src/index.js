'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const io = require('socket.io')(strapi.server.httpServer, {
      cors: {
          origin: "http://localhost:3000"
      }
    });

    io.on("connection", async (socket) => {
      console.log('a user connected');

      socket.on('join room', (data) => {
        socket.join(data);
        socket.to(data).emit("player joined", socket.id)
      })

      socket.on('accept request', (data) => {
        console.log(socket.id, data.player);
        io.to(data.player).emit("owners deck", data.cardDeck)
      })


      socket.on('click card', (data) => {
        console.log(data);
        io.emit("owners deck", data.cardDeck)
      })

    });

  },
};
