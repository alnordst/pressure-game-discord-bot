module.exports = {
  execute: (msg) => {
    msg.channel.send(
      `Hello, thanks for trying out *Pressure*! Check out the rules at https://bit.ly/3zOp1EB if you haven't already. You can send me \`help\` to get a list of commands. You'll probably want to start with \`find-match\`. If you want to play primarily through the Discord client, you'll probably want to do \`enable-updates\` so that the bot will message you when a match is ready for you to submit commands.`
    )
  }
}