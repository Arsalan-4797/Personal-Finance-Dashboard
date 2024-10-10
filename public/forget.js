const mailInput = document.getElementById('email');
const clickInput = document.querySelector('button[type="submit"]');

clickInput.addEventListener('click', (event) => {
    event.preventDefault();

    if (mailInput.value === '') {
        alert('Please Enter Your Email');
    }
});