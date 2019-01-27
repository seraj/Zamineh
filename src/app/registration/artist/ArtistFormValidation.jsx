import NumbersConvertor from '../../components/NumbersConvertor';
import { ShebaValidation } from '../../components/Validation';
import { TextAreaWordLimit } from '../../components/Validation';



export function Step1Validation(value) {
    if (
        value.first_name == '' ||
        value.first_name == undefined ||
        value.last_name == '' ||
        value.last_name == undefined ||
        value.address == '' ||
        value.address == undefined ||
        value.email == '' ||
        value.email == undefined ||
        value.phone_num == '' ||
        value.phone_num == undefined
    ) {
        return false
    } else {
        return true
    }
}
export function MobileValidator(value) {
    var regexp = /^[0][9][0-9]{9,9}$/;
    var error;
    if (value && !regexp.test(NumbersConvertor().convertToLatin(value))) {
        error = 'شماره تلفن را به درستی وارد کنید'
    }

    return error
}
export function ValidateShebaNum(value) {
    var error;
    if (!value) error = ''
    else {

        if (!ShebaValidation(value)) {
            error = 'شماره شبای وارد شده معتبر نمی باشد'
        }
    }
    return error
}
export function ValidateTextArea(value) {
    var error;
    if (!value) error = 'زندگی نامه نمیتواند خالی باشد'
    else {

        if (TextAreaWordLimit(value, 500)) {
            error = 'شما باید حداقل ۵۰۰ لغت در مورد خود بنویسید'
        }
    }
    return error
}
export function AllExbValidation(value) {
    var ret = true;
    for (let index = 0; index < value.length; index++) {
        const element = value[index];
        console.log(element);
        if (
            element.type == '' ||
            element.type == undefined ||
            element.name == '' ||
            element.name == undefined ||
            element.date == '' ||
            element.date == null ||
            element.address == '' ||
            element.address == null ||
            element.desc == '' ||
            element.desc == null ||
            element.submitted == false
        ) {
            ret = false;
            break;
        }
    }
    return ret
}
export function SingleExbValidation(value) {
    if (
        value.type == '' ||
        value.type == undefined ||
        value.name == '' ||
        value.name == undefined ||
        value.date == '' ||
        value.date == null ||
        value.address == '' ||
        value.address == null ||
        value.desc == '' ||
        value.desc == null
    ) {
        return false
    } else {
        return true
    }
}

export function AllArtValidation(value) {
    var ret = true;
    for (let index = 0; index < value.length; index++) {
        const element = value[index];
        console.log(element);
        if (
            element.name == '' ||
            element.name == undefined ||
            element.year == '' ||
            element.year == undefined ||
            element.mat_set == '' ||
            element.mat_set == null ||
            element.size == '' ||
            element.size == null ||
            element.size.width == undefined ||
            element.size.height == undefined ||
            element.size.depth == undefined ||
            element.submitted == false
        ) {
            ret = false;
            break;
        }
    }
    return ret
}
export function CollectionAllArtValidation(value) {
    var ret = true;
    for (let index = 0; index < value.length; index++) {
        const element = value[index];
        console.log(element);
        if (
            element.name == '' ||
            element.name == undefined ||
            element.year == '' ||
            element.year == undefined ||
            element.mat_set == '' ||
            element.mat_set == null ||
            element.medium_set == '' ||
            element.medium_set == null ||
            element.size == '' ||
            element.size == null ||
            element.size.width == undefined ||
            element.size.height == undefined ||
            element.size.depth == undefined ||
            element.gallery == '' ||
            element.gallery == null ||
            element.submitted == false
        ) {
            ret = false;
            break;
        }
    }
    return ret
}
export function SingleCollectionValidation(value) {
    if (
        value.name == '' ||
        value.name == undefined ||
        value.desc == '' ||
        value.desc == null
    ) {
        return false
    } else {
        return true
    }
}
export function SingleCollectionArtValidation(value) {
    var ret = true;
    for (let index = 0; index < value.length; index++) {
        const element = value[index];
        console.log(element);
        if (
            element.name == '' ||
            element.name == undefined ||
            element.year == '' ||
            element.year == undefined ||
            element.mat_set == '' ||
            element.mat_set == null ||
            element.medium_set == '' ||
            element.medium_set == null ||
            element.size == '' ||
            element.size == null ||
            element.size.width == undefined ||
            element.size.height == undefined ||
            element.size.depth == undefined ||
            element.gallery == '' ||
            element.gallery == null ||
            element.submitted == false
        ) {
            ret = false;
            break;
        }
    }
    return ret
}
export function SingleArtValidation(value) {
    if (
        value.name == '' ||
        value.name == undefined ||
        value.year == '' ||
        value.year == undefined ||
        value.mat_set == '' ||
        value.mat_set == null ||
        value.size == '' ||
        value.size == null ||
        value.size.width == undefined ||
        value.size.height == undefined ||
        value.size.depth == undefined
    ) {
        return false
    } else {
        return true
    }
}