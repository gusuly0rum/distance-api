const socket = window.io.connect('http://localhost:5000');
const service = new window.google.maps.DirectionsService();

socket.on('connection', function (data) {
  let row = 0;
  const names = data[0];

  names.forEach((address2, col) => {

    var request = {
      origin: names[row] + ', MA',
      destination: address2 + ', MA',
      unitSystem: window.google.maps.UnitSystem.IMPERIAL,
      travelMode: window.google.maps.DirectionsTravelMode.DRIVING
    };

    setTimeout(() => service.route(request, (response, status) => {
      if (status === 'OK') {
        const thing = [row, col, response];
        console.log(thing);
        socket.emit('response', thing);
      } else {
        console.log(status);
      }
    }), 2000 * col);

  });

});