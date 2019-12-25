class Observer {
    constructor() {
        this.elements = [];
    }

    add(element) {
        if (element instanceof Modal) {
            this.elements = [...this.elements, element];
        }
    }

    hideElements() {
        this.elements.forEach(element => element.hide());
    }

    showElement(button) {
        this.elements.forEach(element => {
            if (button === element.button) {
                element.show();
            }
        });
    }
}

class Modal {
    constructor(element, button) {
        this.element = element;
        this.button = button;
    }

    show() {
        if (! this.isActive()) {
            this.element.classList.add('modal--active');
        }
    }

    hide() {
        if (this.isActive()) {
            this.element.classList.remove('modal--active');
        }
    }

    isActive() {
        return this.element.classList.contains('modal--active');
    }
}

const observer = new Observer();

(() => {
    const button = document.querySelector('.js-nav .js-show_modal');
    const element = document.querySelector('.js-nav .js-modal');
    const modal = new Modal(element, button);
    observer.add(modal);
})();

(() => {
    const button = document.querySelector('.js-section_1 .js-show_modal');
    const element = document.querySelector('.js-section_1 .js-modal');
    const modal = new Modal(element, button);
    observer.add(modal);
})();

(() => {
    const button = document.querySelector('.js-section_2 .js-show_modal');
    const element = document.querySelector('.js-section_2 .js-modal');
    const modal = new Modal(element, button);
    observer.add(modal);
})();

document.addEventListener('click', e => {
    const target = e.target;

    if (target.classList.contains('js-modal_layout')
        || target.closest('.js-modal-hide')
        || ! target.closest('.js-modal')
    ) {
        observer.hideElements();
    }
});

document.addEventListener('click', e => {
    const target = e.target;

    if (target.classList.contains('js-show_modal')) {
        observer.showElement(target);
    }
});