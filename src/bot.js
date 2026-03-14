import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.DirectMessages] });

client.login(process.env.DISCORD_BOT_TOKEN);

export async function sendTurnNotification(userId, queueName) {
  try {
    const user = await client.users.fetch(userId);
    await user.send(
      `It's your turn in **${queueName}**! Head over to the station.`,
    );
  } catch (err) {
    console.error(`Failed to DM user ${userId}:`, err);
  }
}
