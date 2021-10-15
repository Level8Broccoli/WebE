export const WebSocketPlugin = (socket) => (store) => {
    socket.on("connect", () => {
        console.log("connected", socket.id);
    });
    socket.on("disconnect", (reason) => {
        console.log("disconnected", reason);
        store.commit("addToErrorLog", reason);
    });
    socket.on("registerPlayer", (res) => {
        if ("player" in res) {
            store.commit("updatePlayer", res.player);
            store.commit("updateGames", res.games);
        }
        else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });
    socket.on("createGame", (res) => {
        if ("game" in res) {
            if (res.game.creatorId === store.state.player.id) {
                store.commit("updateActiveGame", res.game);
            }
        }
        else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });
    socket.on("deleteGame", (res) => {
        if ("game" in res) {
            if (res.game.id === store.state.activeGame?.id) {
                store.commit("updateActiveGame", null);
            }
        }
        else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });
    socket.on("chat", (res) => {
        if ("message" in res) {
            store.commit("addChatMessage", res);
        }
        else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });
    socket.on("joinGame", (res) => {
        if ("game" in res) {
            if (res.player.id === store.state.player.id) {
                store.commit("updateActiveGame", { ...res.game, chat: [] });
            }
        }
        else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });
    socket.on("leaveGame", (res) => {
        if ("game" in res) {
            if (res.player.id === store.state.player.id) {
                store.commit("updateActiveGame", null);
            }
        }
        else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });
    store.subscribe((mutation, state) => {
        if (mutation.type === "registerPlayer") {
            const payload = { playerName: state.player.name };
            socket.emit("registerPlayer", payload);
        }
        if (mutation.type === "createGame") {
            const payload = {
                player: state.player,
                config: {
                    maxPlayerCount: mutation.payload
                }
            };
            socket.emit("createGame", payload);
        }
        if (mutation.type === "deleteGame") {
            if (state.activeGame === null) {
                console.error("can't delete empty game");
                store.commit("addToErrorLog", "can't delete empty game");
                return;
            }
            const payload = {
                player: state.player,
                game: state.activeGame
            };
            socket.emit("deleteGame", payload);
        }
        if (mutation.type === "chat") {
            if (state.activeGame === null) {
                console.error("can't chat with empty game");
                store.commit("addToErrorLog", "can't chat with empty game");
                return;
            }
            const payload = {
                player: state.player,
                game: state.activeGame,
                message: mutation.payload
            };
            socket.emit("chat", payload);
        }
        if (mutation.type === "joinGame") {
            const payload = {
                player: state.player,
                game: {
                    id: mutation.payload,
                },
            };
            socket.emit("joinGame", payload);
        }
        if (mutation.type === "leaveGame") {
            if (state.activeGame === null) {
                console.error("can't leave an empty game");
                store.commit("addToErrorLog", "can't leave an empty game");
                return;
            }
            const payload = {
                player: state.player,
                game: {
                    id: state.activeGame.id,
                },
            };
            socket.emit("leaveGame", payload);
        }
        if (mutation.type === "editPlayerName") {
            const payload = {
                player: state.player
            };
            socket.emit("editPlayerName", payload);
        }
    });
};
//# sourceMappingURL=WebSocketPlugin.js.map