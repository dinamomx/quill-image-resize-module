import IconAlignLeft from 'quill/assets/icons/align-left.svg';
import IconAlignCenter from 'quill/assets/icons/align-center.svg';
import IconAlignRight from 'quill/assets/icons/align-right.svg';
import { BaseModule } from './BaseModule';

export class Toolbar extends BaseModule {

    onCreate = () => {
		// Setup Class
		const Parchment = this.quill.constructor.imports.parchment;
		const Scope = Parchment.Scope
		const config = {
			whitelist: ['right', 'center', 'left'],
		};
		this.AlignImageClass = new Parchment.Attributor.Class('alignimg', 'ql-img-align', config)
		this.AlignImageWidth = new Parchment.Attributor.Attribute('width', 'width')
        // Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        // Setup Buttons
        this._defineAlignments();
        this._addToolbarButtons();
    };

    // The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => { };

    // Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => { };

    _defineAlignments = () => {


        this.alignments = [
            {
                icon: IconAlignLeft,
                apply: () => {
					this.AlignImageClass.add(this.img, 'left')
                },
                isApplied: () => this.AlignImageClass.value(this.img) === 'left',
            },
            {
                icon: IconAlignCenter,
                apply: () => {
					this.AlignImageClass.add(this.img, 'center')
                },
                isApplied: () => this.AlignImageClass.value(this.img) === 'center',
            },
            {
                icon: IconAlignRight,
				apply: () => {
					this.AlignImageClass.add(this.img, 'right')
                },
                isApplied: () => this.AlignImageClass.value(this.img) === 'right',
            },
        ];
    };

    _addToolbarButtons = () => {
		const buttons = [];
        this.alignments.forEach((alignment, idx) => {
            const button = document.createElement('span');
            buttons.push(button);
            button.innerHTML = alignment.icon;
            button.addEventListener('click', () => {
                // deselect all buttons
                buttons.forEach(button => button.style.filter = '');
                if (alignment.isApplied()) {
					// If applied, unapply
					this.AlignImageClass.remove(this.img)
                } else {
                    // otherwise, select button and apply
                    this._selectButton(button);
					alignment.apply();
				}

				// HACK: To force value update
				const w = this.img.width || this.img.naturalWidth
				this.AlignImageWidth.add(this.img, w - 1)

				setTimeout(() => {
					this.AlignImageWidth.add(this.img, w)
				}, 0);
                // image may change position; redraw drag handles
                this.requestUpdate();
            });
            Object.assign(button.style, this.options.toolbarButtonStyles);
            if (idx > 0) {
                button.style.borderLeftWidth = '0';
			}
            Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
            if (alignment.isApplied()) {
                // select button if previously applied
                this._selectButton(button);
            }
            this.toolbar.appendChild(button);
        });
    };

    _selectButton = (button) => {
        button.style.filter = 'invert(20%)';
    };

}
