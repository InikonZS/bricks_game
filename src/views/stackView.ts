import Control from '../control/control';
import { Stack } from '../bricksCore/stack';

export class StackView extends Control{
    private stackModel:Stack;
    private cellViews: Array<Control>;
    private colors:Array<string>;
  
    constructor (parentNode: HTMLElement, stackModel:Stack, colors:Array<string>, onClick:()=>void){
      let direction = stackModel.direction;
      super(parentNode, 'div', (direction == 2 || direction == 3)?'row':'row row__vertical');
      
      this.cellViews = [];
      this.stackModel = stackModel;
      this.colors = colors;
  
      stackModel.cells.forEach((jt, j)=>{
        let cellView = new Control(this.node, 'div', 'cell cell__stack');
        //cellView.node.textContent = stackModel.direction.toString();
        //cellView.node.textContent = direction.toString();
        cellView.node.onclick = ()=>{
          onClick();
        }
        this.cellViews.push(cellView);
  
        /*cellView.node.onmouseover = ()=>{
          cells[it.initialPosition.y][it.initialPosition.x].node.style.borderWidth = '3px';
        }
        cellView.node.onmouseout = ()=>{
          cells[it.initialPosition.y][it.initialPosition.x].node.style.borderWidth = '';
        }*/
  
        
      });  
  
      //this.update();
    }
  
    public update(){
      this.cellViews.forEach((cellView, index)=>{
        const direction = this.stackModel.direction
        const cellIndex = ( direction == 2 || direction == 1 ) ? index : this.stackModel.cells.length - 1 - index
        const cellColor = this.stackModel.cells[cellIndex]
        cellView.node.style.backgroundColor = `var(--cellColor${cellColor + 1})`;//this.colors[cellColor];
        //cellView.node.textContent =['', '\\/', '>', '<', '/\\'  , ][direction];
      });
    }
  }