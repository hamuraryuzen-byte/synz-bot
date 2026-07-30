if (event.type === "message" && event.body) {

    // ❤️ Auto React
    api.setMessageReaction("❤️", event.messageID, (err) => {
        if (err) console.error("Auto React Error:", err);
    }, true);

    const messageText = event.body.trim();
    const senderID = event.senderID;

    // Auto Replies
    for (const [key, value] of Object.entries(config.commands)) {
        if (messageText.toLowerCase() === key.toLowerCase()) {
            api.sendMessage(value, event.threadID, event.messageID);
        }
    }

    // !setallnick command
    const setNickCommand = `${config.prefix}setallnick`;

    if (messageText.startsWith(setNickCommand)) {

        if (
            config.admins.length > 0 &&
            !config.admins.includes(senderID)
        ) {
            return api.sendMessage(
                "Sensya na, admins lamang ang pwedeng gumamit ng command na ito.",
                event.threadID,
                event.messageID
            );
        }

        const newNickname =
            messageText.replace(setNickCommand, "").trim() ||
            config.defaultNickname;

        api.getThreadInfo(event.threadID, (err, info) => {
            if (err) return console.error(err);

            api.sendMessage(
                `Pinapalitan ang nickname ng ${info.participantIDs.length} miyembro...`,
                event.threadID
            );

            info.participantIDs.forEach((userID) => {
                api.changeNickname(
                    newNickname,
                    event.threadID,
                    userID,
                    (err) => {
                        if (err) console.error(err);
                    }
                );
            });
        });
    }
      }
