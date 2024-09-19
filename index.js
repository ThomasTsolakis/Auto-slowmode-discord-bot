const Discord = require('discord.js');
const client = new Discord.Client();

var messageCounts = {};

// Function to check if a channel has 10 messages under 10 seconds
function checkSlowmode(channel) {
  const now = Date.now();
  const messages = messageCounts[channel.id];
  if (messages && messages.length >= 10) {
    const timeElapsed = now - messages[0];
    if (timeElapsed < 10000) {
      const slowmodeDelay = Math.min(30, Math.floor(messages.length / 10) * 2);
      channel.setRateLimitPerUser(slowmodeDelay);
      console.log(`Slowmode enabled in ${channel.name} with delay ${slowmodeDelay} seconds`);
    } else {
      channel.setRateLimitPerUser(0);
      console.log(`Slowmode disabled in ${channel.name}`);
    }
  } else {
    channel.setRateLimitPerUser(0);
    console.log(`Slowmode disabled in ${channel.name}`);
  }
  // Remove old messages from the array
  while (messages && messages.length > 0 && now - messages[0] > 10000) {
    messages.shift();
  }
}

client.on('message', async (msg) => {
  const channel = msg.channel;
  if (!messageCounts[channel.id]) {
    messageCounts[channel.id] = [];
  }
  messageCounts[channel.id].push(Date.now());

  // Check if the channel has 10 messages under 10 seconds
  checkSlowmode(channel);
});

client.login('MTI1NzQ1NTQ5MzkwNDA3MjgyNg.GaPOZX.T9De6PbruClQpP2u1wFbADHjZfcqzoGthCLuV4')