import Control from '../control/control';
import { localize } from '../localization/localization';

export class PauseMenu extends Control{
    onSubmit: (selected:'continue' | 'restart' | 'save' | 'menu')=>void;
    continueButton: Control<HTMLElement>;
    restart: Control<HTMLElement>;
    saveGame: Control<HTMLElement>;
    mainMenu: Control<HTMLElement>;
  
    constructor(parentNode:HTMLElement){
      super(parentNode, 'div', 'settings_wrapper');
      this.continueButton = new Control(this.node, 'button', 'option_input option_button', 'continue');
      this.continueButton.node.onclick = ()=>{
        this.onSubmit('continue');
      }
  
      this.restart = new Control(this.node, 'button', 'option_input option_button', 'restart');
      this.restart.node.onclick = ()=>{
        this.onSubmit('restart');
      }
  
  
      this.saveGame = new Control(this.node, 'button', 'option_input option_button', 'save game');
      this.saveGame.node.onclick = ()=>{
        this.onSubmit('save');
      }
  
      this.mainMenu = new Control(this.node, 'button', 'option_input option_button', 'main menu');
      this.mainMenu.node.onclick = ()=>{
        this.onSubmit('menu');
      }
      
      this.updateLocalize = this.updateLocalize.bind(this);
      localize.onChange.add(this.updateLocalize);
      this.updateLocalize();
    }

    updateLocalize(){
      this.continueButton.node.textContent = localize.currentLang['continue'];
      this.restart.node.textContent = localize.currentLang['restart'];
      this.saveGame.node.textContent = localize.currentLang['saveGame'];
      this.mainMenu.node.textContent = localize.currentLang['mainMenu'];
    }

    destroy(): void {
      localize.onChange.remove(this.updateLocalize);
      super.destroy();
    }
  }