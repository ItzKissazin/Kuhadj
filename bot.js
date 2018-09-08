var Discord = require('discord.js'),
	bot = new Discord.Client(),
	fs = require('fs'),
	isCommander = ['', '', ''],
	version = 'KuhaDj 1.0,0 beta',
	dversion = '9.3.0',
	yt = require('ytdl-core'),
	unirest = require('unirest'),
	moment = require('moment'),
	prefix = '!';

fs.readFile('token.txt', 'utf8', function(err, token) {
	if (err) {
		return console.log(err);
	}
	bot.login(token);
});

bot.once('ready', function() {
	console.log('Bot Online and Ready! On ' + bot.guilds.size + ' Servers!');
	bot.user.setStatus('online', bot.guilds.size + ' Servers | ' + prefix + 'Help')
});

const queue = {}
const array = ['https://www.youtube.com/watch?v=ru0K8uYEZWw', 'https://www.youtube.com/watch?v=Io0fBr1XBUA', 'https://www.youtube.com/watch?v=Pw-0pbY9JeU', 'https://www.youtube.com/watch?v=nYh-n7EOtMA', 'https://www.youtube.com/watch?v=foE1mO2yM04', 'https://www.youtube.com/watch?v=wyK7YuwUWsU', 'https://www.youtube.com/watch?v=pXRviuL6vMY', 'https://www.youtube.com/watch?v=OXWrjWDQh7Q', 'https://www.youtube.com/watch?v=wyK7YuwUWsU', 'https://www.youtube.com/watch?v=1gOQiFEwnZ8']

