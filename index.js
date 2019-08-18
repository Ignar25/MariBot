const Discord = require('discord.js');
const { prefix, token,API } = require('./config.json');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const queue = new Map();
const { Util } = require('discord.js');
const YouTube = require('simple-youtube-api');

const youtube = new YouTube(API);

client.on('ready', () => {
    console.log('Ready!');
})

client.on('message', message => {
    if ( message.content == 'Hola puta' || message.content == "hola puta") {
        try {
            message.react('🤔');
            message.reply('Puta tu vieja.');
        } catch (error) {
            console.log(error);
        }
    }
})

client.on('message', async message => {
    // console.log(message.content);
    if(message.author.bot) return undefined;
    if(!message.content.startsWith(prefix)) return undefined;
    const args = message.content.split(' ');
    const searchString = args.slice(1).join(' ')
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    if ( message.content.startsWith(`${prefix}play`) || message.content.startsWith(`${prefix}p`)) {
        
        // The bot will try to join a Voice Channel
        const vc = message.member.voiceChannel;
        if (!vc) {
            return message.channel.send('Conectate a un canal pa escucha música ureeee');
        }
        
        // Permission check to access Voice Channel
        const perm = vc.permissionsFor(message.client.user);
        if (!perm.has('CONNECT')) {
            return message.channel.send('No me puedo conectar carepingo');
        }
        if (!perm.has('SPEAK')){
            return message.channel.send('No puedo hablar acá ureeee');
        }

        try {
            var video = await youtube.getVideo(url);
        } catch (error) {
            try {
                var videos = await youtube.searchVideos(searchString, 1);
                var video = await youtube.getVideoByID(videos[0].id); 
            } catch (error) {
                console.error(error);
                return message.channel.send('No encontré el video 😢');
            }    
        }
        // Will get the Video URL that will be played
        const song = {
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            url : `${video.url}`,
        }
        console.log(song.url);
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: vc,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            try {
                var connection = await vc.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
                console.error(`No me pude conectar por: ${error}`);
                queue.delete(message.guild.id);
            }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** se agregó a la cola.`);
        }

    // The bot will skip the song that's currently playing.
    } else if (message.content.startsWith(`${prefix}skip`)) {
        if (!message.member.voiceChannel) return message.channel.send('No podes skipear sin estar en un canal.');
        console.log(serverQueue);
        if (!serverQueue) return message.channel.send('No hay nada que skipear, chango.')
        serverQueue.connection.dispatcher.end();
        // return undefined;
    // The bot will stop playing music, and leave the Voice Channel.
    } else if (message.content.startsWith(`${prefix}stop`)) {
        if (!message.member.voiceChannel) return message.channel.send('Necesitas estar en un canal');
        if (!serverQueue) return message.channel.send('No hay nada que parar, ura');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        // return undefined;
    } else if (message.content.startsWith(`${prefix}np`)) {
        if (!serverQueue) return message.channel.send('No hay nada sonando');
        return message.channel.send(`Ahora está sonando **${serverQueue.songs[0].title}**`);
    } else if (message.content.startsWith(`${prefix}leave`)) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    // The bot will return an array with the queued songs   
    } else if (message.content.startsWith(`${prefix}queue` || message.content.startsWith(`${prefix}q`))) {
        if (!serverQueue) return message.channel.send('No hay nada en la lista.');
        return message.channel.send(`
__**Lista de Reproducción**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Ahora está sonando** ${serverQueue.songs[0].title}
        `);
    }

    return undefined;
});

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        setTimeout(() => {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }, 60000);
    }
    
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', () => {
                console.log('Terminó la canción');
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => {
                console.error(error);
            })
        dispatcher.setVolume(0.5);

    serverQueue.textChannel.send(`Reproduciendo **${song.title}**`);
}

client.login(token);