# Simple Timepicker


## Installation

- Need jQuery 
- add script [https://unpkg.com/the-simple-timepicker@2.0.0/simple-timepicker.min.js](https://unpkg.com/the-simple-timepicker@2.0.0/simple-timepicker.min.js)
- add css [https://unpkg.com/the-simple-timepicker@2.0.0/simple-timepicker.min.css](https://unpkg.com/the-simple-timepicker@2.0.0/simple-timepicker.min.css)

## Implementation

```javascript

  <div id="timer_picker"></div>


  <script>
    $('#timer_picker').timePicker({
        mode: 24, // you can use 12 
        minuteGap: 5,
        enableHour: true,
        enableSecond: true,
        inputName: 'time', // you can use your own input field name
        default: '00:05',
        selectedValue: function(value) {
           .... 
        },
        change: function(el) {
           .... 
        }
    })
  </script>

```

## Improvement
- Should be implement multiple timepicker in same page

### credit goes to [https://codepen.io/larsmagnus/pen/xYrKLj](https://codepen.io/larsmagnus/pen/xYrKLj)
