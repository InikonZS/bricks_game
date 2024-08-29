import Control from '../control/control';

export class PauseMenu extends Control{
    onSubmit: (selected:'continue' | 'restart' | 'save' | 'menu')=>void;
  
    constructor(parentNode:HTMLElement){
      super(parentNode, 'div', 'settings_wrapper');
      const continueButton = new Control(this.node, 'button', 'option_input option_button', 'continue');
      continueButton.node.onclick = ()=>{
        this.onSubmit('continue');
      }
  
      const restart = new Control(this.node, 'button', 'option_input option_button', 'restart');
      restart.node.onclick = ()=>{
        this.onSubmit('restart');
      }
  
  
      const saveGame = new Control(this.node, 'button', 'option_input option_button', 'save game');
      saveGame.node.onclick = ()=>{
        this.onSubmit('save');
      }
  
      const mainMenu = new Control(this.node, 'button', 'option_input option_button', 'main menu');
      mainMenu.node.onclick = ()=>{
        this.onSubmit('menu');
      }
    }
  }