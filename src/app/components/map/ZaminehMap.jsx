import React, { Component } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import './ZaminehMap.scss';
import leafletPip from 'leaflet-pip';
import 'leaflet/dist/leaflet.css';

class ZaminehMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mapMarker: {},

        }
    }
    componentDidMount() {
        var greenIcon = L.icon({
            iconUrl: 'http://zamineh.net/static/default_imgs/marker.svg',
            iconSize: [45, 65], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [13, 36], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var self = this;
        this.map = L.map('map', {
            center: this.props.mapPosition,
            zoom: this.props.mapZoom,
            minZoom: 10,
            color: '#333',

            layers: [
                L.tileLayer.wms('http://map.ir/shiveh', {
                    maxZoom: 18,
                    layers: 'Shiveh:ShivehGSLD256',
                    format: 'image/png',
                    attribution: '',
                    id: 'mapbox.streets'
                })

            ]
        });
        // console.log(this.props.markerPosition,this.props.currentLocation)
        if (this.props.markerPosition !== undefined) {
            var theMarker = self.state.mapMarker;
            // L.marker(this.props.markerPosition).addTo(this.map);
            theMarker = L.marker(this.props.markerPosition, { icon: greenIcon }).addTo(this.map);
            self.setState({ mapMarker: theMarker });
        }
        if (this.props.currentLocation) {
            this.map.on('load', function (e) {

                self.map.locate({ setView: true }).on('locationfound', function (e) {
                    var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
                    var circle = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
                        weight: 0.6,
                        color: 'blue',
                        fillColor: '#cacaca',
                        fillOpacity: 0.2
                    });
                    // self.map.addLayer(marker);
                    self.map.addLayer(marker);
                })
                    .on('locationerror', function (e) {
                        // console.log(e);
                        // console.log('Location access denied.');
                    });


            }());
        }

        this.map.on('click', function (e) {
            var theMarker = self.state.mapMarker;



            var lat = e.latlng.lat;
            var lon = e.latlng.lng;

            //Clear existing marker, 

            if (theMarker != undefined) {
                this.removeLayer(theMarker);
            };


            //Add a marker to show where you clicked.
            theMarker = L.marker([lat, lon], { icon: greenIcon }).addTo(this);
            self.setState({ mapMarker: theMarker });

            self.props.onClick(e)

        });


    }
    render() {
        return (
            <div id={'map'} />
        );
    }
}

ZaminehMap.propTypes = {
    mapPosition: PropTypes.arrayOf(PropTypes.number),
    mapZoom: PropTypes.number,
    markerPosition: PropTypes.arrayOf(PropTypes.number),
};

ZaminehMap.defaultProps = {
    mapPosition: [35.7, 51.4],
    mapZoom: 11,
};


export default ZaminehMap;