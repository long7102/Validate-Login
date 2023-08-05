// Đối tượng validator
function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    var selectorRules = {}
    //hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
        var errorMessage
        //lấy ra các rule của selector
        var rules = selectorRules[rule.selector]
        //lặp qua từng phần tử rule và kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break
                default:
                    errorMessage = rules[i](inputElement.value)
            }

            if (errorMessage) break
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        }
        else {
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage

    }

    //lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        //khi submit form
        formElement.onsubmit = (e) => {
            e.preventDefault()
            var isFormValid = true
            //lắp qua từng rule và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false
                }
            });

            if (isFormValid) {
                //Submit với js
                if (typeof options.onSubmit == 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="'+ input.name + '"]:checked') 
                                break
                            case 'checkbox':
                                if(input.matches(':checked')) {
                                    values[input.name] = ''
                                    return values
                                }
                                if(!Array.isArray(values[input.name]))  {
                                    values[input.name] = []
                                }   
                                values[input.name].push(input.value)                          
                                break
                                case 'file':
                                    values[input.name] = input.files
                                    break
                            default:
                                values[input.name] = input.value
                        }
                        return values
                    }, {})
                    options.onSubmit(formValues)
                }
                //Submit với html
                else {
                    formElement.submit()
                }
            }
            else {
                console.log('Không có lỗi')
            }
        }
        //lặp qua mỗi rule và xử lí
        options.rules.forEach(function (rule) {
            //lưu lại các rule của input
            if (Array.isArray(selectorRules[rule.errorSelector])) {
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }
            var inputElements = formElement.querySelectorAll(rule.selector)
            Array.from(inputElements).forEach(function (inputElement) {
                // Xử lí trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }
                //Xử lí mỗi khi nhập vào input
                inputElement.onchange = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message')
                    errorElement.innerText = ''
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
            })

        });
    }
}
//định nghĩa các rule
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail = function (selector, value, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Vui lòng kiểm tra lại email'
        }
    }
}
Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Tối thiểu ${min} kí tự`
        }
    }
}
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || `Giá trị nhập vào không chính xác`
        }
    }
}