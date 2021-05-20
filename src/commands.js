//commands are stored here to reduce complexity

function hello (channel, userstate) {
    client.say(channel, `@${userstate.username}, hey....`)
  }
  
  function youtube (channel, userstate) {
    client.say(channel, `@${userstate.username}, find me @ https://www.youtube.com/channel/UCOqVJES9hiDms9XTM7MSj1Q/videos`)
  }

  function setup (channel, userstate) {
    client.say(channel, `@${userstate.username}, You can find my setup in my Bio at the bottom of the page!`)
  }

  //when adding new commands, dont forget to export them!
  module.exports = { hello, youtube, setup};