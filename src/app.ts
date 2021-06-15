/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
// import { MreArgumentError } from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */

//tt 
export default class HelloWorld {
	private menu: MRE.Actor = null;
	private tv: MRE.Actor = null;
	private scoreT: MRE.Actor = null;
	private up: MRE.Actor = null;
	private down: MRE.Actor = null;
	private reset: MRE.Actor = null;
	private assets: MRE.AssetContainer;
	private buzzerSound: MRE.Sound = undefined;
	private shiftConf: number;
	private shift: number;
	private shiftT: number;
	private boards: number;
	private Score: number[];


	constructor(private context: MRE.Context) {
		this.context.onStarted(() => this.started());
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private started() {
		// config for board positioning and amount of boards
		this.shiftConf = -.90;
		this.shift = -.5;
		this.shiftT = -.53;
		this.boards = 4;

		// initialize score
		for (let x = 0; x < this.boards; x++) {
			this.Score[x] = 0;
		}

		// set up somewhere to store loaded assets (meshes, textures, animations, gltfs, etc.)
		this.assets = new MRE.AssetContainer(this.context);

		this.menu = MRE.Actor.Create(this.context, {});

		this.create_score();
		this.show_score();

		this.buzzerSound = this.assets.createSound(
			'alarmSound',
			{ uri: 'Gameboy Startup Sound.wav' });


		// // Set up cursor interaction. We add the input behavior ButtonBehavior to the button.
		// // Button behaviors have two pairs of events: hover start/stop, and click start/stop.
		// const buttonBehavior = this.button.setBehavior(MRE.ButtonBehavior);

		// // Trigger the grow/shrink animations on hover.
		// buttonBehavior.onHover('enter', () => {
		// 	// use the convenience function "AnimateTo" instead of creating the animation data in advance
		// 	MRE.Animation.AnimateTo(this.context, this.button, {
		// 		destination: { transform: { local: { scale: { x: 0.6, y: 0.6, z: 0.6 } } } },
		// 		duration: 0.3,
		// 		easing: MRE.AnimationEaseCurves.EaseOutSine
		// 	});
		// });
		// buttonBehavior.onHover('exit', () => {
		// 	MRE.Animation.AnimateTo(this.context, this.button, {
		// 		destination: { transform: { local: { scale: { x: 0.4, y: 0.4, z: 0.4 } } } },
		// 		duration: 0.3,
		// 		easing: MRE.AnimationEaseCurves.EaseOutSine
		// 	});
		// });

		// // When clicked, do a 360 sideways.
		// buttonBehavior.onClick(_ => {

		// 	this.startSound();
		// 	MRE.Animation.AnimateTo(this.context, this.button, {
		// 		destination: { transform: { local: { scale: { x: 2, y: 5, z: 2 } } } },
		// 		duration: 0.7,
		// 		easing: MRE.AnimationEaseCurves.EaseOutSine
		// 	});
		// 	MRE.Animation.AnimateTo(this.context, this.button, {
		// 		destination: { transform: { local: { scale: { x: 0.4, y: 0.4, z: 0.4 } } } },
		// 		duration: 0.3,
		// 		easing: MRE.AnimationEaseCurves.EaseOutSine
		// 	});
		// });

	}
	// private startSound = () => {
	// 	const options: MRE.SetAudioStateOptions = { volume: 0.4 };
	// 	options.time = 0;
	// 	this.button.startSound(this.buzzerSound.id, options);
	// }
	private async create_score() {
		// Load a glTF model before we use it
		const tvmodel = await this.assets.loadGltf('TV.glb', "box");
		const upmodel = await this.assets.loadGltf('UpButton.glb', "box");
		const downmodel = await this.assets.loadGltf('DownButton.glb', "box");
		const resetmodel = await this.assets.loadGltf('RedButton.glb', "box");
		for (let i = 0; i < this.boards; i++) {
			// spawn a copy of the glTF model
			this.tv = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: tvmodel,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Tv Model',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: this.shift, y: 0, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 }
						}
					}
				}
			});

			this.up = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: upmodel,
				// Also apply the following generic actor properties.
				actor: {
					name: 'up button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: this.shift, y: 0, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 }
						}
					}
				}
			});
			const upBehavior = this.up.setBehavior(MRE.ButtonBehavior);
			upBehavior.onClick(_ => {
				this.Score[i] += 1;
				this.show_score();
			});

			this.down = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: downmodel,
				// Also apply the following generic actor properties.
				actor: {
					name: 'down button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: this.shift, y: 0, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 }
						}
					}
				}
			});
			const downBehavior = this.down.setBehavior(MRE.ButtonBehavior);
			downBehavior.onClick(_ => {
				if (this.Score[i] > 0) {
					this.Score[i] -= 1;
				}
				else {
					this.Score[i] = 0;
				}
				this.show_score();
			});

			this.reset = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: resetmodel,
				// Also apply the following generic actor properties.
				actor: {
					name: 'reset button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: this.shift, y: 0, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 }
						}
					}
				}
			});
			const resetBehavior = this.reset.setBehavior(MRE.ButtonBehavior);
			resetBehavior.onClick(_ => {
				this.Score[i] = 0;
				this.show_score();
			});

			this.shift += this.shiftConf;
		}
	}
	private show_score() {
		this.scoreT.destroy();
		for (let i = 0; i < this.boards; i++) {
			this.scoreT = MRE.Actor.Create(this.context, {
				actor: {
					name: 'score',
					transform: {
						app: { position: { x: this.shiftT, y: 0.5, z: .4 } }
					},
					text: {
						contents: String(this.Score[i]),
						anchor: MRE.TextAnchorLocation.MiddleCenter,
						color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
						height: 0.3
					}
				}
			});
			this.shiftT += this.shiftConf;
		}
	}

}
