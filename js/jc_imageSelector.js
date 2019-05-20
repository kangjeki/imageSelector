/* ----------------------------------------------------------------------------------------------------------------
# JCselector 	: JC Image Selector, Simple Image Selector;
# Versi 		: v.0.1;
# Author 		: JC Programs;
---------------------------------------------------------------------------------------------------------------- */
class JCselector {
	constructor(targetElement, input, callRes, imgRes) {
		const doc = document; const $ = (tg) => {const trg = doc.querySelector(tg); return trg}; const $$ = (tg) => {const trg = doc.querySelectorAll(tg); return trg};
		let coorX1, coorY1, eventCursor, eventDrag, objectSelector, resX, resY, resW, resH;

		Window.prototype.jcEvent = function(target, eventName, callEvent) {
			target.addEventListener(eventName, (ev) => {
				callEvent(ev);
			});
		}

		const draw = {
			tag : (drx, dry, callback) => {
				let sort = $('._jc_Selector_');
				if (sort == null) {
					const 	dv = doc.createElement('div');
							dv.setAttribute('class', '_jc_Selector_');

							dv.style.cssText = `
								position: absolute;
								top: ${ String(dry) }px;
								left: ${ String(drx) }px;
								z-index: 55;
								width: 0;
								height: 0;
								background: #eee;
								opacity: 0.4;
								border: 1px #000 solid;
								border-style: dashed;
							`
					$('body').prepend(dv);
					callback(true);
 				}
				else {
					callback(false);
				}
			},
			menu : ( {tag, attrib, textNode, setCSS, target} ) => {

				const 	el = doc.createElement(tag);
						el.style.cssText = setCSS;
						el.setAttribute(attrib.name, attrib.value);

				if (textNode !== null && textNode !== undefined) {
					const 	txNode = doc.createTextNode(textNode);
					el.appendChild( txNode );
				}

				if (target !== null || target !== undefined) {
					if (target.exec == "append") {
						$(target.element).append(el);
					}
					else if (target.exec == "prepend") {
						$(target.element).prepend(el);
					}
					else if (target.exec == "appendChild") {
						$(target.element).appendChild(el);
					}
				}
			}
		}
		const actionSort = {

			corDrag: (x, y) => {
				this.eqDrgEventX = x;
				this.eqDrgEventY = y;
			},

			startDrag : (evDrgX, evDrgY) => {
				//eventDrag = true;
				let sort = $('._jc_Selector_'),
					cDgX = evDrgX, 
					cDgY = evDrgY;

				let sortPostL 	= sort.offsetLeft,
					sortPostT 	= sort.offsetTop,
					postW 		= sort.clientWidth,
					postH 		= sort.clientHeight;

				let el_offsetTop 	= targetElement.offsetTop,
					el_offsetLeft 	= targetElement.offsetLeft,
					el_width 		= targetElement.clientWidth,
					el_height 		= targetElement.clientHeight;

				this.invDrag = setInterval( () => {
					let resActDragX = this.eqDrgEventX + window.pageXOffset,
						resActDragY = this.eqDrgEventY + window.pageYOffset;

					// ---------------------------------------------------------------------------------
					// Action Drag Center
					if (eventCursor == "center") {
						let osSelectX = this.eqDrgEventX - (cDgX - sortPostL); // jarak kursor X dengan offsetsort
						let osSelectY = this.eqDrgEventY - (cDgY - sortPostT); // jarak kursor Y dengan offsetsort

						if ( osSelectX <= el_offsetLeft ) {
							osSelectX = el_offsetLeft - 1;
						}
						if ( osSelectY <= el_offsetTop ) {
							osSelectY = el_offsetTop;
						}

						if ( (( postW - (cDgX - sortPostL) ) + this.eqDrgEventX) + 1 >=  el_width + el_offsetLeft ) {
							osSelectX = (el_width + el_offsetLeft) - (postW + 1);
						}

						if ( (( postH - (cDgY - sortPostT) ) + this.eqDrgEventY) + 1 >=  el_height + el_offsetTop ) {
							osSelectY = (el_height + el_offsetTop) - (postH + 1);
						}

						sort.style.left = String(osSelectX) + "px";
						sort.style.top 	= String(osSelectY) + "px";

						// callback Coordinate Response
						if (typeof callRes == "function") {
							callRes({
								x 		: (osSelectX - el_offsetLeft) + 1,
								y 	 	: osSelectY - el_offsetTop,
								width 	: postW,
								height 	: postH
							});	
						}
						
						// Passing Global
						resX 	= (osSelectX - el_offsetLeft) + 1;
						resY 	= osSelectY - el_offsetTop;
						resW 	= postW;
						resH 	= postH;
					}

					// ---------------------------------------------------------------------------------
					// Action Drag Resize Right
					else if (eventCursor == "right") {
						let sortWidth = resActDragX - sortPostL;

						if ( (sortWidth + sortPostL) >= (el_offsetLeft + el_width) - 1 ) {
							sortWidth = (el_offsetLeft + el_width - 1) - sortPostL;
						}

						sort.style.width = String(sortWidth) + "px";

						// callback Coordinate Response
						if (typeof callRes == "function") {
							callRes({
								x 		: sortPostL - el_offsetLeft,
								y 	 	: sortPostT - el_offsetTop,
								width 	: sortWidth,
								height 	: postH
							});
						}

						// Passing Global
						resX 	= sortPostL - el_offsetLeft;
						resY 	= sortPostT - el_offsetTop;
						resW 	= sortWidth;
						resH 	= postH;
					}

					// ---------------------------------------------------------------------------------
					// Action Drag Resize Botton
					else if (eventCursor == "bottom") {
						let resizeB = resActDragY - sortPostT;

						if (resActDragY >= el_offsetTop + el_height) {
							resizeB = (el_offsetTop + el_height) - (sortPostT + 1);
						}
						sort.style.height = String(resizeB) + "px";

						if (typeof callRes == "function") {
							callRes({
								x 		: sortPostL - el_offsetLeft,
								y 	 	: sortPostT - el_offsetTop,
								width 	: postW,
								height 	: resizeB
							});
						}

						// Passing Global
						resX 	= sortPostL - el_offsetLeft;
						resY 	= sortPostT - el_offsetTop;
						resW 	= postW;
						resH 	= resizeB;
					}

					// ---------------------------------------------------------------------------------
					// Action Drag Resize Botton Right
					else if (eventCursor == "bottomRight") {
						let resizeBR_h = resActDragY - sortPostT,
							resizeBR_w = resActDragX - sortPostL;

						if (resActDragY >= el_offsetTop + el_height) {
							resizeBR_h = (el_offsetTop + el_height) - (sortPostT + 1);
						}
						if ( (resizeBR_w + sortPostL) >= (el_offsetLeft + el_width) - 1 ) {
							resizeBR_w = (el_offsetLeft + el_width - 1) - sortPostL;
						}

						sort.style.height 	= String(resizeBR_h) + "px";
						sort.style.width 	= String(resizeBR_w) + "px";

						// callback Coordinate Response
						if (typeof callRes == "function") {
							callRes({
								x 		: sortPostL - el_offsetLeft + 1,
								y 	 	: sortPostT - el_offsetTop,
								width 	: resizeBR_w,
								height 	: resizeBR_h
							});
						}

						// Passing Global
						resX 	= sortPostL - el_offsetLeft + 1;
						resY 	= sortPostT - el_offsetTop;
						resW 	= resizeBR_w;
						resH 	= resizeBR_h;
					}

					// ---------------------------------------------------------------------------------
					// Action Drag Resize Left
					else if (eventCursor == "left") {
						let resizeL 	= resActDragX,
							resizeW 	=  (sortPostL - resActDragX ) + postW;

						if (resizeL <= el_offsetLeft - 1) {
							resizeL = el_offsetLeft - 1;
							resizeW = postW + (sortPostL - el_offsetLeft);
						}

						sort.style.left 	= String(resizeL) + "px";
						sort.style.width 	= String(resizeW) + "px";

						// callback Coordinate Response
						if (typeof callRes == "function") {
							callRes({
								x 		: resizeL - el_offsetLeft + 1,
								y 	 	: sortPostT - el_offsetTop,
								width 	: resizeW,
								height 	: postH
							});
						}

						// Passing Global
						resX 	= resizeL - el_offsetLeft + 1;
						resY 	= sortPostT - el_offsetTop;
						resW 	= resizeW;
						resH 	= postH;
					}

					// ---------------------------------------------------------------------------------
					// Action Drag Resize Left Bottom
					else if (eventCursor == "bottomLeft") {
						let resizeLB_l = resActDragX,
							resizeLB_w = (sortPostL - resActDragX ) + postW,
							resizeLB_h = resActDragY - sortPostT;

						if (resizeLB_l <= el_offsetLeft - 1) {
							resizeLB_l = el_offsetLeft - 1;
							resizeLB_w = postW + (sortPostL - el_offsetLeft);
						}

						if (resActDragY >= el_offsetTop + el_height) {
							resizeLB_h = (el_offsetTop + el_height) - (sortPostT + 1);
						}

						sort.style.left 	= String(resizeLB_l) + "px";
						sort.style.width 	= String(resizeLB_w) + "px";
						sort.style.height 	= String(resizeLB_h) + "px";

						// callback Coordinate Response
						if (typeof callRes == "function") {
							callRes({
								x 		: resizeLB_l - el_offsetLeft + 1,
								y 	 	: sortPostT - el_offsetTop,
								width 	: resizeLB_w,
								height 	: resizeLB_h
							});
						}

						// Passing Global
						resX 	= resizeLB_l - el_offsetLeft + 1;
						resY 	= sortPostT - el_offsetTop;
						resW 	= resizeLB_w;
						resH 	= resizeLB_h;
					}

					// ---------------------------------------------------------------------------------
					// Action Drag Resize Top
					else if (eventCursor == "top") {
						let resizeT 	= resActDragY,
							resizeT_h 	= (sortPostT - resizeT ) + postH;

						if (resizeT <= el_offsetTop) {
							resizeT 	= el_offsetTop;
							resizeT_h 	= (sortPostT - el_offsetTop) + postH;
						}

						sort.style.top 		= String(resizeT) + "px";
						sort.style.height 	= String(resizeT_h) + "px";

						// callback Coordinate Response
						if (typeof callRes == "function") {
							callRes({
								x 		: sortPostL - el_offsetLeft,
								y 	 	: resizeT - el_offsetTop,
								width 	: postW,
								height 	: resizeT_h
							});
						}

						// Passing Global
						resX 	= sortPostL - el_offsetLeft;
						resY 	= resizeT - el_offsetTop;
						resW 	= postW;
						resH 	= resizeT_h;
					}

					// ---------------------------------------------------------------------------------
					// Action Drag Resize Top Right
					else if (eventCursor == "topRight") {
						let resizeTR_t 	= resActDragY,
							resizeTR_h 	= (sortPostT - resActDragY ) + postH,
							resizeTR_w 	= resActDragX - sortPostL;

						if (resizeTR_t <= el_offsetTop) {
							resizeTR_t 	= el_offsetTop;
							resizeTR_h 	= (sortPostT - el_offsetTop) + postH;
						}

						if ( (resizeTR_w + sortPostL) >= (el_offsetLeft + el_width) - 1 ) {
							resizeTR_w = (el_offsetLeft + el_width - 1) - sortPostL;
						}

						sort.style.top 		= String(resizeTR_t) + "px";
						sort.style.height 	= String(resizeTR_h) + "px";
						sort.style.width 	= String(resizeTR_w) + "px";

						// callback Coordinate Response
						if (typeof callRes == "function") {
							callRes({
								x 		: sortPostL - el_offsetLeft + 1,
								y 	 	: resizeTR_t - el_offsetTop,
								width 	: resizeTR_w,
								height 	: resizeTR_h
							});
						}

						// Passing Global
						resX 	= sortPostL - el_offsetLeft + 1;
						resY 	= resizeTR_t - el_offsetTop;
						resW 	= resizeTR_w;
						resH 	= resizeTR_h;
					}

					// ---------------------------------------------------------------------------------
					// Action Drag Resize Top Left
					else if (eventCursor == "topLeft") {
						let resizeTL_t 	= resActDragY,
							resizeTL_h 	= (sortPostT - resActDragY ) + postH,
							resizeTL_l 	= resActDragX,
							resizeTL_w 	= (sortPostL - resActDragX ) + postW;

						if (resizeTL_t <= el_offsetTop) {
							resizeTL_t 	= el_offsetTop;
							resizeTL_h 	= (sortPostT - el_offsetTop) + postH;
						}

						if (resizeTL_l <= el_offsetLeft - 1) {
							resizeTL_l = el_offsetLeft - 1;
							resizeTL_w = postW + (sortPostL - el_offsetLeft);
						}

						sort.style.top 		= String(resizeTL_t) + "px";
						sort.style.height 	= String(resizeTL_h) + "px";
						sort.style.left 	= String(resizeTL_l) + "px";
						sort.style.width 	= String(resizeTL_w) + "px";

						// callback Coordinate Response
						if (typeof callRes == "function") {
							callRes({
								x 		: resizeTL_l - el_offsetLeft +1,
								y 	 	: resizeTL_t - el_offsetTop,
								width 	: resizeTL_w,
								height 	: resizeTL_h
							});
						}

						// Passing Global
						resX 	= resizeTL_l - el_offsetLeft +1;
						resY 	= resizeTL_t - el_offsetTop;
						resW 	= resizeTL_w;
						resH 	= resizeTL_h;
					}

					jcEvent(window, "mouseup", () => {
						actionSort.stopDrag();
						eventDrag = false;
					});
				}, 1);
			},
			stopDrag: () => {
				clearInterval(this.invDrag);
				eventDrag = false;
			},

			openDrag : (target) => {

				jcEvent(target, "mousedown", (evC) => {
					if (event.button !== 2) {
						actionSort.corDrag(evC.clientX, evC.clientY);
						jcEvent(window, "mousemove", (evD) => {
							actionSort.corDrag(evD.clientX, evD.clientY);
						});
						actionSort.startDrag(evC.clientX, evC.clientY);
					}
				});

				jcEvent(target, "mouseup", () => {
					actionSort.stopDrag();
					eventDrag = false;
				});

				jcEvent(target, "contextmenu", (ev) => {
					ev.preventDefault();

					if (event.button == 2) {
						let clsFrmRemove = $('._jc_ctxMenu_');

						function JC_setContextMenu() {
							if (clsFrmRemove == null) {
								draw.menu({
									tag 		: "div", 
									attrib 		: {
										name 	: "class",
										value 	: "_jc_ctxMenu_"
									},
									target 		: {
										element : "body",
										exec 	: "prepend"
									},
									setCSS 		: `
											margin: 0; 
											padding: 5px;
											padding-bottom: 0px;
											display: inline-block; 
											overflow: hidden;
											width: 150px;
											background: #ddd;
											position: fixed;
											top: ${ev.clientY}px;
											left: ${ev.clientX}px;
											z-index: 56;
										`
								});

								draw.menu({
									tag 		: "a", 
									attrib 		: {
										name 	: "id",
										value 	: "_jc_cropCtxMenu_"
									},
									target 		: {
										element : "._jc_ctxMenu_",
										exec 	: "appendChild"
									},
									textNode 	: "Crop",
									setCSS 		: `
											margin: 0; 
											padding: 5px; 
											display: inline-block; 
											overflow: hidden;
											height: 30px;
											width: 140px;
											cursor: pointer;
											line-height: 30px;
											border-bottom: 1px #ccc solid;
											background: #f1f1f1;
											font-family:arial;
											font-size: 13px;
										`
								});

								draw.menu({
									tag 		: "a", 
									attrib 		: {
										name 	: "id",
										value 	: "_jc_removeCtxMenu_"
									},
									target 		: {
										element : "._jc_ctxMenu_",
										exec 	: "appendChild"
									},
									setCSS 		: `
											margin: 0; 
											padding: 5px; 
											display: inline-block; 
											overflow: hidden;
											height: 30px;
											width: 140px;
											cursor: pointer;
											line-height: 30px;
											border-bottom: 1px #ccc solid;
											background: #f1f1f1;
											font-family:arial;
											font-size: 13px;
										`
								});	
							}

							const clsSelector 	= $('#_jc_removeCtxMenu_');
							const clsCroper 	= $('#_jc_cropCtxMenu_');

							if (clsSelector !== null) {
								clsSelector.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 426.667 426.667" style="enable-background:new 0 0 426.667 426.667; position:relative; top: 2px;" xml:space="preserve">
									<path style="fill:#F05228;" d="M213.333,0C95.514,0,0,95.514,0,213.333s95.514,213.333,213.333,213.333  s213.333-95.514,213.333-213.333S331.153,0,213.333,0z M330.995,276.689l-54.302,54.306l-63.36-63.356l-63.36,63.36l-54.302-54.31  l63.356-63.356l-63.356-63.36l54.302-54.302l63.36,63.356l63.36-63.356l54.302,54.302l-63.356,63.36L330.995,276.689z"/>
									</svg> Cancle`;

								jcEvent(clsSelector, "click", () => {
									$('._jc_Selector_').remove();
									objectSelector = false;
									clsSelector.parentNode.remove();

									listen.stop();
									actionSort.stopDrag();
									eventCursor = false;
								});	
								jcEvent(document, "click", () => {
									clsSelector.parentNode.remove();
								});
							}

							if (clsCroper !== null) {
								clsCroper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="14" height="14" style="position:relative; top: 2px;" viewBox="0 0 16 16">
										<path fill="#444444" d="M16 0.7v-0.7h-0.7l-3 3h-7.3v-3h-2v3h-3v2h3v8h8v3h2v-3h3v-2h-3v-7.3l3-3zM5 5h5.3l-5.3 5.3v-5.3zM11 11h-5.3l5.3-5.3v5.3z"/>
									</svg> Crop`;
								jcEvent(clsCroper, "click", () => {
									const 	cvs = doc.createElement('canvas');
											cvs.width 	= resW;
											cvs.height 	= resH;

									const 	ctx = cvs.getContext('2d');
											ctx.drawImage(targetElement, 0 - resX, 0 - resY, targetElement.width, targetElement.height);
									const 	uri 	= cvs.toDataURL('image/png');

									if (typeof imgRes == "function") {
										imgRes(uri);
										$('._jc_Selector_').remove();
										objectSelector = false;
									}
									else if (imgRes !== true) {
										const 	imgN 	= new Image();
												imgN.src = uri;
										$('body').appendChild(imgN);
										$('._jc_Selector_').remove();
										objectSelector = false;
									}
								})
							}
						};

						let prom_context = new Promise( (resolved, rejected) => {
							if (clsFrmRemove !== null) {
								resolved();
							} else { rejected() }
						});

						prom_context.then( () => {
							clsFrmRemove.style.left = String(ev.clientX) + "px";
							clsFrmRemove.style.top 	= String(ev.clientY) + "px";
						}).catch( (b) => {
							new JC_setContextMenu();
						});

					}
					return false;
				});
			}
		}

		const listen = {
			sortCoordinate: (target) => {
				let sortPostL 	= target.offsetLeft,
					sortPostT 	= target.offsetTop,
					sortW 		= target.clientWidth,
					sortH 		= target.clientHeight;
				
				let ro = 2.5;
				jcEvent(window, "mousemove", (ev) => {
					let w_offsetX = window.pageXOffset,
						w_offsetY = window.pageYOffset;

					let eventClientX = ev.clientX + window.pageXOffset,
						eventClientY = ev.clientY + window.pageYOffset;

					if (eventDrag === false) {
						// ---------------------------------------------------------
						// mouse in coord XY top left object
						if ( eventClientX >= (sortPostL - ro) && eventClientX <= (sortPostL + ro) &&
							eventClientY >= (sortPostT - ro) && eventClientY <= (sortPostT + ro) ) 
						{
							target.style.cursor = "nw-resize";
							jcEvent(target, 'mousedown', () => {
								if (event.button !== 2) {
									eventCursor = "topLeft";
								}
							});
						}

						// ---------------------------------------------------------
						// mouse in coord XY Bottom Right object
						else if ( eventClientX >= (sortPostL -ro) + sortW && eventClientX <= (sortPostL + ro) + sortW &&
							eventClientY >= (sortPostT -ro) + sortH && eventClientY <= (sortPostT + ro) + sortH ) 
						{
							target.style.cursor = "nw-resize";
							jcEvent(target, 'mousedown', () => {
								if (event.button !== 2) {
									eventCursor = "bottomRight";
								}
							});
						}

						// ---------------------------------------------------------
						// mouse in coord XY Top Right object
						else if ( eventClientY >= (sortPostT -ro) && eventClientY <= (sortPostT + ro) &&
							eventClientX >= (sortPostL -ro) + sortW && eventClientX <= (sortPostL + ro) + sortW ) 
						{
							target.style.cursor = "ne-resize";
							jcEvent(target, 'mousedown', () => {
								if (event.button !== 2) {
									eventCursor = "topRight";
								}
							});
						}

						// ---------------------------------------------------------
						// mouse in coord XY Bottom Left object
						else if ( eventClientX >= (sortPostL -ro) && eventClientX <= (sortPostL + ro) &&
							eventClientY >= (sortPostT -ro) + sortH && eventClientY <= (sortPostT + ro) + sortH ) 
						{
							target.style.cursor = "ne-resize";
							jcEvent(target, 'mousedown', () => {
								if (event.button !== 2) {
									eventCursor = "bottomLeft";
								}
							});
						}

						// ---------------------------------------------------------
						// mouse in line left object
						else if ( eventClientX >= (sortPostL -ro) && eventClientX <= (sortPostL + ro) ) {
							target.style.cursor = "w-resize";
							jcEvent(target, 'mousedown', () => {
								if (event.button !== 2) {
									eventCursor = "left";
								}
							});
						}

						// ---------------------------------------------------------
						// mouse in line top object
						else if ( eventClientY >= (sortPostT -ro) && eventClientY <= (sortPostT + ro) ) {
							target.style.cursor = "s-resize";
							jcEvent(target, 'mousedown', () => {
								if (event.button !== 2) {
									eventCursor = "top";
								}
							});
						}

						// ---------------------------------------------------------
						// mouse in line right object
						else if ( eventClientX >= (sortPostL -ro) + sortW && eventClientX <= (sortPostL + ro) + sortW) {
							target.style.cursor = "w-resize";
							jcEvent(target, 'mousedown', () => {
								if (event.button !== 2) {
									eventCursor = "right";
								}
							});
						}

						// ---------------------------------------------------------
						// mouse in line bottom object
						else if ( eventClientY >= (sortPostT -ro) + sortH && eventClientY <= (sortPostT + ro) + sortH) {
							target.style.cursor = "s-resize";
							jcEvent(target, 'mousedown', () => {
								if (event.button !== 2) {
									eventCursor = "bottom";
								}
							});
						}

						// ---------------------------------------------------------
						// mouse in line center object
						else {
							target.style.cursor = "move";
							jcEvent(target, 'mousedown', () => {
								if (event.button !== 2) {
									eventCursor = "center";
								}
							});
						}
					}
				});
			},

			open: (x2, y2) => {
				this.coorX2 = x2;
				this.coorY2 = y2;
			},

			drag : () => {
				let sort = $('._jc_Selector_');

				let imgPostX 	= image.offsetLeft;
				let imgPostY 	= image.offsetTop;
				let imgWidth 	= image.width;
				let imgHeight 	= image.height;
				let passX, passY;

				this.inv = setInterval( () => {
					if (this.coorX2 <= imgPostX + imgWidth - 2) {
						passX = this.coorX2 - coorX1;
					}
					else if (this.coorY2 >= imgPostY + imgHeight - 2) {
						passX = ( (imgPostX + imgWidth) - coorX1 )- 2;
					}

					if (this.coorY2 <= imgPostY + imgHeight - 2) {
						passY = this.coorY2 - coorY1;
					}
					else if (this.coorY2 >= imgPostY + imgHeight - 2) {
						passY = ( (imgPostY + imgHeight) - coorY1 ) - 2;
					}

					sort.style.width 	= String(passX) + "px";
					sort.style.height 	= String(passY) + "px";	

					// callback Coordinate Response
					if (typeof callRes == "function") {
						callRes({
							x 		: coorX1 - imgPostX,
							y 	 	: coorY1 - imgPostY,
							width 	: passX,
							height 	: passY
						});
					}
					// Passing Global
						resX 	= coorX1 - imgPostX;
						resY 	= coorY1 - imgPostY;
						resW 	= passX;
						resH 	= passY;

					jcEvent(window, "mouseup", () => {
						listen.stop();
						eventDrag 		= false;
						objectSelector 	= true;
					});
				}, 1);
			},

			stop : () => {
				clearInterval(this.inv);
			}
		}

		// =============================================================================================================
		const EventList = function() {
			const operation = () => {
				jcEvent(targetElement, "mousedown", (evD) => {
					if (event.button != 2) {
						let sort = $('._jc_Selector_');

						if (sort == null) {
							coorX1 = evD.clientX + window.pageXOffset;
							coorY1 = evD.clientY + window.pageYOffset;

							draw.tag(coorX1, coorY1, (res) => {
								jcEvent(window, "mousemove", (evM) => {
									let evX = evM.clientX + window.pageXOffset,
										evY = evM.clientY+ window.pageYOffset;
									listen.open(evX, evY);
								});
								listen.drag();
								let sort = $('._jc_Selector_');
								actionSort.openDrag(sort);
							});
						}
						else {
							let sort = $('._jc_Selector_');
							
							if (sort !== null && objectSelector == true) {
								let altMsg = $('#_jc_altMsg_');

								if (altMsg == null && sort !== null) {
									const 	alt 	= doc.createElement('div');
											alt.setAttribute('id', '_jc_altMsg_');

									const  	altNode	= doc.createTextNode("Selector Sedang Active! Click Delete Untuk Restore!");
											alt.appendChild(altNode);
											alt.style.cssText = `
												margin: auto;
												padding: 5px;
												width: 200px;
												position: fixed;
												top: 45%;
												z-index: 5555555;
												background:#e0272c;
												color: #fff;
												text-align: center;
											`;
									let l_altMs 	= ( (targetElement.width / 2) - 100 ) + targetElement.offsetLeft;
									alt.style.left 	= String(l_altMs) + "px";

									$('body').prepend(alt);
									setTimeout(() => {
										alt.remove();
									}, 1500);	
								}	
							}
						}
					}
				});
				
				jcEvent(targetElement, "mouseup", () => {
					listen.stop();
					eventDrag = false;
				});

				jcEvent(window, "mouseup", () => {
					listen.stop();
					let sort = $('._jc_Selector_');
					if (sort !== null) {
						listen.sortCoordinate(sort);
					}
					eventDrag = false;
				});

				jcEvent(window, "keydown", (event) => {
					if (event.keyCode == 46) {
						let sort = $('._jc_Selector_');
						if(sort !== null) {
							sort.remove();
							objectSelector = false;
						}
					}
				});
			}

			this.set = () => {
				operation();
			}
		}

		const Preview = function() {
			const scImg = (callImage) => {
				if (targetElement !== undefined) {
					if (targetElement.tagName === "IMG") {
						callImage(true);
					}
					else {
						callImage("ERROR! Tag name is not img");
					}
				}
				else {
					callImage("Img Element: " + targetElement + ", get read API document");
				}
			}
			const scInput = (callInput) => {
				if (targetElement.src !== null && targetElement.src !== undefined) {
					new EventList().set();
				}

				if (input !== undefined) {
					if (input.tagName === "INPUT") {
						input.addEventListener('change', () => {
							let jcIn = input.files[0];
							scImg( (res) => {
								if (res === true) {
									if ($('._jc_Selector_') !== null) {
										$('._jc_Selector_').remove();
										objectSelector = false;
									}
									targetElement.src = URL.createObjectURL(jcIn);
									targetElement.setAttribute('draggable', 'false');
									callInput(true);
								}else{
									callInput(res);
								}
							});
						});
					}
					else {
						callInput("ERROR! Tag name is not Input");
					}
				}
				else {
					callInput("Input Element: " + input + ", get read API document");
				}	
			}
			this.setPreview = () =>{
				scInput( (res) => {
					(res == true)? new EventList().set(): alert(res);
				});	
			}
		}
		this.on = () => {
			const 	prev = new Preview();
					prev.setPreview();	
		}
	}
}