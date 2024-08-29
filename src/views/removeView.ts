import { IVector2 } from '../bricksCore/IVector2';
import Control from '../control/control';

export class RemoveView extends Control{
    static animationsCount = 3;
    animations: (() => void)[];

    constructor(parentNode:HTMLElement, position:IVector2, color:number){
      super(parentNode, 'div', 'cell remove_cell');
      this.node.style.left = `calc(${position.x} * (var(--cellSize) + 0px))`;
      this.node.style.top = `calc(${position.y} * (var(--cellSize) + 0px))`;
      this.node.style.backgroundColor = `var(--cellColor${color + 1})`;
      this.animations = [this.animate3, this.animate1, this.animate2];
    }

    animate(type?:number){
      const animation = this.animations[type == undefined ? Math.floor(Math.random()* this.animations.length) : type];
      animation.call(this);
    }
  
    animate1(){
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

    animate2(){
      const cellView = this;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        
        cellView.node.classList.add('cell__animate2');
        cellView.node.onanimationend = ()=>{
            cellView.node.ontransitionend = null;
            cellView.node.classList.remove('cell__animate2');
            cellView.node.style.backgroundColor = `var(--cellColorEmpty)`;
            cellView.node.textContent = '';
            cellView.node.remove();
        }
      }))
    }

    animate3(){
      const cellView = this;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        
        cellView.node.classList.add('cell__animate3');
        cellView.node.style.transform = `rotate(${Math.random()*30}deg) scale(2) translate(${Math.random()*500 - 250}%, ${Math.random()*500 - 250}%) rotate(${Math.random()*30}deg)`;
        cellView.node.ontransitionend = ()=>{
            cellView.node.ontransitionend = null;
            cellView.node.classList.remove('cell__animate3');
            cellView.node.style.backgroundColor = `var(--cellColorEmpty)`;
            cellView.node.textContent = '';
            cellView.node.remove();
            //this.fieldModel.forRemove = this.fieldModel.forRemove.filter(it=> it !== figure);
        }
      }))
    }
  }
  
 