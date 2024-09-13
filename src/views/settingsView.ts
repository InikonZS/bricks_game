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
  count: Control<HTMLInputElement>;
  colors: Control<HTMLInputElement>;
  sizeAuto: Control<HTMLInputElement>;
  sizeX: Control<HTMLInputElement>;
  sizeY: Control<HTMLInputElement>;
  previewField: Control<HTMLElement>;
  
    constructor(parentNode:HTMLElement){
      super(parentNode, 'div', 'settings_wrapper');

      const countColorLine = new Control(this.node, 'div', 'option_line');

      const countBlock = new Control(countColorLine.node, 'div', 'option_block');
      const countText = new Control(countBlock.node, 'div', 'option_text', 'count: ');
      const count = new Control<HTMLInputElement>(countBlock.node, 'input', 'option_input');
      count.node.oninput = ()=>{
        this.refreshPreview();
      }
      this.count = count;
      count.node.type = 'number';
      count.node.value = '10';
      count.node.step = '1';
      count.node.min = '1';
      count.node.max = '200';
  
      const colorsBlock = new Control(countColorLine.node, 'div', 'option_block');
      const colorsText = new Control(colorsBlock.node, 'div', 'option_text', 'colors: ');
      const colors = new Control<HTMLInputElement>(colorsBlock.node, 'input', 'option_input');
      colors.node.oninput = ()=>{
        this.refreshPreview(true);
      }
      this.colors = colors;
      colors.node.type = 'number';
      colors.node.value = '5';
      colors.node.step = '1';
      colors.node.min = '2';
      colors.node.max = '10';
  
      const sizeLine = new Control(this.node, 'div', 'option_line');

      const sizeAutoBlock = new Control(sizeLine.node, 'div', 'option_block');
      sizeAutoBlock.node.style.width = 'fit-content';
      const sizeAutoText = new Control(sizeAutoBlock.node, 'div', 'option_text', 'Auto');
      const sizeAuto = new Control<HTMLInputElement>(sizeAutoBlock.node, 'input', 'option_input');
      this.sizeAuto = sizeAuto;
      sizeAuto.node.type = 'checkbox';
      sizeAuto.node.checked = true;

      const sizeXBlock = new Control(sizeLine.node, 'div', 'option_block');
      const sizeXText = new Control(sizeXBlock.node, 'div', 'option_text', 'sizeX: ');
      const sizeX = new Control<HTMLInputElement>(sizeXBlock.node, 'input', 'option_input');
      this.sizeX = sizeX;
      sizeX.node.type = 'number';
      sizeX.node.value = '10';
  
      const sizeYBlock = new Control(sizeLine.node, 'div', 'option_block');
      const sizeYText = new Control(sizeYBlock.node, 'div', 'option_text', 'sizeY: ');
      const sizeY = new Control<HTMLInputElement>(sizeYBlock.node, 'input', 'option_input');
      this.sizeY = sizeY;
      sizeY.node.type = 'number';
      sizeY.node.value = '6';

      this.previewField= new Control(this.node, 'div', 'option_field');

      const buttonsLine = new Control(this.node, 'div', 'option_line');

      const back = new Control(buttonsLine.node, 'button', 'option_input option_button', 'Back');
      back.node.onclick = ()=>{
        this.node.remove();
        this.onBack?.();
      }
      
      const preview= new Control(buttonsLine.node, 'button', 'option_input option_button', 'Regenerate');
      preview.node.onclick = ()=>{
        this.refreshPreview();
      }
      /*let generator = generateSimpleTemplate;
      if (count.node.valueAsNumber  % 2 ==0){
        generator = generateTemplate;
      }
      if (count.node.valueAsNumber  % 4 ==0){
        generator = generateFourTemplate;
      }
      this.lastTemplate = generator(count.node.valueAsNumber);
      preview.node.onclick = ()=>{
        this.refreshPreview();
      }*/

      //const submitText = new Control(this.node, 'div', 'option_text', '');
      const submit = new Control(buttonsLine.node, 'button', 'option_input option_button', 'Start game');
      submit.node.onclick = ()=>{
        this.node.remove();
        this.onSubmit?.({
          colors: colors.node.valueAsNumber,
          width: sizeAuto.node.checked ? this.lastTemplate[0].length + 6 : sizeX.node.valueAsNumber,
          height: sizeAuto.node.checked ? this.lastTemplate.length + 6 : sizeY.node.valueAsNumber,
          template: this.lastTemplate //|| generator(count.node.valueAsNumber)
        })
      }

      this.refreshPreview();
    }

    refreshPreview(noGen?:boolean){
      let generator = generateSimpleTemplate;
      if (this.count.node.valueAsNumber  % 2 ==0){
        generator = generateTemplate;
      }
      if (this.count.node.valueAsNumber  % 4 ==0){
        generator = generateFourTemplate;
      }
      if (!noGen || !this.lastTemplate){
        this.lastTemplate = generator(this.count.node.valueAsNumber);
      }
      this.previewField.node.textContent ='';
      const cellSize = 300 / (this.lastTemplate.length + 6);
      this.previewField.node.style.setProperty('--cellSize', cellSize+'px');
      const data = {
        colors: this.colors.node.valueAsNumber,
        width: this.sizeAuto.node.checked ? this.lastTemplate[0].length + 6 : this.sizeX.node.valueAsNumber,
        height: this.sizeAuto.node.checked ? this.lastTemplate.length + 6 : this.sizeY.node.valueAsNumber,
        template: this.lastTemplate
      }

      const centerPoint = {x: Math.floor((data.width - data.template[0].length) / 2), y: Math.floor((data.height - data.template.length) / 2)};
      for (let i = 0; i<data.height; i++){
        const rowView = new Control(this.previewField.node, 'div', 'row');
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
}