import { Game } from './bricksCore/core';
import Control from './control/control';
import './index.css';

class BricksView extends Control{
  constructor (parentNode: HTMLElement, game:Game){
    super(parentNode, 'div', 'grid_wrapper');

    const gridZones:Array<Control> = [];
    for (let i =0; i< 9; i++){
      gridZones.push(new Control(this.node, 'div', 'grid_zone'));
    }

    for (let direction = 1; direction<=4; direction++){
      const stackView = new Control(gridZones[[1, 3, 5, 7][direction -1 ]].node, 'div', (direction == 1 || direction == 4)?'row':'row row__vertical');
      game.stackList.stacks.forEach((it, i)=>{
        //console.log(it.direction);
        if (it.direction == direction){
          let stacker = new Control(stackView.node, 'div', (direction == 2 || direction == 3)?'row':'row row__vertical');
          
          it.cells.forEach((jt, j)=>{

          
            let cellView = new Control(stacker.node, 'div', 'cell');
            cellView.node.textContent = it.direction.toString();
            cellView.node.onclick = ()=>{
              game.move(i);
              game.processMove();
              document.querySelector('#app').innerHTML='';
              new BricksView(document.querySelector('#app'), game);
            }

            cellView.node.onmouseover = ()=>{
              cells[it.initialPosition.y][it.initialPosition.x].node.style.borderWidth = '3px';
            }
            cellView.node.onmouseout = ()=>{
              cells[it.initialPosition.y][it.initialPosition.x].node.style.borderWidth = '';
            }

            cellView.node.style.backgroundColor = ['#f99', '#9f9', '#99f', '#f9f'][it.cells[(direction == 2 || direction == 1) ? j : it.cells.length-1 - j]];
          });
        }
      });
    }
    

    const cells: Array<Array<Control>> = [];
    const fieldView = new Control(gridZones[4].node);
    for (let i = 0; i<10; i++){
      const rowView = new Control(fieldView.node, 'div', 'row');
      const row: Array<Control> = [];
      for (let j = 0; j< 10; j++){
        let cell = new Control(rowView.node, 'div', 'cell');  
        row.push(cell); 
      }
      cells.push(row);
    }

    game.field.cells.forEach(cell=>{
      const cellView = cells[cell.position.y][cell.position.x];
      cellView.node.style.backgroundColor = ['#f99', '#9f9', '#99f', '#f9f'][cell.color];
      cellView.node.textContent = cell.direction.toString();
    });
  }
}

const game = new Game(10, 10, 3);

new BricksView(document.querySelector('#app'), game);

(window as any).app = game;
console.log("App started");
