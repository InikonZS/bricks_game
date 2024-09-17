import hitSound from '../assets/hit.mp3';
import removeSound from '../assets/remove.mp3';
import shotSound from '../assets/shot.mp3';

const soundList = {
    hit: hitSound,
    remove: removeSound,
    shot: shotSound
}

class Sounds{
    volume: number;
    cache: Partial<Record<keyof typeof soundList, {blob: Blob, url: string, audio: HTMLAudioElement}>> = {};

    constructor(){
        this.volume = 0.2;
        this.preload();
    }

    play(name: keyof typeof soundList){
        if (this.volume!= 0){
            //const sound = new Audio(soundList[name]);
            const sound = new Audio(this.cache[name]?.url || soundList[name]);
            sound.volume = this.volume;
            sound.oncanplay=()=>sound.play();
        }
    }

    preload(){
        Object.keys(soundList).forEach((key: keyof typeof soundList)=>{  
            //const newAudio = new Audio(soundList[key]);
            //newAudio.load();
            fetch(soundList[key]).then(res=>res.blob()).then(blob=>{
                const url = URL.createObjectURL(blob);
                const audio = document.createElement('audio');
                audio.src = url;
                audio.load();
                document.body.append(audio);
                this.cache[key] = {blob, url, audio}
            })
            //this.cache[key] = //newAudio;
        });
    }
}

export const sound = new Sounds();