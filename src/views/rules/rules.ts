import Control from '../../control/control';
import contentExamples from './rulesExamples.html';
import contentTextsRu from './rulesTexts-ru.html';
import contentTextsEn from './rulesTexts-en.html';
import './rules.css';
import { localize } from '../../localization/localization';

export class RulesView extends Control {
    onClose: () => void;
    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'rules_view');
        const center = new Control(this.node, 'div', 'rules_center');
        const contentContainer = new Control(center.node, 'div', 'rules_content_container scroll');
        contentContainer.node.innerHTML = {ru: contentTextsRu, en: contentTextsEn}[localize.currentLangName] + contentExamples;
        const buttonsContainer = new Control(center.node, 'div', 'rules_buttons');
        const closeButton = new Control(buttonsContainer.node, 'button', 'option_button rules_close', localize.currentLang['close']);
        closeButton.node.onclick = ()=>{
            this.close();
        }
    }

    animate() {
        requestAnimationFrame(() => requestAnimationFrame(() => {
            this.node.classList.add('rules_view_animate');
        }))
    }

    close() {
        this.node.remove();
        this.onClose?.();
    };
}