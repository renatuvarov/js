(function( $ ){

    $.fn.Slider = function() {
        var element = $(this);

        var AbstractList = function (el) {
            if (new.target === AbstractList) {
                throw new TypeError('Cannot construct abstract instance.');
            }
        };
    
        AbstractList.prototype.changeSlide = function () {
            throw new TypeError('A class that inherits AbstractList must override this method.');
        };
    
        AbstractList.prototype.show = function () {
            throw new TypeError('A class that inherits AbstractList must override this method.');
        };
    
        AbstractList.prototype.hide = function () {
            throw new TypeError('A class that inherits AbstractList must override this method.');
        };
    
        var DefaultList = function (el) {
            var $this = this;
    
            var el = $(el);
            var infoCurrent = null;
    
            var changeByTimeout = function () {
                var id = setTimeout(function () {
                    if (state.getCurrentList() === $this) {
                        $this.changeSlide(state.nextImage());
                    }
                }, 5000);
    
                state.setTimerId(id);
            };
    
            var removeActiveClass = function () {
                el.find('.js-image-container').removeClass('image-container-active');
            }
    
            var initList = function () {
                changeByTimeout();
    
                var fragment = $(document.createDocumentFragment());

                element.find('.js-image')
                    .eq(state.getCurrentImage())
                    .closest('.image-container')
                    .addClass('image-container-active');
    
                fragment.append($('<button>', {class: 'btn js-btn js-btn-default btn-prev js-btn-prev', text: '⬅',}));
                fragment.append($('<button>', {class: 'btn js-btn js-btn-default btn-next js-btn-next', text: '➡',}));
        
                var info = $('<div>', {
                    class: 'info',
                    append: $('<span>', {
                        class: 'info-current js-info-current',
                    }).add($('<span>', {
                        class: 'info-separator',
                        text: '/'
                    })).add($('<span>', {
                        class: 'info-count js-info-count',
                    }))
                });
    
                infoCurrent = info.find('.js-info-current');
    
                infoCurrent.text(state.getCurrentImage() + 1);
                info.find('.js-info-count').text(state.getImagesListCount());
    
                fragment.append(info);
    
                element.append(fragment);
            };

            this.update = function() {
                el.css({'height': 'auto'});
                el.find('.image-container').css({'height': 'auto'});

                var minHeight = Math.min.apply(null, el.find('.js-image').map(function () {
                    return $(this).height();
                }).get());
    
                el.css({'height': minHeight + 'px'});
                el.find('.image-container').css({'height': minHeight + 'px'});

                element.find('.js-btn-default').css({top: minHeight / 2 + 'px'});
            }
    
            this.changeSlide = function (index) {
                clearTimeout(state.getTimerId());
    
                removeActiveClass();
                el.find('.js-image').eq(index).closest('.js-image-container').addClass('image-container-active');
                infoCurrent.text(index + 1);
    
                changeByTimeout();
            }
    
            this.show = function () {
                $this.changeSlide(state.getCurrentImage());
            };
    
            this.hide = function () {
            };

            initList();
            this.update();
        };
    
        DefaultList.prototype = Object.create(AbstractList.prototype);
        DefaultList.prototype.constructor = DefaultList;
    
        var LayoutList = function () {
            this.el = null;
            var infoCurrent = null;
            var $this = this;
    
            var initList = function () {
                var layout = $('<div>', {
                    class: 'slider-layout js-slider-layout',
                    append: $('<img>', {
                        class: 'js-layout-image layout-image',
                        src: state.getImagesList()[state.getCurrentImage()]
                    }).add($('<div>', {
                        class: 'layout-control',
                        append: $('<button>', {
                            class: 'btn btn-prev js-btn-prev',
                            text: '⬅',
                        }).add($('<button>', {
                            class: 'btn btn-next js-btn-next',
                            text: '➡',
                        }))
                    })).add($('<div>', {
                        class: 'info layout-info',
                        append: $('<span>', {
                            class: 'info-current js-info-current',
                        }).add($('<span>', {
                            class: 'info-separator',
                            text: '/'
                        })).add($('<span>', {
                            class: 'info-count js-info-count',
                        }))
                    }))
                });
    
                element.append(layout);
                $this.el = layout;
                infoCurrent = $this.el.find('.js-info-current');
                infoCurrent.text(state.getCurrentImage() + 1);
                $this.el.find('.js-info-count').text(state.getImagesListCount());
            };
    
            initList();
    
            this.changeSlide = function (index) {
                $this.el.find('.js-layout-image').attr('src', state.getImagesList()[state.getCurrentImage()]);
                infoCurrent.text(index + 1);
            }
    
            this.show = function () {
                $this.el.addClass('slider-layout-active');
                this.changeSlide(state.getCurrentImage());
            }
    
            this.hide = function () {
                $this.el.removeClass('slider-layout-active');
            }
        };
    
        LayoutList.prototype = Object.create(AbstractList.prototype);
        LayoutList.prototype.constructor = LayoutList;
    
        var state = (function () {
            var state = {
                timerId: null,
                resizeTimerId: null,
                currentList: null,
                imagesList: [],
                currentImage: null
            };
    
            element.find('.js-image').each(function () {
                state.imagesList.push($(this).attr('src'));
                state.currentImage = 0;
            });
    
            return {
                getCurrentList: function () {
                    return state.currentList;
                },
    
                setCurrentList: function (list) {
                    if (!(list instanceof AbstractList)) {
                        throw new TypeError('list must be of the type AbstractList, "' + (typeof list) + '" given.');
                    }
    
                    state.currentList = list;
                },
    
                getTimerId: function () {
                    return state.timerId;
                },
    
                setTimerId: function (id) {
                    state.timerId = id;
                },

                getResizeTimerId: function () {
                    return state.resizeTimerId;
                },
    
                setResizeTimerId: function (id) {
                    state.resizeTimerId = id;
                },
    
                getImagesList: function () {
                    return state.imagesList;
                },
    
                getImagesListCount() {
                    return this.getImagesList().length;
                },
    
                getCurrentImage: function () {
                    return state.currentImage;
                },
    
                setCurrentImage: function (index) {
                    state.currentImage = index;
                },
    
                nextImage: function () {
                    var currentIndex = this.getCurrentImage();
    
                    if (++currentIndex === this.getImagesListCount()) {
                        this.setCurrentImage(0);
                    } else {
                        this.setCurrentImage(currentIndex)
                    }
    
                    return this.getCurrentImage();
                },
    
                prevImage: function () {
                    var currentIndex = this.getCurrentImage();
    
                    if (--currentIndex < 0) {
                        this.setCurrentImage(this.getImagesListCount() - 1);
                    } else {
                        this.setCurrentImage(currentIndex)
                    }
    
                    return this.getCurrentImage();
                }
            };
        })();
    
        var sliderObj = function () {
            var defaultList = new DefaultList('.js-image-list');
            var layoutList = new LayoutList();
    
            state.setCurrentList(defaultList);
    
            return {
                prev: function () {
                    if (state.getImagesListCount() > 1) {
                        state.getCurrentList().changeSlide(state.prevImage());
                    }
                },
    
                next: function () {
                    if (state.getImagesListCount() > 1) {
                        state.getCurrentList().changeSlide(state.nextImage());
                    }
                },
    
                setDefault: function (e) {
                    if ($(e.target).hasClass('js-slider-layout')) {
                        state.setCurrentList(defaultList);
                        defaultList.show();
                        layoutList.hide();
                    }
                },
    
                setLayout: function () {
                    defaultList.hide();
                    state.setCurrentList(layoutList);
                    layoutList.show();
                },

                onResize: function() {
                    var id = state.getResizeTimerId();

                    if (id) {
                        clearTimeout(id);
                    }

                    id = setTimeout(function() {
                        defaultList.update();
                    }, 100);

                    state.setResizeTimerId(id);
                }
            };
        };
    
        var init = function () {
            var s = sliderObj();
            element.find('.js-btn-prev').on('click', s.prev);
            element.find('.js-btn-next').on('click', s.next);
            element.find('.js-image').on('click', s.setLayout);
            element.find('.js-slider-layout').on('click', s.setDefault);
            $(window).on('resize', s.onResize);
        };

        init(); 
    };

    return this; 

})(jQuery);