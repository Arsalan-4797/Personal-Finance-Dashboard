const fullNameInput = document.getElementById('fname');
const usernameInput = document.getElementById('user');
const emailInput = document.getElementById('email');
const PasswordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const confirmpasswordInput = document.getElementById('confirm');
const togglePassword1 = document.getElementById('TogglePassword')
const TermsInput = document.getElementById('conditions');
const submitbutton = document.querySelector('button[type="submit"]');

togglePassword.addEventListener('click', function () {
    const type = PasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    PasswordInput.setAttribute('type', type);

    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

togglePassword1.addEventListener('click', function () {
    const type = confirmpasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmpasswordInput.setAttribute('type', type);

    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});


submitbutton.addEventListener('click', (event) => {
    event.preventDefault();

    if (fullNameInput.value === '') {
        alert('Please enter your full name');
        return;
    }
    const username = usernameInput.value;
    if (username.length < 6 || username.length > 15) {
        alert('Username must be between 6 and 15 Characters');
        return;
    }

    if (emailInput.value === '') {
        alert('Please Enter Your Email');
        return;
    }

    const password = PasswordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return;
    }

    if (password !== confirmpasswordInput.value) {
        alert('password do not Match. Please confirm your Password');
        return;
    }

    if (!TermsInput.checked) {
        alert("Please accept terms and Conditions");
        return;
    }

    alert('Form Submit Successfully');


});
