    var Slider = function(element) {

        var AbstractList = function(el) {
            if (new.target === AbstractList) {
                throw new TypeError('Cannot construct abstract instance.');
            }
        };

        var DefaultList = function(el) {
            var $this = this;

            this.changeByTimeout = function() {
                var id = setTimeout(function() {
                    if (state.getCurrentList() === $this) {
                        $this.next();
                    }
                }, 5000);
        
                state.setTimerId(id);
            };

            this.changeByTimeout();

            this.el = $(el);

            this.removeActiveClass = function() {
                this.el.find('.js-image-container').removeClass('image-container-active');
            }

            this.changeSlide = function(index) {
                clearTimeout(state.getTimerId());

                this.removeActiveClass();
                this.el.find('.js-image').eq(index).closest('.js-image-container').addClass('image-container-active');

                this.changeByTimeout();
            }
        };

        DefaultList.prototype = Object.create(AbstractList.prototype);
        DefaultList.prototype.constructor = DefaultList;

        DefaultList.prototype.next = function() {
            this.changeSlide(state.nextImage());
        };

        DefaultList.prototype.prev = function() {
            this.changeSlide(state.prevImage());
        };

        var LayoutList = function(el) {};
        LayoutList.prototype = Object.create(AbstractList.prototype);
        LayoutList.prototype.constructor = LayoutList;

        var state = (function() {
            var state = {
                timerId: null,
                changeSlide: true,
                currentList: null,
                imagesList: [],
                currentImage: null
            };
    
            element.find('.js-image').each(function() {
                state.imagesList.push($(this).attr('src'));
                state.currentImage = 0;
            });
    
            return {
                getCurrentList: function() {
                    return state.currentList;
                },
    
                setCurrentList: function(list) {
                    if ( ! (list instanceof AbstractList)) {
                        throw new TypeError('list must be of the type AbstractList, "' + (typeof list) + '" given.');
                    }

                    state.currentList = list;
                },
    
                mustChangeSlide: function() {
                    return state.changeSlide;
                },
    
                toggleChangeSlide: function() {
                    state.changeSlide = ! state.changeSlide;
                },
    
                getTimerId: function() {
                    return state.timerId;
                },
    
                setTimerId: function(id) {
                    state.timerId = id;
                },
    
                getImagesList: function() {
                    return state.imagesList;
                },

                getImagesListCount() {
                    return this.getImagesList().length;
                },
    
                getCurrentImage: function() {
                    return state.currentImage;
                },
    
                setCurrentImage: function(index) {
                    state.currentImage = index;
                },

                nextImage: function() {
                    var imagesList = this.getImagesList();
                    var currentIndex = this.getCurrentImage();

                    if (++currentIndex === this.getImagesListCount()) {
                        this.setCurrentImage(0);
                    } else {
                        this.setCurrentImage(currentIndex)
                    }

                    return this.getCurrentImage();
                },

                prevImage: function() {
                    var imagesList = this.getImagesList();
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
    
        var makeDOM = function() {
            var slider = $(element);
    
            var fragment = $(document.createDocumentFragment());

            var minHeight = Math.min.apply(null, $('.js-image').map(function () {
                return $(this).height();
            }).get());

            slider.find('.js-image-list').css({'height': minHeight + 'px'});
            slider.find('.image-container').css({'height': minHeight + 'px'});

            slider.find('.js-image')
                .eq(state.getCurrentImage())
                .closest('.image-container')
                .addClass('image-container-active');
    
            var control = $('<div>', {
                class: 'control',
                append: $('<button>', {
                    class: 'btn btn-prev js-btn-prev',
                    text: '⬅',
                }).add($('<button>', {
                    class: 'btn btn-next js-btn-next',
                    text: '➡',
                })),
            });
    
            fragment.append(control);
    
            var info = $('<div>', {
                class: 'info',
                append: $('<span>', {
                    class: 'info-current js-info-current',
                }).add($('<span>', {
                    class: 'info-separator',
                })).add($('<span>', {
                    class: 'info-count js-info-count',
                })),
            });
    
            fragment.append(info);
    
            slider.append(fragment);
    
            return slider;
        };
    
        var sliderObj = function() {
            state.setCurrentList(new DefaultList('.js-image-list'));
    
            var s = {
                prev: function() {
                    if (state.getImagesListCount() > 1) {
                        state.getCurrentList().prev();
                    }                
                },
        
                next: function() {
                    if (state.getImagesListCount() > 1) {
                        state.getCurrentList().next();
                    } 
                },
            };
            
            return s;
        };
    
        var init = function() {
            var slider = makeDOM();
            var s = sliderObj(new DefaultList()); 
            element.find('.js-btn-prev').on('click', s.prev);
            element.find('.js-btn-next').on('click', s.next);
        };
    
        return init();
    };
    
    Slider($('.js-slider'));
    