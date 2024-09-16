import { Field } from '../bricksCore/field';
import Control from '../control/control';
import hitSound from '../assets/hit.mp3';
import { sound } from './sounds';
import { HintView } from './hintView';
import { IVector2 } from '../bricksCore/IVector2';
import { yandex } from '../platforms/yandex';

export class FieldView extends Control{
    private colors:Array<string>;
    private fieldModel:Field;
    private cells: Array<Array<Control>>;
    backField: Control<HTMLElement>;
    hintView: HintView;
    allowHint: boolean = false; //flag to use monetization for change cell color
    onSetColor: (color: number, position: IVector2)=>void;
  
    constructor (parentNode:HTMLElement, colors:Array<string>, fieldModel:Field){
      super(parentNode, 'div', 'field_main_wrap');
      this.backField = new Control(this.node, 'div', 'field_back');
      for (let i = 0; i<fieldModel.width; i++){
        const rowView = new Control(this.backField.node, 'div', 'row');
        const row: Array<Control> = [];
        for (let j = 0; j< fieldModel.height; j++){
          let cell = new Control(rowView.node, 'div', 'cell cell__field');  
          cell.node.style.backgroundColor = `var(--cellColorEmpty)`;
          cell.node.textContent = '';
          row.push(cell); 
        }
        //this.cells.push(row);
      }

      this.fieldModel = fieldModel;
      this.colors = colors;
      this.cells = [];
      this.hintView = new HintView(this.node, fieldModel.colors);
      for (let i = 0; i<fieldModel.width; i++){
        const rowView = new Control(this.node, 'div', 'row');
        const row: Array<Control> = [];
        for (let j = 0; j< fieldModel.height; j++){
          let cell = new Control(rowView.node, 'div', 'cell cell__field'); 
          cell.node.onclick = ()=>{
            if (!this.allowHint){
              return;
            }
            const selectedCellModel = fieldModel.getCell({x: j, y: i});
            if (selectedCellModel){
              this.hintView.onSelect = (color)=>{
                if (yandex.sdk){
                  yandex.sdk?.adv.showRewardedVideo({callbacks: {
                    onOpen: () => {
                      console.log('Video ad open.');
                    },
                    onRewarded: () => {
                      console.log('Rewarded!');
                      cell.node.animate({
                        transform: ["scale(1, 1)", "scale(1.1, 0.9)", "scale(0.9, 1.1)", "scale(1, 1)"],
                        backgroundColor: [`var(--cellColor${selectedCellModel.color + 1})`, `var(--cellColor${selectedCellModel.color + 1})`, `var(--cellColor${color + 1})`, `var(--cellColor${color + 1})`]
                      }, 500);
                      setTimeout(()=>{
                        this.onSetColor?.(color, {x: j, y: i});
                      }, 500);
                    },
                    onClose: () => {
                      console.log('Video ad closed.');
                    },
                    onError: (e) => {
                      console.log('Error while open video ad:', e);
                    }
                  }});
                } else {
                  //local platform fallback
                  cell.node.animate({
                    transform: ["scale(1, 1)", "scale(1.1, 0.9)", "scale(0.9, 1.1)", "scale(1, 1)"],
                    backgroundColor: [`var(--cellColor${selectedCellModel.color + 1})`, `var(--cellColor${selectedCellModel.color + 1})`, `var(--cellColor${color + 1})`, `var(--cellColor${color + 1})`]
                  }, 500)
                  setTimeout(()=>{
                    this.onSetColor?.(color, {x: j, y: i});
                  }, 500);
                }
              }
              this.hintView.show();
            }
          } 
          row.push(cell); 
        }
        this.cells.push(row);
      }
    }
  
    public update(){
      this.cells.forEach(it=>it.forEach(cellView=>{
        cellView.node.style.backgroundColor = `var(--cellColorEmpty)`;
        cellView.node.style.zIndex = '0';
        cellView.node.textContent = '';
      }));
  
      this.fieldModel.cells.forEach(cell=>{
        const cellView = this.cells[cell.position.y][cell.position.x];
        if (cell.isMoving && !cell.isStopped){
          let amount = -100;
          const dir = ['(0, 0)',  `(0, ${amount}%)`,`(${amount}%, 0)`, `(${-amount}%, 0)`, `(0, ${-amount}%)`][cell.direction];
          //cellView.node.animate({transform: ["translate(0, 0)", "translate"+dir]}, 100);
          cellView.node.animate({transform: ["translate"+dir, "translate(0, 0)"]}, 100);
          cellView.node.style.zIndex = '1';
        }
        if (cell.isStopped){
          //const closestCells:Array<Control<HTMLElement>> = [];
          const radius = 3;
          for (let i=-radius; i<radius+1; i++){
            for (let j=-radius; j<radius+1; j++){
              const closeView = this.cells[i+cell.position.y]?.[j+cell.position.x];
              const closeCell = this.fieldModel.getCell({x: j+cell.position.x, y: i+cell.position.y});
              if (closeView && closeCell){
                //closestCells.push(closeView);
                let dist = Math.hypot(i, j)*1.5;
                if (closeCell.position.x == cell.getNextPosition().x && closeCell.position.y == cell.getNextPosition().y){
                  dist = 1;
                }
                if (closeCell == cell){
                  dist = 1;
                }
                let amount = 10 / dist;
                const dir = ['(0, 0)',  `(0, ${amount}px)`,`(${amount}px, 0)`, `(${-amount}px, 0)`, `(0, ${-amount}px)`][cell.direction];
                amount = -5 / dist;
                const dir2 = ['(0, 0)',  `(0, ${amount}px)`,`(${amount}px, 0)`, `(${-amount}px, 0)`, `(0, ${-amount}px)`][cell.direction];
                closeView.node.animate({
                  transform: ["translate(0, 0)", "translate"+dir, "translate(0, 0)", "translate"+dir2, "translate(0, 0)"],
                  offset: [0, 0.25, 0.5, 0.75]
                }, 200)
                
              }
            }
          };
          sound.play('hit');
        }
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