$(document).on('turbolinks:load', function() {

    $('#new_user').validate({
        rules: {
            'user[email]': {
                required: true,
                email: true
            },
            'user[password]': {
                required: true,
                minlength: 6
            },
            'user[password_confirmation]': {
                required: true,
                equalTo : "#user_password"
            }
        }
    });

});