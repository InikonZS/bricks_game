import Control from '../../control/control';
import { localize } from '../../localization/localization';
import './scoreBlock.css';

export class ScoreBlock extends Control {
    scoreLabel: Control<HTMLElement>;
    movesLabel: Control<HTMLElement>;
    lastData: any;
    
    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'score_block');

        this.scoreLabel = new Control(this.node, 'div', 'score_label');
        this.movesLabel = new Control(this.node, 'div', 'score_label');
        this.updateLocalize = this.updateLocalize.bind(this);
        localize.onChange.add(this.updateLocalize);
        this.updateLocalize();
    }

    updateLocalize() {
        const data = this.lastData || {};
        this.scoreLabel.node.textContent = localize.currentLang['score'] + ': ' + (data.score || 0);
        this.movesLabel.node.textContent = localize.currentLang['moves'] + ': ' + (data.moves || 0);
    }

    destroy(): void {
        localize.onChange.remove(this.updateLocalize);
        super.destroy();
    }

    update(data: any) {
        this.lastData = data;
        this.updateLocalize();
    }
}