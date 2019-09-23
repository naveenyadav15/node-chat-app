const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


//Options
const {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const autoscroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild;

    // Heigth of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginTop);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // visible height
    const visibleHeight = $messages.offsetHeight;

    // container height
    const containerHeight = $messages.scrollHeight;

    // how far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', (mesg) => {

    const html = Mustache.render(messageTemplate, {
        username: mesg.username,
        message: mesg.text,
        createdAt: moment(mesg.createdAt).format('h:mm a'),
    })

    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', (mesg) => {
    console.log(mesg);
    const html = Mustache.render(locationTemplate, {
        username: mesg.username,
        url: mesg.url,
        createdAt: moment(mesg.createdAt).format('h:mm a'),
    })
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('roomData', ({
    room,
    users
}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    })
    document.querySelector('#sidebar').innerHTML = html;
})



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

socket.emit('join', {
    username,
    room
}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
});