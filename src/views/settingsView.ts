import Control from '../control/control';
import {generateFourTemplate, generateSimpleTemplate, generateTemplate} from '../bricksCore/template';

interface ISettings{
    colors: number,
    width: number,
    height: number,
    template: Array<Array<number>>
  }
  
export class SettingsView extends Control{
    onSubmit: (settings:ISettings)=>void;
    onBack: ()=>void;
  lastTemplate: any[][];
  
    constructor(parentNode:HTMLElement){
      super(parentNode, 'div', 'settings_wrapper');

      const countText = new Control(this.node, 'div', 'option_text', 'count: ');
      const count = new Control<HTMLInputElement>(this.node, 'input', 'option_input');
      count.node.type = 'number';
      count.node.value = '10';
  
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
  
      const back = new Control(this.node, 'button', 'option_input option_button', 'Back');
      back.node.onclick = ()=>{
        this.node.remove();
        this.onBack?.();
      }
      const previewField= new Control(this.node, 'div', '');
      const preview= new Control(this.node, 'button', 'option_input option_button', 'Preview');
      let generator = generateSimpleTemplate;
      if (count.node.valueAsNumber  % 2 ==0){
        generator = generateTemplate;
      }
      if (count.node.valueAsNumber  % 4 ==0){
        generator = generateFourTemplate;
      }
      this.lastTemplate = generator(count.node.valueAsNumber);
      preview.node.onclick = ()=>{
        generator = generateSimpleTemplate;
        if (count.node.valueAsNumber  % 2 ==0){
          generator = generateTemplate;
        }
        if (count.node.valueAsNumber  % 4 ==0){
          generator = generateFourTemplate;
        }
        this.lastTemplate = generator(count.node.valueAsNumber);
        previewField.node.textContent ='';
        const data = {
          colors: colors.node.valueAsNumber,
          width: sizeX.node.valueAsNumber,
          height: sizeY.node.valueAsNumber,
          template: this.lastTemplate
        }

        const centerPoint = {x: Math.floor((data.width - data.template[0].length) / 2), y: Math.floor((data.height - data.template.length) / 2)};
        for (let i = 0; i<data.height; i++){
          const rowView = new Control(previewField.node, 'div', 'row');
          const row: Array<Control> = [];
          for (let j = 0; j< data.width; j++){
            let cell = new Control(rowView.node, 'div', 'cell cell__field');  
            //row.push(cell); 
            const color = Math.floor(Math.random()*data.colors+1);
            cell.node.style.backgroundColor = data.template[i-centerPoint.y]?.[j-centerPoint.x] ? `var(--cellColor${color + 1})` : `var(--cellColorEmpty)`
          }
          //this.cells.push(row);
        }
      }

      const submitText = new Control(this.node, 'div', 'option_text', '');
      const submit = new Control(this.node, 'button', 'option_input option_button', 'New game');
      submit.node.onclick = ()=>{
        this.node.remove();
        this.onSubmit?.({
          colors: colors.node.valueAsNumber,
          width: sizeX.node.valueAsNumber,
          height: sizeY.node.valueAsNumber,
          template: this.lastTemplate //|| generator(count.node.valueAsNumber)
        })
      }
    }
  }