import Control from '../control/control';

interface ISettings{
    colors: number,
    width: number,
    height: number
  }
  
export class SettingsView extends Control{
    onSubmit: (settings:ISettings)=>void;
  
    constructor(parentNode:HTMLElement){
      super(parentNode, 'div', 'settings_wrapper');
  
      const colorsText = new Control(this.node, 'div', 'option_text', 'colors: ');
      const colors = new Control<HTMLInputElement>(this.node, 'input', 'option_input');
      colors.node.type = 'number';
      colors.node.value = '5';
  
      const sizeXText = new Control(this.node, 'div', 'option_text', 'sizeX: ');
      const sizeX = new Control<HTMLInputElement>(this.node, 'input', 'option_input');
      sizeX.node.type = 'number';
      sizeX.node.value = '10';
      
  
      const sizeYText = new Control(this.node, 'div', 'option_text', 'sizeY: ');
      const sizeY = new Control<HTMLInputElement>(this.node, 'input', 'option_input');
      sizeY.node.type = 'number';
      sizeY.node.value = '6';
  
      const submitText = new Control(this.node, 'div', 'option_text', '');
      const submit = new Control(this.node, 'button', 'option_input option_button', 'New game');
      submit.node.onclick = ()=>{
        this.node.remove();
        this.onSubmit?.({
          colors: colors.node.valueAsNumber,
          width: sizeX.node.valueAsNumber,
          height: sizeY.node.valueAsNumber
        })
      }
    }
  }