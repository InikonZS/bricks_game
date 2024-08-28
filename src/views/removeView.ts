import { IVector2 } from '../bricksCore/IVector2';
import Control from '../control/control';

export class RemoveView extends Control{
    constructor(parentNode:HTMLElement, position:IVector2, color:number){
      super(parentNode, 'div', 'cell remove_cell');
      this.node.style.left = `calc(${position.x} * (var(--cellSize) + 0px))`;
      this.node.style.top = `calc(${position.y} * (var(--cellSize) + 0px))`;
      this.node.style.backgroundColor = `var(--cellColor${color + 1})`;
    }
  
    animate(){
      const cellView = this;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        
        cellView.node.classList.add('cell__animate');
        cellView.node.ontransitionend = ()=>{
            cellView.node.ontransitionend = null;
            cellView.node.classList.remove('cell__animate');
            cellView.node.style.backgroundColor = `var(--cellColorEmpty)`;
            cellView.node.textContent = '';
            cellView.node.remove();
            //this.fieldModel.forRemove = this.fieldModel.forRemove.filter(it=> it !== figure);
        }
      }))
    }
  }
  
 