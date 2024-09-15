import { Game, IGameData} from './bricksCore/core';
import { BricksView } from './views/bricksView';
import { SettingsView } from './views/settingsView';
import { MainMenu } from './views/mainMenu';
import { levelGenerators } from './bricksCore/levels';
import { yandex } from './platforms/yandex';
import { RulesView } from './views/rules/rules'; 
import { Localization, localize } from './localization/localization';
import './index.css';
import './views/range.css';

let disposeLocalize: ()=>void;

function startGame(){
  const localizeHandler = ()=>{
    console.log('translated main to '+localize.currentLangName);
  }
  disposeLocalize?.();
  disposeLocalize = ()=>{
    localize.onChange.remove(localizeHandler);
  }
  localize.onChange.add(localizeHandler);

  const root = document.querySelector<HTMLElement>('#app');
  const mainMenu = new MainMenu(root);
  mainMenu.onSubmit = ((selected, data)=>{
    if (selected == 'load'){
      const saved = localStorage.getItem('saved');
      if (saved){
        const parsed = JSON.parse(saved);
        loadGame(parsed);
        mainMenu.destroy();
      }
      //loadGame();
    } else if (selected == 'custom'){
      mainMenu.destroy();
      const settingsView = new SettingsView(root);
      settingsView.onBack=()=>{
        settingsView.destroy();
        startGame();
      }
      settingsView.onSubmit = (settings)=>{
        //const game = new Game(3, Game.generate(6, 10, 5));//Game.generate(6, 10, 2, 3);
        const generated = Game.generateByTemplate(settings.height, settings.width, settings.colors, settings.template);//Game.generateRandom(settings.height, settings.width, settings.colors, 15);
        const startWithGenerated = ()=>{
          const game = new Game(3, generated);//Game.generate(6, 10, 2, 3);
          const view = new BricksView(root, game);

          (window as any).app = game;
          view.onFinish = (result)=>{
            if (result == 'mainMenu'){
              view.destroy();
              startGame()
            } else if (result == 'restart'){
              view.destroy();
              startWithGenerated()
            } else if (result == 'completed'){
              view.destroy();
              startGame()
            }
            
          }
        }
        startWithGenerated();
        
      }
    } else if (selected == 'level'){
      const li:number = data;
      mainMenu.destroy();
        //const game = new Game(3, Game.generate(6, 10, 5));//Game.generate(6, 10, 2, 3);
        const generated = levelGenerators[li]();//Game.generate(settings.height, settings.width, settings.colors, 15);
        const startWithGenerated = ()=>{
          const game = new Game(3, generated);//Game.generate(6, 10, 2, 3);
          const view = new BricksView(root, game);

          (window as any).app = game;
          view.onFinish = (result)=>{
            if (result == 'mainMenu'){
              view.destroy();
              startGame()
            } else if (result == 'restart'){
              view.destroy();
              startWithGenerated()
            } else if (result == 'completed'){
              view.destroy();
              startGame()
            }
            
          }
        }
        startWithGenerated();     
      
    } else if (selected == 'rules'){
      //mainMenu.destroy();
      console.log('rul')
      const rulesView = new RulesView(root);
     // rulesView.
    }
  })
    
  localizeHandler();
}

function loadGame(data:IGameData){
  const game = new Game(3, data)//Game.load(data);
  const view = new BricksView(document.querySelector('#app'), game);
  (window as any).app = game;
  view.onFinish = ()=>{
    view.destroy();
    startGame()
  }
}
/*const loadBtn = new Control(document.body, 'button', '', 'load');
loadBtn.node.onclick = ()=>{
  //@ts-ignore
  loadGame(window.saved);
}*/

yandex.init().then(()=>{
  yandex.sdk?.features.LoadingAPI.ready();
  console.log("App started");
  startGame();
});

