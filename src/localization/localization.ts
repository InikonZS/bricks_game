import { en } from './en';
import { ru } from './ru';
import Signal from '../control/signal';

export class Localization {
    private langs: {
        en: Record<string, string>,
        ru: Record<string, string>
    };

    currentLang: Record<string, string>;
    currentLangName: string;

    onChange = new Signal<void>();//()=> void;

    constructor(){
        this.langs = {
            en: en,
            ru: ru
        }
        this.currentLang = this.langs['ru'];
    }

    getAvailableLangs = ()=>{
        return Object.keys(this.langs);
    }

    setLang = (_key?: string)=>{
        const langList = this.getAvailableLangs();
        const key = _key || langList[(langList.indexOf(this.currentLangName) + 1) % langList.length]
        const nextLang = this.langs[key as keyof typeof this.langs];
        if (nextLang){
            this.currentLang = nextLang;
            this.currentLangName = key;
            this.onChange.emit();
        } else {
            console.log('Wrong language');
        }
    }
}

export const localize = new Localization()