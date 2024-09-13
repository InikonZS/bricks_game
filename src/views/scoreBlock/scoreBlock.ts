import Control from '../../control/control';
import './scoreBlock.css';

export class ScoreBlock extends Control {
    scoreLabel: Control<HTMLElement>;
    movesLabel: Control<HTMLElement>;
    constructor(parentNode: HTMLElement){
        super(parentNode, 'div', 'score_block');

        this.scoreLabel = new Control(this.node, 'div', 'score_label');
        this.movesLabel = new Control(this.node, 'div', 'score_label');
    }

    update(data: any){
        this.scoreLabel.node.textContent = 'score: '+ (data.score || 0);
        this.movesLabel.node.textContent = 'moves: '+ (data.moves || 0);
    }
}