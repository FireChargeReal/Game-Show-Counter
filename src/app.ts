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
	private scoreT: MRE.Actor[];
	private up: MRE.Actor = null;
	private down: MRE.Actor = null;
	private reset: MRE.Actor = null;
	private assets: MRE.AssetContainer;
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
		this.shiftConf = -1.1;
		this.shift = -.5;
		this.shiftT = -.5;
		this.boards = 4;

		// initialize score
		this.Score = new Array(this.boards);
		for (let i = 0; i < this.boards; i++) {
			this.Score[i] = 0;
		}

		// set up somewhere to store loaded assets (meshes, textures, animations, gltfs, etc.)
		this.assets = new MRE.AssetContainer(this.context);

		this.menu = MRE.Actor.Create(this.context, {});
		this.scoreT = new Array(this.boards)
		this.create_score();
		this.show_score();

	}

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
				this.destroy_score();
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
				this.destroy_score();
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
				this.destroy_score();
				this.Score[i] = 0;
				this.show_score();
			});

			this.shift += this.shiftConf;
		}
	}
	private show_score() {
		let temp = this.shiftT;
		for (let i = 0; i < this.boards; i++) {
			this.scoreT[i] = (MRE.Actor.Create(this.context, {
				actor: {
					name: 'score',
					transform: {
						local: {
							position: { x: this.shiftT, y: 0, z: .30 },
							rotation: { x: 0, y: 180, z: 0 }
						}
					},
					text: {
						contents: String(this.Score[i]),
						anchor: MRE.TextAnchorLocation.MiddleCenter,
						color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
						height: 0.3
					}
				}
			}));
			this.shiftT += this.shiftConf;
		}
		this.shiftT = temp;
	}
	// (this.scoreT[i].destroy());
	// (delete this.scoreT[i]);
	private destroy_score() {
		console.log(this.scoreT.length);
		console.log(this.scoreT)
		
		if (this.scoreT.length >= 1) {
			for (let i = 0; i < this.boards; i++) {
				this.scoreT[i].destroy();
				delete this.scoreT[i];
			}
		}
	}
}