bot.on('message', msg => {
		var input = msg.content.toUpperCase();

		if (input.startsWith(prefix + 'dsflksflksdls')) {
			if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${prefix}add`);
			if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
			if (queue[msg.guild.id].playing) return msg.channel.sendMessage('Already Playing');
			let dispatcher;
			queue[msg.guild.id].playing = true;

			console.log(queue);
			(function play(song) {
				console.log(song);
				if (song === undefined) return msg.channel.sendMessage('Queue is empty').then(() => {
					queue[msg.guild.id].playing = false;
					msg.member.voiceChannel.leave();
				});
				msg.channel.sendMessage(`Playing: **${song.title}** as requested by: **${song.requester}**`);
				dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, {
					audioonly: true
				}), {
					passes: admin.passes
				});
				let collector = msg.channel.createCollector(m => m);
				collector.on('message', m => {
					if (m.content.startsWith(prefix + 'sdsfsfsfsfsfsfsf')) {
						msg.channel.sendMessage('paused').then(() => {
							dispatcher.pause();
						});
					} else if (m.content.startsWith(prefix + 'dsdsddsdsdsdsdsd')) {
						msg.channel.sendMessage('resumed').then(() => {
							dispatcher.resume();
						});
					} else if (m.content.startsWith(prefix + 'sdlskfldkgdlk')) {
						msg.channel.sendMessage('skipped').then(() => {
							dispatcher.end();
						});
					} else if (m.content.startsWith(prefix + 'dsfllklsd')) {
						if (Math.round(dispatcher.volume * 50) >= 100) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
						dispatcher.setVolume(Math.min((dispatcher.volume * 50 + (2 * (m.content.split('+').length - 1))) / 50, 2));
						msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					} else if (m.content.startsWith('volume-')) {
						if (Math.round(dispatcher.volume * 50) <= 0) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
						dispatcher.setVolume(Math.max((dispatcher.volume * 50 - (2 * (m.content.split('-').length - 1))) / 50, 0));
						msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					} else if (m.content.startsWith(prefix + 'time')) {
						msg.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
					}
				});
				dispatcher.on('end', () => {
					collector.stop();
					queue[msg.guild.id].songs.shift();
					play(queue[msg.guild.id].songs[0]);
				});
				dispatcher.on('error', (err) => {
					return msg.channel.sendMessage('error: ' + err).then(() => {
						collector.stop();
						queue[msg.guild.id].songs.shift();
						play(queue[msg.guild.id].songs[0]);
					});
				});
			})(queue[msg.guild.id].songs[0]);
		}
		if (input.startsWith(prefix + 'slkdsds')) {
			return new Promise((resolve, reject) => {
				const voiceChannel = msg.member.voiceChannel;
				if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
				voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
			});
		};
    if (input.startsWith(prefix + 'sklkfg')) {
  const voiceChannel = msg.member.voiceChannel;
  if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t leave your voice channel...');
  voiceChannel.leave();
};
		if (input.startsWith(prefix + 'seeod')) {
			let url = msg.content.split(' ')[1];
			if (url == '' || url === undefined) return msg.channel.sendMessage(`You must add a url, or youtube video id after ${prefix}add`);
			yt.getInfo(url, (err, info) => {
				if (err) return msg.channel.sendMessage('Invalid YouTube Link: ' + err);
				if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
				queue[msg.guild.id].songs.push({
					url: url,
					title: info.title,
					requester: msg.author.username
				});
				msg.channel.sendMessage(`added **${info.title}** to the queue`);
			});
		};
		if (input.startsWith(prefix + 'seddro')) {
			if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${prefix}add`);
			let tosend = [];
			queue[msg.guild.id].songs.forEach((song, i) => {
				tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);
			});
			msg.channel.sendMessage(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
		};
		if (input.startsWith(prefix + 'skksdd')) {
			let tosend = ['```xl', prefix + 'join : "Join Voice channel of msg sender"', prefix + 'add : "Add a valid youtube link to the queue"', prefix + 'queue : "Shows the current queue, up to 15 songs shown."', prefix + 'play : "Play the music queue if already joined to a voice channel"', '', 'the following commands only function while the play command is running:'.toUpperCase(), prefix + 'pause : "pauses the music"', prefix + 'resume : "resumes the music"', prefix + 'skip : "skips the playing song"', prefix + 'time : "Shows the playtime of the song."', 'volume+(+++) : "increases volume by 2%/+"', 'volume-(---) : "decreases volume by 2%/-"', '```'];
			msg.channel.sendMessage(tosend.join('\n'));
		};
		if (input.startsWith(prefix + 'dds')) {
		if (msg.author.id == admin.adminID) {
			process.exit(); //Requires a node module like Forever to work.
	}
}

if (input.startsWith(prefix + "PING")) {
	msg.channel.sendMessage("Pong").then(botMessage => {
		botMessage.edit("Pong! | aikaa meni: " + (botMessage.timestamp - msg.timestamp) + "ms");
	});
}

if (input.startsWith(prefix + "COIN")) {
	let coin = [`Klaava`, `Kruuna`]
	let coinchoose = coin[Math.floor(Math.random() * coin.length)];
	msg.channel.sendMessage(msg.author + ", heitti kolikon ja se osui: " + `** ${coinchoose} **`)
}

if (input.startsWith("DISCORD.GG//")) {
	if (msg.member.roles.find('name', 'Bot Commander') || isCommander.indexOf(msg.author.id) > -1) {} else {
		if (msg.guild.id == "478584142850686987") {
			msg.delete()
			msg.channel.sendMessage(msg.author + " No Discord Inite Links")
			msg.channel.sendMessage("!warn " + msg.author + " Ei kutsuja kiitos!")
		} else {}
	}
}

if (input.startsWith(prefix + "SAY")) {
	if (msg.author != bot.user) {
		if (msg.member.roles.find('name', 'Bot Commander') || isCommander.indexOf(msg.author.id) > -1) {
			var Say = msg.content.split(" ").slice(2).join(" ");
			var ch = msg.mentions.channels.first();
			if (!ch) {
				Say = msg.content.split(" ").slice(1).join(" ");
				msg.channel.sendMessage(Say);
			} else {
				ch.sendMessage(Say);
			}
		} else {
			msg.reply("sinulla ei ole roolia `Bot Commander`")
		}
	}
}

if (input.startsWith(prefix + "INFO")) {
	msg.channel.sendMessage("```" + "\nPalvelia Yhteensä: " + bot.guilds.size +
		"\nkanavia Yhteensä: " + bot.channels.size +
		"\nJäseniä Yhteensä: " + bot.users.size +
		"\nKoodikieli: discord.js" +
		"\nVersio: " + version +
		"\nDiscord.js Versio: " + dversion + "```");
}

if (input === (prefix) + "MYSERVER") {
	msg.channel.sendMessage("**" + msg.author.username + "**" + " : Katso yksityisviestit :mailbox_with_mail:")
	msg.author.sendMessage("**" + msg.author.username + "**" + " :  Virallinen botin kanava (kesken");
}

if (input === (prefix + "SERVERINFO")) {
	bot.options.disableEveryone = "true";
	msg.channel.sendMessage("**" + msg.guild.name + "**" +
		"```" + "\nJäseniä yhteensä: " + msg.guild.members.size +
		"\nKanavia yhteensä: " + msg.guild.channels.size +
		"\nPalvelimen maa: " + msg.guild.region +
		"\nOmistaja: " + msg.guild.owner.user.username +
		"\nLuotu: " + msg.guild.creationDate +
		"\nPalvelimen pikkukuva: " + msg.guild.iconURL +
		"\nRoolit: " + msg.guild.roles.map(r => r.name).join(", ") + "```");
}

if (input === (prefix + "USERINFO")) {
	bot.options.disableEveryone = "true";
	if (null) {
		msg.channel.sendMessage(
			"```" + "\nNimi: " + msg.author.username +
			"\nID: " + msg.author.id +
			"\nStatus: " + msg.author.status +
			"\nLalvelin: " + KalojenServu + 
			"\nPeli: " + "No Game" +
			"\nLuotu: " + msg.author.creationDate + "```")
	} else {
		if (!null) {
			msg.channel.sendMessage(
				"```" + "\nNimi: " + msg.author.username +
				"\nID: " + msg.author.id +
				"\nStatus: " + msg.author.status +
				"\nPalvelin: " + msg.guild.name +
				"\nPeli: " + msg.author.game +
				"\nLuotu: " + msg.author.creationDate + "```")
		}
	}
}

if (input === (prefix + "UPTIME")) {
	var date = new Date(bot.uptime);
	var strDate = '**';
	strDate += date.getUTCDate() - 1 + " päivää, ";
	strDate += date.getUTCHours() + " tunteja, ";
	strDate += date.getUTCMinutes() + " minuutteja, ";
	strDate += date.getUTCSeconds() + " sekuntteja**";
	msg.channel.sendMessage(strDate)
}

if (input === (prefix + "DOCUMENTATION")) {
	msg.channel.sendMessage(msg.author + ", löysit easter eggin :D")
}

if (input.startsWith(prefix + "EVAL")) {
	if (msg.member.roles.find('name', 'Bot Commander') || isCommander.indexOf(msg.author.id) > -1) {
		var c = msg.content.split(" ").splice(1).join(" ");
		try {
			var res = eval(c)
			msg.channel.sendMessage(res)
		} catch (err) {
			msg.channel.sendMessage(err)
		}
	} else {
		msg.reply("You do not have `Bot Commander`")
	}
}

const params = msg.content.split(" ").slice(1);

if (input.startsWith(prefix + "PURGE")) {
	if (msg.member.roles.find('name', 'Bot Commander') || isCommander.indexOf(msg.author.id) > -1) {
		let messagecount = parseInt(params[0]);
		msg.channel.fetchMessages({
				limit: messagecount + 1
			})
			.then(messages => msg.channel.bulkDelete(messages))
			.catch(console.error);
		setTimeout(function() {
			msg.channel.sendMessage("Purged " + messagecount)
		}, 1000)
	} else {
		msg.reply("You do not have `Bot Commander`")
	}
}

if (input.startsWith(prefix + "GIVE")) {
	try {
		if (msg.member.roles.find('name', 'Bot Commander')) {
			var togive = msg.guild.member(msg.mentions.users.first());
			var rolename = msg.content.split(" ").splice(2).join(" ")
			var role = msg.guild.roles.find("name", rolename);
			togive.addRole(role).then(() => {
				msg.channel.sendMessage("Given " + rolename + " to " + togive);
			});
			if (!togive) {
				msg.channel.sendMessage("Please Mention a User!")
			}
		} else {
			msg.reply("You do not have `Bot Commander`")
		}
	} catch (err) {
		console.log(err)
	}
}

if (input.startsWith(prefix + "TAKE")) {
	try {
		if (msg.member.roles.find('name', 'Bot Commander')) {
			var togive = msg.guild.member(msg.mentions.users.first());
			var rolename = msg.content.split(" ").splice(2).join(" ")
			var role = msg.guild.roles.find("name", rolename);
			togive.removeRole(role).then(() => {
				msg.channel.sendMessage("Taken " + rolename + " from " + togive);
			});
			if (!togive) {
				msg.channel.sendMessage("Please Mention a User!")
			}
		} else {
			msg.reply("You do not have `Bot Commander`")
		}
	} catch (err) {
		console.log(err)
	}
}

if (input.startsWith(prefix + "WARN")) {
	if (msg.member.roles.find('name', 'Bot Commander') || isCommander.indexOf(msg.author.id) > -1) {
		var user = msg.mentions.users.first();
		var reason = msg.content.split(" ").splice(2).join(" ")
		if (!user) {
			msg.channel.sendMessage("Error: You did mention a person to Warn!")
			console.log(msg.author.username + " Failed to mention a user to Warn!");
		}
		if (user) {
			if (msg.guild.id == 201591183246491648) {
				bot.channels.get('227789541531058177').sendMessage("**Action:** Warning\n**User:** " + user + "\n**Moderator:** " + msg.author.username + "\n**Reason:** " + reason);
				console.log(msg.author.username + " executed: Warn against " + user);
			} else {
				console.log(msg.author.username + " executed: Warn against " + user);
				msg.channel.sendMessage("**Tapahtuma:** Varoitus\n**Käyttäjä:** " + user + "\n**Antaja:** " + msg.author.username + "\n**Reason:** " + reason);
			}
		}
	} else {
		msg.reply("You do not have `Bot Commander`")
	}
}

if (input.startsWith(prefix + "MUTE")) {
	if (msg.member.roles.find('name', 'Bot Commander') || isCommander.indexOf(msg.author.id) > -1) {
		var user = msg.mentions.users.first();
		var reason = msg.content.split(" ").splice(2).join(" ")
		if (!user) {
			msg.channel.sendMessage("Virhe! Et maininnut henkilöä " + msg.author.username + "!");
			console.log(msg.author.username + " Failed to mention a user to Mute!" + msg.author.username + "!");
		}
		if (user) {
			if (msg.guild.id == 201591183246491648) {
				bot.channels.get('227789541531058177').sendMessage("**Action:** Mute\n**User:** " + user + "\n**Moderator:** " + msg.author.username + "\n**Reason:** " + reason);
				console.log(msg.author.username + " executed: Mute against " + user);
			} else {
				console.log(msg.author.username + " executed: Mute against " + user);
				msg.channel.sendMessage("**Tapahtuma:** Mykistys\n**Käyttäjä:** " + user + "\n**Antaja:** " + msg.author.username + "\n**Syy:** " + reason);
			}
		}
		msg.guild.member(user).addRole(msg.guild.roles.find("name", "muted"));
	} else {
		msg.reply("Et ole Bot Commander roolissa")
	}
}

if (input.startsWith(prefix + "UNMUTE")) {
	if (msg.member.roles.find('name', 'Bot Commander') || isCommander.indexOf(msg.author.id) > -1) {
		var user = msg.mentions.users.first();
		if (!user) {
			msg.channel.sendMessage("Error: You did mention a person to Un-Mute!")
			console.log(msg.author.username + " Failed to mention a user to Un-Mute!");
		}
		if (user) {
			if (msg.guild.id == 201591183246491648) {
				bot.channels.get('227789541531058177').sendMessage("**Action:** Mute\n**User:** " + user + "\n**Moderator:** " + msg.author.username + "\n**Reason:** " + reason);
				console.log(msg.author.username + " executed: Un-Mute against " + user);
			} else {
				console.log(msg.author.username + " executed: Un-Mute against " + user);
				var reason = msg.content.split(" ").splice(2).join(" ")
				msg.channel.sendMessage("**Action:** Un-Mute\n**User:** " + user + "\n**Moderator:** " + msg.author.username + "\n**Reason:** " + reason);
			}
		}
		msg.guild.member(user).removeRole(msg.guild.roles.find("name", "muted"));
	} else {
		msg.reply("You do not have `Bot Commander`")
	}
}

if (input.startsWith(prefix + "KICK")) {
	var user = msg.mentions.users.first();
	if (msg.member.roles.find('name', 'Bot Commander') || isCommander.indexOf(msg.author.id) > -1) {
		if (!user) {
			msg.channel.sendMessage("Error: You did not mention a person to Kick!")
			console.log(msg.author.username + " Failed to mention a user to Kick!");
		}
		if (user) {
			if (msg.guild.id == 201591183246491648) {
				console.log(msg.author.username + " executed: Kick against " + user);
				bot.channels.get('227789541531058177').sendMessage("**Action:** Kick\n**User:** " + user + "\n**Moderator:** " + msg.author.username + "\n**Reason:** " + reason);
			} else {
				console.log(msg.author.username + " executed: Kick against " + user);
				var reason = msg.content.split(" ").splice(2).join(" ")
				msg.channel.sendMessage("**Action:** Kick\n**User:** " + user + "\n**Moderator:** " + msg.author.username + "\n**Reason:** " + reason);
			}
		}
		msg.guild.member(user).kick();
	} else {
		msg.reply("Error: You do not have the `Bot Commander` role!")
	}
}

if (input.startsWith(prefix + "BAN")) {
	if (msg.member.roles.find('name', 'Bot Commander') || isCommander.indexOf(msg.author.id) > -1) {
		var user = msg.mentions.users.first();
		if (!user) {
			msg.channel.sendMessage("Error: You did mention a person to Ban!")
			console.log(msg.author.username + " Failed to mention a user to Ban!");
		}
		if (user) {
			if (msg.guild.id == 201591183246491648) {
				console.log(msg.author.username + " executed: Ban against " + user);
				bot.channels.get('227789541531058177').sendMessage("**Action:** Ban\n**User:** " + user + "\n**Moderator:** " + msg.author.username + "\n**Reason:** " + reason);
			} else {
				console.log(msg.author.username + " executed: ban against " + user);
				var reason = msg.content.split(" ").splice(2).join(" ")
				msg.channel.sendMessage("**Action:** Ban\n**User:** " + user + "\n**Moderator:** " + msg.author.username + "\n**Reason:** " + reason);
			}
		}
		msg.guild.ban(user, msg.channel);
	} else {
		msg.reply("sinulla ei ole roolia `Bot Commander`")
	}
}

switch (input) {

	case (prefix) + "HELP":
		msg.channel.sendMessage("Hei " + msg.author + " Olen lähettänyt apuvalikon.");
		msg.author.sendMessage(`**Hei ja tervetuloa KuhaDj:n beta apuvalikkoon**



**musiikki**
!play (linkki) = lisää musiikkia jonoon
!summon = tuo botin voice kanavalle
!queue = näyttää musiikkijonon
!skip = äänestää skippaamaan nykyistä kappaletta


**hauskat...**
!donate (vaaraton)
!id 
!servers
!youtube
!members

moderation:
!ban
!kick
!warn
!mute (kesken, älä käytä)
		

		:copyright:
        IBT`);
		break;

	case "<@207970040459427840> HELP":
		msg.channel.sendMessage("Hello " + msg.author + "\, I\'ve sent you some help info in PM.");
		msg.author.sendMessage(`**Hei ja tervetuloa KuhaDj:n beta apuvalikkoon**

		Et ole botin betassa joten pääsysi tänne on estetty!

		:copyright:
        IBT`);
		break;

	case (prefix) + "ID":
		msg.channel.sendMessage("ID:si on: `" + msg.author.id + "`");
		break;

	case "<@207970040459427840> WHAT'S YOUR PREFIX?":
		msg.channel.sendMessage("Minun prefix on `" + (prefix) + "`");
		break;

	case (prefix) + "DONATE":
		msg.channel.sendMessage("En tarvitse donatea " + msg.author.username + " mutta kiitos kuitenkin");
		break;

	case (prefix) + "INVITE":
		msg.channel.sendMessage("Botti on asetettu yksityiseksi jolloin tätä ei voi lisätä kanavalle");
		break;

	case (prefix) + "SERVERS":
		msg.channel.sendMessage("Nykyaikainen palvelin luettelo: " + "`" + bot.guilds.size + "`");
		break;

	case (prefix) + "MEMBERS":
		msg.channel.sendMessage("kanavoiden henkilölukumäärä: " + "`" + bot.users.size + "`");
		break;

	case (prefix) + "GOAL":
		msg.channel.sendMessage(bot.servers.length + " sadasta")
		break;

	case (prefix) + "SERVERID":
		msg.channel.sendMessage(msg.guild.name + "\'s :id: on: " + "`" + msg.guild.id + "`")
		break;

	case (prefix) + "YOUTUBE":
		msg.channel.sendMessage("https://www.youtube.com/c/ItzKissaz");
		break;

	case (prefix) + "TOKEN":
		msg.channel.sendMessage("oikeesti " + msg.author + " luulitko että token löytyisi täältä? Easter egg :D");
		break;

	case (prefix) + "MEDALS":
		msg.channel.sendMessage("**" + msg.author.username + "**" + " : 2016 olympia kisat päättyi jo");
		break;

	case (prefix) + "ItzKissaz":
		if (msg.author.id == "334461848156110849") {
			msg.channel.sendMessage("miten voin auttaa sinua?");
		} else {
			msg.channel.sendMessage("Et ole ItzKissaz")
		}
		break;
}
});