var check = function() {
    if (document.getElementById('password').value ==
        document.getElementById('password_confirm').value) {
        document.getElementById('message-test').style.color = '#337ab7';
        document.getElementById('message-test').innerHTML = 'Password confirm!';
        document.getElementById('sign_up_btn').disabled = false;
    } else if (document.getElementById('password').value == "" || document.getElementById('password_confirm').value == "") {
        document.getElementById('message-test').style.color = 'red';
        document.getElementById('message-test').innerHTML = 'All fields must be filled!';
        document.getElementById('sign_up_btn').disabled = true;
    } else {
        document.getElementById('message-test').style.color = 'red';
        document.getElementById('message-test').innerHTML = 'The password and confirm password fields do not match!';
        document.getElementById('sign_up_btn').disabled = true;
    }
}
