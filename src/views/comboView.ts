import Control from '../control/control';

export class ComboView extends Control{
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
        
        //cellView.node.classList.add('cell__animate');
        //cellView.node.ontransitionend = ()=>{
            /*cellView.node.ontransitionend = null;
            cellView.node.classList.remove('cell__animate');
            cellView.node.style.backgroundColor = '#fff';
            cellView.node.textContent = '';*/
            setTimeout(()=>{
              cellView.node.remove();
            }, 500);
            
            //this.fieldModel.forRemove = this.fieldModel.forRemove.filter(it=> it !== figure);
        //}
      }))
    }
  }