
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
export function SingleExhibitionValidation(value) {
    console.log(value)
    if (
        value.title == '' ||
        value.title == undefined ||
        value.desc == '' ||
        value.desc == null ||
        value.address.address == undefined ||
        value.address.address == '' ||
        value.address.tel == undefined ||
        value.address.tel == '' ||
        value.start_time == undefined ||
        value.start_time == '' ||
        value.end_time == undefined ||
        value.end_time == ''
        // value.start_date == undefined ||
        // value.start_date == '' ||
        // value.end_date == undefined ||
        // value.end_date == ''


    ) {
        return false
    } else {
        return true
    }
}
export function CollectionAllArtValidation(value) {
    var ret = true;
    for (let index = 0; index < value.length; index++) {
        const element = value[index];
        if (
            element.name == '' ||
            element.name == undefined ||
            element.year == '' ||
            element.year == undefined ||
            element.mat_set == '' ||
            element.mat_set == null ||
            element.medium_set == '' ||
            element.medium_set == null ||
            element.bio == '' ||
            element.bio == null ||
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

export function SingleArtValidation(value) {
    if (
        value.name == '' ||
        value.name == undefined ||
        value.year == '' ||
        value.year == undefined ||
        value.mat_set == '' ||
        value.mat_set == null ||
        value.medium_set == '' ||
        value.medium_set == null ||
        value.bio == '' ||
        value.bio == null ||
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

export function SingleCollectionArtValidation(value) {
    var ret = true;
    for (let index = 0; index < value.length; index++) {
        const element = value[index];
        if (
            element.name == '' ||
            element.name == undefined ||
            element.year == '' ||
            element.year == undefined ||
            element.mat_set == '' ||
            element.mat_set == null ||
            element.medium_set == '' ||
            element.medium_set == null ||
            element.bio == '' ||
            element.bio == null ||
            element.size == '' ||
            element.size == null ||
            element.size.width == undefined ||
            element.size.height == undefined ||
            element.size.depth == undefined
        ) {
            ret = false;
            break;
        }
    }
    return ret
}