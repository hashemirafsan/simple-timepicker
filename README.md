# Simple Timepicker


## Installation

- Need jQuery 
- add script [https://unpkg.com/the-simple-timepicker@1.0.0/simple-timepicker.min.js](https://unpkg.com/the-simple-timepicker@1.0.0/simple-timepicker.min.js)
- add css [https://unpkg.com/the-simple-timepicker@1.0.0/simple-timepicker.min.css](https://unpkg.com/the-simple-timepicker@1.0.0/simple-timepicker.min.css)

## Implementation

```javascript

  <div id="timer_picker"></div>


  <script>
    $('#timer_picker').timePicker({
        mode: 24, // you can use 12 
        secondGap: 5,
        enableHour: true,
        enableSecond: true,
        inputName: 'time' // you can use your own input field name
    })
  </script>

```

### credit goes to [https://codepen.io/larsmagnus/pen/xYrKLj](https://codepen.io/larsmagnus/pen/xYrKLj)
