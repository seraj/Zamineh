
export default function Urls() {

    return {
        api() {
            return 'https://api.zamineh.net/web-api';
        },
        // Home Page Components

        Magzine() {
            return '/mag/';
        },

        arts() {
            return '/artwork/';
        },
        artist() {
            return '/artist/';
        },
        artists() {
            return '/artists/'
        },
        medium() {
            return '/medium/'
        },


        // Galleries
        galleries() {
            return '/galleries/'
        },
        galleriesAZ() {
            return '/galleries/a-z/'
        },
        gallery() {
            return '/gallery/'
        },



        show() {
            return '/show/';
        },
        search() {
            return '/search/';
        },
        collect() {
            return '/collect/'
        },
        collections() {
            return '/collections/'
        },
        withProps(model) {
            var url;
            switch (model) {
                case 'article':
                    url = this.Magzine();
                    break;
                case 'artist':
                    url = this.artist();
                    break;
                case 'gallery':
                    url = this.gallery();
                    break;
                case 'show':
                    url = this.show();
                    break;
                case 'medium':
                    url = this.medium();
                    break;
                default:
                    url = '/';
            }
            return url
        },

        // Registration URL
        ArtistRegistration() {
            return '/registration/artist';
        },
        GalleryRegistration() {
            return '/registration/gallery';
        },
        AddSingleArt() {
            return '/registration/artist/singleart';
        },

        Profile() {
            return '/profile'
        }
    }
}
