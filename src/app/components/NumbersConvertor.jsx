export default function NumbersConvertor() {



    return {


        convertArabicToLatin: function (input) {
            if (input == undefined)
                return;
            var inLatin = '',



                mapping = {
                    '١': '1',
                    '٢': '2',
                    '٣': '3',
                    '٤': '4',
                    '٥': '5',
                    '٦': '6',
                    '٧': '7',
                    '٨': '8',
                    '٩': '9',
                    '٠': '0',
                }

            input = input.toString();
            for (var i = 0; i < input.length; i++)
                if (mapping[input[i]])
                    inLatin += mapping[input[i]];
                else
                    inLatin += input[i];

            return inLatin;

        },

        convertToLatin: function (input) {
            if (input == undefined)
                return;
            var inLatin = '',
                mapping = {
                    '۱': '1',
                    '۲': '2',
                    '۳': '3',
                    '۴': '4',
                    '۵': '5',
                    '۶': '6',
                    '۷': '7',
                    '۸': '8',
                    '۹': '9',
                    '۰': '0'
                };




            input = input.toString();
            for (var i = 0; i < input.length; i++)
                if (mapping[input[i]])
                    inLatin += mapping[input[i]];
                else
                    inLatin += input[i];


            inLatin = this.convertArabicToLatin(inLatin)

            return inLatin;

        },
        convertToPersian: function (input) {
            if (input == undefined)
                return;
            var inPersian = '',
                mapping = {
                    '1': '۱',
                    '2': '۲',
                    '3': '۳',
                    '4': '۴',
                    '5': '۵',
                    '6': '۶',
                    '7': '۷',
                    '8': '۸',
                    '9': '۹',
                    '0': '۰'
                };
            input = input.toString();
            for (var i = 0; i < input.length; i++)
                if (mapping[input[i]])
                    inPersian += mapping[input[i]];
                else
                    inPersian += input[i];

            return inPersian;

        }
    }



}