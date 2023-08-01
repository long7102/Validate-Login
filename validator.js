// Đối tượng validator
function Validator(options){
    function validate(inputElement, rule){
        var errorMessage = rule.test(inputElement.value)
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    if(errorMessage){
                        errorElement.innerText = errorMessage;
                        inputElement.parentElement.classList.add('invalid')
                    }
                    else{
                        errorElement.innerText = ''
                        inputElement.parentElement.classList.remove('invalid')
                    }

                }

                //lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement){
        options.rules.forEach(function (rule){
            var inputElement = formElement.querySelector(rule.selector)                              
            if(inputElement){
                // Xử lí trường hợp blur khỏi input
                inputElement.onblur = function() {
                validate(inputElement,rule)
                }
                //Xử lí mỗi khi nhập vào input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector('.form-message')
                    errorElement.innerText = ''
                        inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
    }
}
//định nghĩa các rule
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail = function(selector, value) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/
            return regex.test(value) ? undefined: 'Vui lòng kiểm tra lại email'
        }
    }
}
Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined: `Tối thiểu ${min} kí tự`
        }
    }
}