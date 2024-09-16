class Yandex{
    public sdk: {
        adv: {
            showRewardedVideo: (options: {
                callbacks: {
                    onOpen: () => void,
                    onRewarded: () => void,
                    onClose: () => void,
                    onError: (e: any) => void
                }
            })=>void
        },
        [key:string]:any
    };
    
    constructor(){

    }

    private async loadSdk() {
        return new Promise<void>((resolve, reject)=>{
            var s = document.createElement('script');
            s.src = "/sdk.js";
            s.async = true;
            s.onload = () => {
                resolve();
            };
            s.onerror = () => {
                reject();
            };
            document.body.append(s);
        });
    }

    private async initSdk(){
        return window.YaGames
        .init()
        .then((ysdk:any) => {
            console.log('Yandex SDK initialized');
            this.sdk = ysdk;
        });
    }

    public async init(){
        try {
            await this.loadSdk();
        } catch(e){
            console.log('Yandex sdk not available');
        }
        try {
            await this.initSdk();
        } catch(e){
            console.log('Yandex not inited');
        }
    }
}

export const yandex = new Yandex();
