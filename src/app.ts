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
	private shift: number;
	private shiftT: number;
	private Score: number[];
	private config: { [key: string]: number };


	constructor(private context: MRE.Context, private params: MRE.ParameterSet) {
		this.context.onStarted(() => this.started());
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private started() {
		// config for board positioning and amount of boards
		this.shift = 0;
		this.shiftT = 0;
		console.log("test");

		// set up somewhere to store loaded assets (meshes, textures, animations, gltfs, etc.)
		this.assets = new MRE.AssetContainer(this.context);
		const allowed = ["boards", "spread"];
		this.config = { "boards": 4, "spread": -1.1 };
		for (const key in this.params) {
			console.log("test");

			this.config[key] = Number(this.params[key]);

		}
		// initialize score
		this.Score = new Array(this.config["boards"]);
		this.Score = [0, 0, 0, 0];
		console.log(this.params); 2
		this.menu = MRE.Actor.Create(this.context, {});
		this.scoreT = new Array(this.config["boards"]);

		this.create_score();
		this.show_score();

	}

	private async create_score() {
		// Load a glTF model before we use it
		const tvmodel = await this.assets.loadGltf('TV.glb', "box");
		const upmodel = await this.assets.loadGltf('UpButton.glb', "box");
		const downmodel = await this.assets.loadGltf('DownButton.glb', "box");
		const resetmodel = await this.assets.loadGltf('RedButton.glb', "box");
		console.log("test");
		console.log(this.config["boards"]);


		for (let i = 0; i < this.config["boards"]; i++) {
			// spawn a copy of the glTF model
			console.log("tv");

			this.tv = MRE.Actor.CreateFromLibrary(this.context, {
				// using the data we loaded earlier
				resourceId:"artifact:1956000502483255462",
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

			this.up = MRE.Actor.CreateFromLibrary(this.context, {
				// using the data we loaded earlier
				resourceId:"artifact:1956000515594649770",
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

			this.down = MRE.Actor.CreateFromLibrary(this.context, {
				// using the data we loaded earlier
				resourceId:"artifact:1956000474826014874",
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

			this.reset = MRE.Actor.CreateFromLibrary(this.context, {
				// using the data we loaded earlier
				resourceId:"artifact:1956000488717549727",
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

			this.shift += -this.config["spread"];
		}
	}
	private show_score() {
		let temp = this.shiftT;
		for (let i = 0; i < this.config["boards"]; i++) {
			this.scoreT[i] = (MRE.Actor.Create(this.context, {
				actor: {
					name: 'score',
					transform: {
						local: {
							position: { x: this.shiftT, y: 0, z: .25 },
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
			this.shiftT += -this.config["spread"];
		}
		this.shiftT = temp;
	}
	// (this.scoreT[i].destroy());
	// (delete this.scoreT[i]);
	private destroy_score() {
		if (this.scoreT.length >= 1) {
			for (let i = 0; i < this.config["boards"]; i++) {
				this.scoreT[i].destroy();
				delete this.scoreT[i];
			}
		}
	}
}
