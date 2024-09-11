class Yandex{
    public sdk: any;
    
    constructor(){

    }

    private async loadSdk() {
        return new Promise<void>((resolve, reject)=>{
            var s = document.createElement('script');
            s.src = "https://sdk.games.s3.yandex.net/sdk.js";
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
