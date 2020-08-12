const { Client, MessageEmbed } = require("discord.js");

const bot = new Client();

bot.on("ready", async () => {
  console.log(`${bot.user.username} is ready to give message previews`);
});

bot.on("message", async (message) => {
  if (message.author.bot) return;

  if (
    message.content
      .toLowerCase()
      .match(
        /https:\/\/((www|canary|ptb)\.)?(discord(app)?)\.com\/channels\/(\d{17,19}\/?){2,4}/gi
      )
  ) {
    const numbers = message.content.match(/\d{17,19}/g);

    if (!Array.isArray(numbers) || numbers.length !== 3) return;

    const channel = bot.channels.cache.get(numbers[1]);
    if (!channel) return;

    const msg = (await channel.messages.fetch({ limit: 100 })).get(numbers[2]);
    if (!msg) return;

    return message.channel.send(
      new MessageEmbed()
        .setAuthor("Message Preview", message.guild.iconURL(), msg.url)
        .setColor("f55e53")
        .setDescription(
          msg.content && msg.content.length > 1950
            ? `${msg.content.substring(0, 1950)}...`
            : msg.content || "Unknown Content"
        )
        .setImage(
          msg.attachments.size ? msg.attachments.first().url : undefined
        )
        .setFooter(message.author.tag, msg.author.displayAvatarURL())
    );
  }
});

bot.login("token");
