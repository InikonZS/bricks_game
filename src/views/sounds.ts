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

    constructor(){
        this.volume = 0.2;
    }

    play(name: keyof typeof soundList){
        if (this.volume!= 0){
            const sound = new Audio(soundList[name]);
            sound.volume = this.volume;
            sound.oncanplay=()=>sound.play();
        }
    }

    preload(){

    }
}

export const sound = new Sounds();