import { defineComponent } from 'bitecs';
import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
	start() {
		console.log('Hello!', defineComponent);
	}

	update(deltaTime: number) {}
}
