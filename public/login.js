const EmailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglepassword = document.getElementById('togglePassword');
const rememberInput = document.getElementById('remember');
const Submitbutton = document.querySelector('button[type="submit"]');

togglepassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

Submitbutton.addEventListener('click', (event) => {
    event.preventDefault();

    if (EmailInput.value === '') {
        alert('Please Enter Your Email');
        return;
    }

    const password = passwordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return;
    }

    if (rememberInput.checked) {
        alert('Please accept Remember Me Option');
        return;
    }

    alert('Login Form Submit Successfully');


});
