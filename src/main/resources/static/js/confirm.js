var check = function() {
    if (document.getElementById('password').value ==
        document.getElementById('password_confirm').value) {
        document.getElementById('message-test').style.color = '#337ab7';
        document.getElementById('message-test').innerHTML = 'Password confirm!';
    } else {
        document.getElementById('message-test').style.color = 'red';
        document.getElementById('message-test').innerHTML = 'The password and confirm password fields do not match!';
    }
}
