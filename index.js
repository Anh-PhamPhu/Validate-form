function Validator(options){
    const selectorRules = {};

    function validate(inputElement, rule){
        const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        const rules = selectorRules[rule.selector];
        console.log(rules)
        for(var i = 0; i < rules.length; i++){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage

    }
    const formElement = document.querySelector(options.form);
    formElement.onsubmit = function(e){
        e.preventDefault();
        let isFormValid = true;
        options.rules.forEach((rule) =>{
            const inputElement = formElement.querySelector(rule.selector);
            let isValid = validate(inputElement, rule);
            if(!isValid){
                isFormValid = false;
            }
        })
        if(isFormValid){
            if(typeof options.onSubmit === 'function'){
                let enableInputs = formElement.querySelectorAll('[name');
                var formValues = Array.from(enableInputs).reduce((values, index) =>{
                    return (values[input.name] = input.value) && values;
                },{})
            }
            options.onSubmit(formValues)
        }else{
            formElement.onsubmit = function(e){
                e.preventDefault()
            };
        }
    }
    if(formElement){
        options.rules.forEach((rule) =>{

            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
            
            const inputElement = document.querySelector(rule.selector)
            if(inputElement){
                inputElement.onblur = function(e){
                    validate(inputElement, rule);
                }
                inputElement.oninput = function(){
                    const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    inputElement.parentElement.classList.remove('invalid');
                    errorElement.innerText = "";
                }
            }
        })
    }
    // console.log(selectorRules)
    
}

Validator.isRequired = function(selector){
    return {
        selector,
        test(value){
            return value.trim() ? undefined : 'Vui lòng nhập trường này';
        }
    }
}
Validator.isEmail = function(selector){
    return {
        selector,
        test(value){
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là email'
        }
    }
}
Validator.isPassword = function(selector, minLength){
    // console.log(minLength) 
    return {
        selector,
        test(value){
            return value.length >= minLength ? undefined : 'Vui lòng nhập password ( Tối thiểu 6 ký tự ) '
        }
    }
}
Validator.isConfirm = function(selector, confirm){
    return {
        selector,
        test(value){
            return value ===  confirm() && value !== '' ? undefined : 'Dữ liệu nhập vào không chính xác'
        }
    }
}