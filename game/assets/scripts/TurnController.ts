import Engine from '@underrealm/murg';
import {
	_decorator,
	Button,
	CCInteger,
	Color,
	Component,
	Label,
	Node,
} from 'cc';

import { setCursor } from './util/helper';
import { playEffectSound } from './util/resources';
import { system } from './util/system';
import { sendEndTurn } from './network';
import { animateFade, animateSwapLabel } from './tween';

const { DuelPhases } = Engine;

const { ccclass, property } = _decorator;
const NodeEvents = Node.EventType;
const ButtonEvents = Button.EventType;

@ccclass('TurnController')
export class TurnController extends Component {
	unSubscribers: (() => void)[] = [];
	playerTurnGlow: Node;
	enemyTurnGlow: Node;
	turnLabel: Node;
	orb: Node;
	countdown: () => void;
	@property(Label) labelCountdown: Label = null!;
	@property(CCInteger) turnMaxTime: number = 0;

	start(): void {
		this.playerTurnGlow = this.node.getChildByPath('Orb/Player Glow');
		this.enemyTurnGlow = this.node.getChildByPath('Orb/Enemy Glow');
		this.turnLabel = this.node.getChildByPath('Orb/Button/Label');
		this.orb = this.node.getChildByPath('Orb');

		this.orb.on(NodeEvents.MOUSE_ENTER, this.onMouseEnter.bind(this));
		this.orb.on(NodeEvents.MOUSE_LEAVE, this.onMouseLeave.bind(this));
		this.orb.on(ButtonEvents.CLICK, this.onButtonClick.bind(this));

		this.unSubscribers.push(
			system.duel.subscribe('phase', (phase) =>
				this.onPhaseChange(phase, system.duel.phaseOf),
			),
		);

		this.unSubscribers.push(
			system.duel.subscribe('phaseOf', (phaseOf) =>
				this.onPhaseChange(system.duel.phase, phaseOf),
			),
		);
	}

	onDestroy(): void {
		this.unSubscribers.forEach((unSub) => unSub());
	}

	onPhaseChange(phase: string, phaseOf: string): void {
		const isSetupPhase = phase === DuelPhases.Setup;
		const isMyPhase = phaseOf === system.playerIds.me;
		const button = this.orb.getComponent(Button);
		const color = Color.fromHEX(new Color(), isMyPhase ? '#4da7ea' : '#ee5846');
		const white = Color.fromHEX(new Color(), '#ffffff');

		if (isSetupPhase) {
			button.interactable = true;
			animateFade(this.playerTurnGlow, isMyPhase ? 255 : 0);
			animateFade(this.enemyTurnGlow, isMyPhase ? 0 : 255);
		} else {
			button.interactable = false;
			animateFade(this.playerTurnGlow, 0);
			animateFade(this.enemyTurnGlow, 0);
		}

		if (phase === DuelPhases.Draw) {
			const label = system.duel.turn === 0 ? 'distribute' : 'draw';

			animateSwapLabel(this.turnLabel, label, color);
		} else if (phase === DuelPhases.Setup) {
			const label = isMyPhase ? 'end turn' : 'enemy turn';

			animateSwapLabel(this.turnLabel, label, color).then(() => {
				if (isMyPhase) {
					this.startCountdown();
				} else {
					this.stopCountdown();
				}
			});
		} else if (phase === DuelPhases.PreFight) {
			animateSwapLabel(this.turnLabel, 'pre fight', white);
		} else if (phase === DuelPhases.Fight) {
			animateSwapLabel(this.turnLabel, 'fight', white);
		} else if (phase === DuelPhases.PostFight) {
			animateSwapLabel(this.turnLabel, 'post fight', white);
		}
	}

	onMouseEnter(): void {
		const isSetupPhase = system.duel.phase === DuelPhases.Setup;
		const isMyPhase = system.duel.phaseOf === system.playerIds.me;

		if (isSetupPhase && isMyPhase) {
			setCursor('pointer');
		}
	}

	onMouseLeave(): void {
		setCursor('auto');
	}

	onButtonClick(): void {
		const isSetupPhase = system.duel.phase === DuelPhases.Setup;
		const isMyPhase = system.duel.phaseOf === system.playerIds.me;

		if (!system.winner && isSetupPhase && isMyPhase) {
			this.endTurn();
		}
	}

	endTurn() {
		playEffectSound('end-turn');
		sendEndTurn();
		this.stopCountdown();
	}

	// TODO: Migrate this turn countdown to game logic
	startCountdown() {
		let timer = this.turnMaxTime;
		const calculateCountdown = () => {
			const minute = Math.floor(timer / 60);
			const second = timer % 60;
			this.labelCountdown.string = `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
			timer--;
		};
		calculateCountdown();

		this.countdown = function () {
			if (timer === 0) {
				this.endTurn();
			}
			calculateCountdown();
		};

		this.schedule(this.countdown, 1);
		this.labelCountdown.node.active = true;
	}

	stopCountdown() {
		this.unschedule(this.countdown);
		this.labelCountdown.node.active = false;
	}
}
