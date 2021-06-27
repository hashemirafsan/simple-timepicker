(function($) {

    $.fn.timePicker = function(options) {
        let config = $.extend({
            mode: 24,
            secondGap: 5,
            enableHour: true,
            enableSecond: true,
            inputName: 'time',
            default: '00:00',
            value: this.default,
            change: function(el){},
            selectedValue: function(value){},
            _setValue: function(value) {
                this.value = value;
            }
        }, options);

        let keys = {
            UP: 38,
            DOWN: 40,
            ENTER: 13,
        };

        function randstr(prefix) {
            return Math.random().toString(36).replace('0.',prefix || '');
        }

        let pickerId = randstr('picker');
        let pickerSlotId = randstr('picker__slot');
        let pickerListId = randstr('pickerlist');
        let pickerInputId = randstr('picker__input');

        $(this).append(`
            <div class='picker' id="${pickerId}">
                <div class="picker__slot" id="${pickerSlotId}">
                    <div class="picker__controls">
                    <input type="text" name="${config.inputName}" id="${pickerInputId}" class="picker__input" value="${config.default || config.value}" alt="Type time in hours and minutes" maxlength="5" role="combobox" aria-haspopup="listbox" aria-owns="pickerlist" aria-autocomplete="none" aria-expanded="false">
                    <ol class="picker__list" id="${pickerListId}" tabindex="0" role="listbox" aria-labelledby="pickerheader" aria-activedescendant=""></ol>
                    </div>
                </div>
            </div>
        `);

        let pickerListElement = $(`#${pickerListId}`, this);

        pickerListElement.append(
           generateListForTime(config.mode, config.secondGap)
        );
        
        function generateListForTime(mode = 24, gap = 1) {
            if (config.enableHour && config.enableSecond) {
                return generateHourAndSecondList(mode, gap)
            }
          
            if (config.enableHour) {
               return generateOnlyHourList(mode)
            }
          
            if (config.enableSecond) {
               return generateOnlySecondList(gap)
            }
        }

        function generateOnlyHourList(mode = 24) {
            let html = '';

            if (mode === 12) {
                ['AM', 'PM'].forEach(function(item) {
                    for(let i = 1; i <= 12; i++) {
                        let l = i.toString().padStart(2, '0');
                        html += getLiTemplate(`${i}${item}`);
                    }
                });
            }

            if (mode === 24) {
                for(let i = 0; i <= 23; i++) {
                    let l = i.toString().padStart(2, '0');
                    html += getLiTemplate(l);
                }
            }

            return html;
        }

        function generateOnlySecondList(gap = 1) {
            let html = '';

            for(let i = 0; i <= 59; i += gap) {
                let l = i.toString().padStart(2, '0');
                html += getLiTemplate(l);
            }

            return html;
        }

        function generateHourAndSecondList(mode = 24, gap = 1) {
            let html = '';
            let hours = [];
            let seconds = [];

            for(let s = 0; s <= 59; s += gap) {
                let t = s.toString().padStart(2, '0');
                seconds.push(t);
            }

            if (mode === 12) {
                for(let i = 1; i <= 12; i++) {
                    let l = i.toString().padStart(2, '0');
                    hours.push(l);
                }

                ['AM', 'PM'].forEach(function(time) {
                    hours.forEach(function(hour) {
                        seconds.forEach(function(second) {
                            html += getLiTemplate(`${hour}:${second} ${time}`);
                        });
                    });
                });
            }

            if (mode === 24) {
                for(let i = 0; i <= 23; i++) {
                    let l = i.toString().padStart(2, '0');
                    hours.push(l);
                }

                hours.forEach(function(hour) {
                    seconds.forEach(function(second) {
                        html += getLiTemplate(`${hour}:${second}`);
                    });
                });
            }

            return html;
        }

        function getLiTemplate(value) {
            let liId = randstr('pi_');
            return `<li tabindex="-1" role="option" aria-selected="false" class="picker__item" data-value="${value}" id="${liId}">${value}</li>`
        }

        const picker = document.getElementById(pickerId);
        const input = document.getElementById(pickerInputId);
        let list = document.getElementById(pickerListId);

        let items = document.querySelectorAll(`#${pickerListId} li`);
        items = [...items];

        /**
         * Open the time dropdown
         */
        const openDropdown = () => {
            list.classList.add('is-open');
            input.setAttribute('aria-expanded', 'true');
        }

        /**
         * Close the time dropdown
         */
        const closeDropdown = () => {
            list.classList.remove('is-open');
            input.setAttribute('aria-expanded', 'false');
        }

        /**
         * Traverses previous siblings until it finds one with matching class or null
         */
        const prevUntil = (el, className) => {
            console.log('prevuntil', el, className);
            while (el.previousElementSibling && !el.previousElementSibling.classList.contains(className)) {
                el = el.previousElementSibling;
            }
            return el.previousElementSibling;
        }

        /**
         * Traverses next siblings until it finds one with matching class or null
         */
        const nextUntil = (el, className) => {
            console.log('nextUntil', el, className);
            while (el.nextElementSibling && !el.nextElementSibling.classList.contains(className)) {
                el = el.nextElementSibling;
            }
            return el.nextElementSibling;
        }

        /**
         * Traverse the dropdown list in a given direction
         */
        const traverseList = (direction = 'next') => {
            let item = list.querySelector('.picker__item.is-highlighted');
            if (item) {
                item.classList.remove('is-highlighted');
                item.setAttribute('tabindex', -1);

                if (direction == 'prev') {
                    item = prevUntil(item, 'picker__item');

                    if (item == null) {
                        item = list.lastElementChild;
                    }
                } else {
                    item = nextUntil(item, 'picker__item');

                    if (item == null) {
                        item = list.firstElementChild;
                    }
                }

                item.focus();
                item.setAttribute('tabindex', 0);
                item.classList.add('is-highlighted');
            }
        }

        /**
         * Traverse dropdown list if using arrow keys
         * @param  {[type]} e [description]
         */
        const handleKeyNavigation = (e) => {
            if (!e) e = window.event;
            let keyCode = e.keyCode || e.which;

            if (keyCode == keys.UP || keyCode == keys.DOWN) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (keyCode == keys.UP) {
                traverseList('prev');
            }

            if (keyCode == keys.DOWN) {
                traverseList('next');
            }

            if (keyCode == keys.ENTER) {
                if (e.target.matches('li')) {
                    selectDropDownTime(e.target);

                    e.stopPropagation();
                }
            }

            return false;
        }

        /**
         * Key event listeners for input and the dropdown
         */
        input.addEventListener('keydown', (e) => {
            handleKeyNavigation(e);
        });

        list.addEventListener('keydown', (e) => {
            handleKeyNavigation(e);
        });

        /**
         * Find a list item with a similar time
         */
        const findDropDownTime = (time) => {
            let parts = time.split(':');
            let minutes = parseInt(parts[1]);

            if (minutes < 30) {
                minutes = '00';
            } else if (minutes > 30) {
                minutes = '30';
            }

            time = `${parts[0]}:${minutes}`;

            return items.find(item => item.innerText == time);
        }

        /**
         * Suggest a time from the dropdown when opening it
         */
        const suggestDropDownTime = (time) => {
            let item = findDropDownTime(time);
            if (item) {
                item.classList.add('is-highlighted');   
                item.scrollIntoView();
            }
        }

        /**
         * Selects a time from the dropdown
         */
        const selectDropDownTime = (item) => {
            let time = item.innerText;
            setTime(time);

            item.setAttribute('aria-selected', 'true');
            list.setAttribute('aria-activedescendant', item.id);

            closeDropdown();
        }

        /**
         * List / List items event listeners
         */
        list.addEventListener('click', (e) => {
            let target = $(e.target);
            
            config.change(target);
            config.selectedValue(target.attr('data-value'));
            config._setValue(target.attr('data-value'));
            $(pickerInputId).val(target.attr('data-value'));

            if (e.target.matches('li')) {
                selectDropDownTime(e.target);

                e.stopPropagation();
                e.preventDefault(); // Needed to prevent refocus

                return false;
            }
        });

        /**
         * Input field main event listener
         */
        input.addEventListener('focusin', () => {
            openDropdown();
            suggestDropDownTime(input.value);
        });


        /**
         * Activate a preset button
         */
        const activatePreset = (button) => {
            button.setAttribute('aria-pressed', 'true');
            button.classList.add('is-pressed');
        }



        /**
         * Set the time in the input to a set time, or by increment '+00:05' / '-00:05';
         */
        const setTime = (time) => {
            let operation;
            let operator;

            // Clear previously active dropdown items, remember to activate after if relevant
            list.setAttribute('aria-activedescendant', '');
            items.forEach(item => {
                item.classList.remove('is-highlighted');
                item.setAttribute('aria-selected', 'false');
            })

            if (time.includes('+')) {
                operator = '+';
                operation = (a, b) => a + b;
            } else if (time.includes('-')) {
                operator = '-';
                operation = (a, b) => a - b;
            }

            if (operation) {
                time = time.replace(operator, '');
                let partsNew = time.split(':');
                let partsOld = input.value.split(':');
                let minutes = operation(parseInt(partsOld[1]), parseInt(partsNew[1]));
                let hours = operation(parseInt(partsOld[0]), parseInt(partsNew[0]));

                if (minutes > 59) {
                    hours += 1;
                    minutes = minutes - 60;
                } else if (minutes < 0) {
                    hours -= 1;
                    minutes = 60 + minutes;
                }

                if (hours > 23) {
                    hours = 0;
                } else if (hours < 0) {
                    hours = 23;
                }

                time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }


            input.value = time;
        }


        /**
         * Close the dropdown only if clicking outside it
         * @consideration also close if something other than its children gets focus?
         */
        document.addEventListener('click', (e) => {
            if (!picker.contains(e.target) || e.target == picker) {
                closeDropdown();
            }
        })

    }

})(jQuery);