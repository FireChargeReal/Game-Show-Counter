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
	private up: MRE.Actor = null;
	private down: MRE.Actor = null;
	private reset: MRE.Actor = null;
	private assets: MRE.AssetContainer;
	private buzzerSound: MRE.Sound = undefined;
	private shiftConf: number;
	private shift: number;
	private boards: number;

	constructor(private context: MRE.Context) {
		this.context.onStarted(() => this.started());
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private started() {

		this.shiftConf = .20;
		this.shift = .5;
		this.boards = 4;

		// set up somewhere to store loaded assets (meshes, textures, animations, gltfs, etc.)
		this.assets = new MRE.AssetContainer(this.context);

		this.menu = MRE.Actor.Create(this.context, {});

		this.create_score();

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
		const cubeData = await this.assets.loadGltf('TV.glb', "box");
		for (let i = 0; i < this.boards; i++) {
			// spawn a copy of the glTF model
			this.tv = MRE.Actor.CreateFromPrefab(this.context, {
				// using the data we loaded earlier
				firstPrefabFrom: cubeData,
				// Also apply the following generic actor properties.
				actor: {
					name: 'Altspace button',
					// Parent the glTF model to the text actor, so the transform is relative to the text
					parentId: this.menu.id,
					transform: {
						local: {
							position: { x: 0, y: this.shift, z: 0 },
							scale: { x: 0.4, y: 0.4, z: 0.4 }
						}
					}
				}
			});
			this.shift += this.shiftConf;
		}
	}

}
