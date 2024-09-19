const Discord = require('discord.js');
const client = new Discord.Client();

var messageCounts = {};

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

  checkSlowmode(channel);
});

client.login('PUT YOUR TOKEN HERE')