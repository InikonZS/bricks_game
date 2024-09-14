import Control from '../control/control';
import { Stack } from '../bricksCore/stack';

export class StackView extends Control{
    private stackModel:Stack;
    private cellViews: Array<Control>;
    private colors:Array<string>;
  hoverAnimation: Control<HTMLElement>;
  
    constructor (parentNode: HTMLElement, stackModel:Stack, colors:Array<string>, onClick:()=>void){
      let direction = stackModel.direction;
      super(parentNode, 'div', (direction == 2 || direction == 3)?'row stack':'row row__vertical stack stack_vertical');
      
      this.hoverAnimation = new Control(this.node, 'div', 'stack_hover stack_hover' +direction);
      const svg =  `<svg class="sw_wrapper sw_wrapper${direction} stack_arrow" version="1.0" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet">
       <path d="M50 100 L0 50 L45 5 L50 10 L10 50 L50 90 L45 95Z">
     </svg>`;
      this.hoverAnimation.node.innerHTML = svg + svg + svg + svg +svg;
      this.cellViews = [];
      this.stackModel = stackModel;
      this.colors = colors;
  
      this.node.onclick = ()=>{
        onClick();
      }

      stackModel.cells.forEach((jt, j)=>{
        let cellView = new Control(this.node, 'div', 'cell cell__stack');
        //cellView.node.textContent = stackModel.direction.toString();
        //cellView.node.textContent = direction.toString();
        /*cellView.node.onclick = ()=>{
          onClick();
        }*/
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
  
    public update(isAvailable:boolean){
      if (isAvailable){
        this.node.style.pointerEvents = 'none';
      } else {
        this.node.style.pointerEvents = '';
      }
      this.cellViews.forEach((cellView, index)=>{
        const direction = this.stackModel.direction
        const cellIndex = ( direction == 2 || direction == 1 ) ? index : this.stackModel.cells.length - 1 - index
        const cellColor = this.stackModel.cells[cellIndex]
        cellView.node.style.backgroundColor = `var(--cellColor${cellColor + 1})`;//this.colors[cellColor];
        //cellView.node.textContent =['', '\\/', '>', '<', '/\\'  , ][direction];
      });
    }
  }