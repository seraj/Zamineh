

const Models = [
    {
        name_en: 'artist',
        name_fa: 'هنرمند',
    },
    {
        name_en: 'artists',
        name_fa: 'هنرمندان',
    }, {
        name_en: 'art',
        name_fa: 'اثر',
    }, {
        name_en: 'shows',
        name_fa: 'نمایشگاه‌ها',
    },
    {
        name_en: 'show',
        name_fa: 'نمایشگاه',
    },
    {
        name_en: 'medium',
        name_fa: 'بستر',
    },
    {
        name_en: 'gallery',
        name_fa: 'گالری',
    },
    {
        name_en: 'galleries',
        name_fa: 'گالری‌ها',
    },
    {
        name_en: 'article',
        name_fa: 'مقاله',
    },
    {
        name_en: 'genre',
        name_fa: 'دسته بندی',
    },
    {
        name_en: 'collect',
        name_fa: 'آثار',
    },
    {
        name_en: 'collections',
        name_fa: 'مجموعه',
    },
]

export default function ModelManager() {

    return {
        getCompanies: function () {
            return Models;
        },
        convertModelName: function (name) {
            var nameFa = null
            Models.map((item, index) => {
                if (name === item.name_en)
                    nameFa = item.name_fa;
            }
            )
            return nameFa;
        }
    }
}