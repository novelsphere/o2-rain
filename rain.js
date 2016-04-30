/* global $ Tag TagAction RainyDay renderer */
/**
 * preset フォマット (x,y,z)(x1,y1,z1)
 *   x = min size
 *   y = min size + max size
 *   z = probability  (2,6,0.3)(2,2,1)  (0~0.3)=>size:2~8  (0.3~1.0)->size:2~4
 * [rain layer=0 page=fore gravityangle=30 preset=(2,6,0.3)(2,2,1) trail=drops]
 * [stopraining layer=0 page=fore]
 */

Tag.actions.rain = new TagAction({
	rules : {
		layer:        { type:"LAYER", required:true },
		page:         { type:/fore|back/, defaultValue:"fore" },
		trail:        { type:/none|drops|smudge/, defaultValue:"drops" },
		gravityangle: { type:"FLOAT", defaultValue: 180 },  //0 ~ 360
		preset:       { type:"STRING", defaultValue: "(0,2,0.5)(4,4,1)"},
		speed:        { type:"INT", defaultValue: 50 },
		opaque:       { type:"BOOLEAN", defaultValue: true }
	},
	action : function(args) {
		var layer = args.layer[args.page];
		if (layer.rainyday) {
			return 0;
		}

		var _this = this;

		var newCanvas = document.createElement('canvas');
		newCanvas.width = layer.rect.width;
		newCanvas.height = layer.rect.height;

		function loadedRainyDay() {
			var engine = new RainyDay(newCanvas, layer.canvas, layer.rect.width, layer.rect.height, 1, 5);
			layer.rainyday = engine;
			engine.reflection = engine.REFLECTION_MINIATURE;

			switch (args.trail) {
				case 'none':
					engine.trail = engine.TRAIL_NONE;
					break;
				case 'smudge':
					engine.trail = engine.TRAIL_SMUDGE;
					break;
				case 'drops':
				default:
					engine.trail = engine.TRAIL_DROPS;
					break;
			}
			engine.VARIABLE_GRAVITY_ANGLE = args.gravityangle / 180 * Math.PI;

			var presetRegex = /\((-?[0-9\.,\s]+)*\)/g;  //match (123,456,789) (123,456,678,988,123)
			var matches = args.preset.match(presetRegex);
			var presets = [];
			for (let i = 0; i < matches.length; i++) {
				var thisPresetArgs = matches[i]
					.replace("(", "")
					.replace(")", "")
					.split(",");
				presets.push(engine.preset(
					parseFloat(thisPresetArgs[0]),
					parseFloat(thisPresetArgs[1]),
					parseFloat(thisPresetArgs[2])
					));
			}
			engine.rain(presets, args.speed);

			engine._drawOnContext = layer.drawOnContext;
			engine._flush = layer.flush;

			if (args.opaque) {
				layer.drawOnContext = function(context) {
					var _originalCanvas = layer.canvas;
					layer.canvas = newCanvas;
					engine._drawOnContext.apply(this, arguments);
					layer.canvas = _originalCanvas;
				};
				layer.flush = function() {
					if (engine._flush.apply(this, arguments)) {
						engine.prepareBackground();
						engine.prepareReflections();
						engine.stoppedDrops.forEach(function(x) {
							x.draw();
						});
						return true;
					}
					return false;
				};
			} else {
				layer.drawOnContext = function(context) {
					engine._drawOnContext.apply(this, arguments);
					engine.img = context.canvas;
					engine.prepareBackground();
					engine.prepareReflections();
					engine.stoppedDrops.forEach(function(x) {
						x.draw();
					});
					context.drawImage(engine.canvas, 0, 0);
				};
			}

			renderer.animator.requestFrame(function drawThing() {
				if (layer.rainyday == engine) {
					//stop when it is not raining
					renderer.animator.requestFrame(drawThing);
				}
			});

			_this.done();
		}

		if (window.RainyDay) {
			setTimeout(loadedRainyDay, 0);
		} else {
			$.getScript('plugin/rainyday.js').done(loadedRainyDay);
		}

		return 1;
	}
});

Tag.actions.stopraining = new TagAction({
	rules : {
		layer:      {type:"LAYER", required:true},
		page:       {type:/fore|back/, defaultValue:"fore"}
	},
	action : function(args) {
		var layer = args.layer[args.page];
		if (!layer.rainyday) {
			return 0;
		}

		var engine = layer.rainyday;
		engine.drops.concat(engine.stoppedDrops).forEach(function(thisDrop) {
			engine.clearDrop(thisDrop, true);
		});
		layer.drawOnContext = engine._drawOnContext;
		layer.flush = engine._flush;
		engine.stop = true;

		delete layer.rainyday;

		return 0;
	}
});