import Control from '../control/control';
import { localize } from '../localization/localization';

export class ComboView extends Control{
    onClose: ()=>void;
    constructor(parentNode:HTMLElement, combo: number){
      super(parentNode, 'div', 'combo_view', 'Combo: '+ combo);
      //this.node.style.left = '0';
      //.node.style.top =  '0';
      //this.node.style.fontSize = ``;
      //this.node.style.backgroundColor = color;
    }
  
    animate(){
      const cellView = this;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{

        cellView.node.classList.add('combo_animation1');
        //cellView.node.ontransitionend = ()=>{
            /*cellView.node.ontransitionend = null;
            cellView.node.classList.remove('cell__animate');
            cellView.node.style.backgroundColor = '#fff';
            cellView.node.textContent = '';*/
            setTimeout(()=>{
              cellView.node.remove();
              this.onClose?.();
            }, 1000);
            
            //this.fieldModel.forRemove = this.fieldModel.forRemove.filter(it=> it !== figure);
        //}
      }))
    }
  }