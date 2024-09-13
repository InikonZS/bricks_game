import Control from '../control/control';
import { levelGenerators } from '../bricksCore/levels';
import { MainAnimation } from './mainAnimation';
import { localize } from '../localization/localization';

export class MainMenu extends Control{
    onSubmit: (selected:string, data:any)=>void;
  customGame: Control<HTMLElement>;
  loadGame: Control<HTMLElement>;
  rulesButton: Control<HTMLElement>;
  levelContainerTitle: Control<HTMLElement>;
  langSelectButton: Control<HTMLElement>;
  
    constructor(parentNode:HTMLElement){
      super(parentNode, 'div', 'settings_wrapper main_menu');
      const logo = new Control(this.node, 'div', 'bricks_logo', 'Bricks');

      this.customGame = new Control(this.node, 'button', 'option_input option_button', 'custom game');
      this.customGame.node.onclick = ()=>{
        this.onSubmit('custom', null);
      }
  
      this.loadGame = new Control(this.node, 'button', 'option_input option_button', 'load game');
      this.loadGame.node.onclick = ()=>{
        this.onSubmit('load', null);
      }

      this.rulesButton = new Control(this.node, 'button', 'option_input option_button', 'how to play');
      this.rulesButton.node.onclick = ()=>{
        this.onSubmit('rules', null);
      }

      this.langSelectButton = new Control(this.node, 'button', 'option_input option_button', 'change lang');
      this.langSelectButton.node.onclick = ()=>{
        localize.setLang();
      }
  
      const levelSelectBlock = new Control(this.node, 'div', 'level_select_block');
      this.levelContainerTitle = new Control(levelSelectBlock.node, 'div', 'level_container_title', 'Select ready level:');
      const levelContainer = new Control(levelSelectBlock.node, 'div', 'level_container');
      levelGenerators.forEach((levelGenerator, index)=>{
        const levelButton = new Control(levelContainer.node, 'button', 'level_button', index.toString());
        levelButton.node.onclick = ()=>{
          this.onSubmit('level', index)
        }
      });

      const backAnimation = new MainAnimation(this.node);

      this.updateLocalize = this.updateLocalize.bind(this);
      localize.onChange.add(this.updateLocalize);
      this.updateLocalize();
    }

    updateLocalize(){
      this.levelContainerTitle.node.textContent = localize.currentLang['levelContainerTitle'];
      this.customGame.node.textContent = localize.currentLang['customGame'];
      this.langSelectButton.node.textContent = localize.currentLang['langSelectButton'];
      this.loadGame.node.textContent = localize.currentLang['loadGame'];
      this.rulesButton.node.textContent = localize.currentLang['howToPlay'];
    }

    destroy(): void {
      localize.onChange.remove(this.updateLocalize);
      super.destroy();
    }
  }