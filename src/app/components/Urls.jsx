
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
        profile() {
            return '/client/profile/'
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
        collection() {
            return '/collection/'
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
                case 'art':
                    url = this.arts();
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

        // Gallery Artist URLS
        GalleryProfile() {
            return '/panel/gallery/'
        },
        GalleryDashboard() {
            return '/panel/gallery/dashboard/'
        },
        GalleryRegistration() {
            return '/panel/gallery/registration/';
        },
        AddExhibitionsGallery() {
            return '/panel/gallery/registration/add-exhibition';
        },



        ArtistProfile() {
            return '/panel/artist/'
        },
        ArtistDashboard() {
            return '/panel/artist/dashboard/'
        },
        ArtistRegistration() {
            return '/panel/artist/registration/';
        },
        AddSingleArt() {
            return '/panel/artist/registration/add-art';
        },
        AddCollections() {
            return '/panel/artist/registration/add-collection';
        },
        AddExhibitions() {
            return '/panel/artist/registration/add-exhibition';
        }

    }
}
