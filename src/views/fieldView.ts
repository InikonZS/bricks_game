import { Field } from '../bricksCore/field';
import Control from '../control/control';

export class FieldView extends Control{
    private colors:Array<string>;
    private fieldModel:Field;
    private cells: Array<Array<Control>>;
  
    constructor (parentNode:HTMLElement, colors:Array<string>, fieldModel:Field){
      super(parentNode, 'div', '');
      this.fieldModel = fieldModel;
      this.colors = colors;
      this.cells = [];
      for (let i = 0; i<fieldModel.width; i++){
        const rowView = new Control(this.node, 'div', 'row');
        const row: Array<Control> = [];
        for (let j = 0; j< fieldModel.height; j++){
          let cell = new Control(rowView.node, 'div', 'cell cell__field');  
          row.push(cell); 
        }
        this.cells.push(row);
      }
    }
  
    public update(){
      this.cells.forEach(it=>it.forEach(cellView=>{
        cellView.node.style.backgroundColor = `var(--cellColorEmpty)`;
        cellView.node.textContent = '';
      }));
  
      this.fieldModel.cells.forEach(cell=>{
        const cellView = this.cells[cell.position.y][cell.position.x];
        cellView.node.style.backgroundColor = `var(--cellColor${cell.color + 1})`//this.colors[cell.color];
        cellView.node.innerHTML = `<svg class="sw_wrapper sw_wrapper${cell.direction}" version="1.0" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet">
         <path fill="#000" d="M50 100 L0 50 L45 5 L50 10 L10 50 L50 90 L45 95Z">
       </svg>`
       // cellView.node.textContent = ['', '\\/', '>', '<', '/\\'  , ][cell.direction];
      }); 
  
      /*this.fieldModel.forRemove.forEach(figure=>{
        figure.forEach(cell=>{
          const cellView = this.cells[cell.position.y][cell.position.x];
          cellView.node.style.backgroundColor = this.colors[cell.color];
          cellView.node.classList.add('cell__animate');
          cellView.node.ontransitionend = ()=>{
              cellView.node.ontransitionend = null;
              cellView.node.classList.remove('cell__animate');
              cellView.node.style.backgroundColor = '#fff';
              cellView.node.textContent = '';
              this.fieldModel.forRemove = this.fieldModel.forRemove.filter(it=> it !== figure);
          }
        })
      });*/
    }
  }