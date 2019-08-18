# MariBot
Discord bot that can play music in a Voice Channel.


/***************************************************************************************/
/******************TO MAKE IT WORK YOU MUST BE IN A VOICE CHANNEL***********************/
/***************************************************************************************/

First, you need to turn it on, by opening your terminal and executing the command: 
                node index.js
This will bring set the bot up, and ready to serve.


Basics commands:

        To make it work, you have to use de prefix '.'
        
        1-Playing Music:
          Use the commando '.play' or '.p' to start playing music, you can type a song and will search it or paste a YouTube URL:
            ____ .play|.p GENIUS LSD____
            ____ .play|.p https://www.youtube.com/watch?v=25_nCaQQOIc___
            
        2-Queue Function:
          You can add multiple songs with the .play command and queue them to be played after. Also you can see the queue by using the
         command .queue
         
        3-Skip Function:
         If you have many song on your queue and you don't like whatever is playing ATM, you can skip it. There's a current bug that will
        crash the bot if the queue is empty and try to skip a song. Please, avoid doing that. You use this function by using the command
        .skip
        
        4-Now Playing:
          There's a function that allows to see whatever is playing right now. You use the commando .np and will display the song that's
         currently playing.
        
