const socket = io()


socket.on('message', (mesg) => {
    console.log(mesg);
})

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const mesg = event.target.elements.message.value;

    $messageFormButton.setAttribute('disabled', 'disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();


    socket.emit('sendMessage', mesg, (error) => {

        $messageFormButton.removeAttribute('disabled');

        if (error) {
            return console.log(error);
        }
        console.log('Message Delivered!');

    });
})

$sendLocationButton.addEventListener('click', (event) => {
    if (!navigator.geolocation) {
        return alert('Your browser is not supported!');
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);
        $sendLocationButton.removeAttribute('disabled');
        socket.emit('sendLocation', {

            lat: position.coords.latitude,
            long: position.coords.longitude
        }, () => {
            console.log('Location Shared!');
        });
    })
})