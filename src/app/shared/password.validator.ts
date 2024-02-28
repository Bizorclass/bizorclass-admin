import { AbstractControl, ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let _value = control.value;

        var lowerCaseLetters = /[a-z]/g;
        var upperCaseLetters = /[A-Z]/g;
        var numbers = /[0-9]/g;
        var specialCharacters = /(?=.*[@#$%^&+=!*])/g;
        let flag = true;
        let helperText = "";

        if (_value === "") {
            helperText = "Please Enter Password.";
            flag = false;
        }
        // Validate length
        else if (_value?.length <= 7) {
            helperText = "Password must be more than 7 letters!";
            flag = false;
        }
        // Validate capital letters
        else if (!_value?.match(upperCaseLetters)) {
            helperText = "Password must contain 1 Uppercase!";
            flag = false;
        } else if (!_value?.match(lowerCaseLetters)) {
            helperText = "Password must contain 1 Lowercase!";
            flag = false;
        }
        // Validate numbers
        else if (!_value?.match(numbers)) {
            helperText = "Password must contain 1 Number!!";
            flag = false;
        } else if (!_value?.match(specialCharacters)) {
            helperText = "Password must contain 1 Special Character!";
            flag = false;
        } else {
            helperText = "";
            flag = true;
        }

        return flag ? null : { 'passwordValidator': helperText };
    };
}
