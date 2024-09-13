import Control from '../control/control';
import { levelGenerators } from '../bricksCore/levels';
import { MainAnimation } from './mainAnimation';

export class MainMenu extends Control{
    onSubmit: (selected:string, data:any)=>void;
  
    constructor(parentNode:HTMLElement){
      super(parentNode, 'div', 'settings_wrapper main_menu');
      const logo = new Control(this.node, 'div', 'bricks_logo', 'Bricks');

      const customGame = new Control(this.node, 'button', 'option_input option_button', 'custom game');
      customGame.node.onclick = ()=>{
        this.onSubmit('custom', null);
      }
  
      const loadGame = new Control(this.node, 'button', 'option_input option_button', 'load game');
      loadGame.node.onclick = ()=>{
        this.onSubmit('load', null);
      }

      const rulesButton = new Control(this.node, 'button', 'option_input option_button', 'how to play');
      rulesButton.node.onclick = ()=>{
        this.onSubmit('rules', null);
      }
  
      const levelContainer = new Control(this.node, 'div', 'level_container');
      levelGenerators.forEach((levelGenerator, index)=>{
        const levelButton = new Control(levelContainer.node, 'button', 'level_button', index.toString());
        levelButton.node.onclick = ()=>{
          this.onSubmit('level', index)
        }
      });

      const backAnimation = new MainAnimation(this.node);
    }
  }