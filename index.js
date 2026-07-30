if (event.type === "message" && event.body) {

    // ❤️ Auto React (Na-handle nang mas malinis)
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

        // Admin Guard Check
        if (config.admins.length > 0 && !config.admins.includes(senderID)) {
            return api.sendMessage(
                "Sensya na, admins lamang ang pwedeng gumamit ng command na ito.",
                event.threadID,
                event.messageID
            );
        }

        const newNickname = messageText.replace(setNickCommand, "").trim() || config.defaultNickname;

        api.getThreadInfo(event.threadID, async (err, info) => {
            if (err) {
                console.error("Failed to fetch thread info:", err);
                return api.sendMessage("Nagkaroon ng error sa pagkuha ng thread info.", event.threadID);
            }

            const members = info.participantIDs;
            api.sendMessage(
                `Pinapalitan ang nickname ng ${members.length} miyembro...`,
                event.threadID
            );

            // Helper delay function para iwas rate limit / ban sa Facebook API
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

            let updatedCount = 0;

            for (const userID of members) {
                api.changeNickname(newNickname, event.threadID, userID, (err) => {
                    if (err) console.error(`Error changing nick for ${userID}:`, err);
                });

                updatedCount++;
                // Mag-antay ng 800ms bawat member para ligtas sa spam filter
                await delay(800); 
            }

            api.sendMessage(
                `✅ Tapos na! Napanatili at napalitan ang nickname ng ${updatedCount} na miyembro.`,
                event.threadID
            );
        });
    }
}
