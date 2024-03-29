"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import sytles from './mapBox.module.css';
import mockCustomMarkers from '@/app/mockData/mockData';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_API_KEY;



export default function MapBox({
    useOwnLocation = true,
    currentSession,
    initialLocation = { lng: 3.224700, lat: 51.209348 },
    locationIcon = "/icons/black/parking.svg",
    markers = mockCustomMarkers.parkings,
    onMarkerClick = () => { }
}) {
    const markerSize = 25;
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [initialLocation.lng, initialLocation.lat],
            zoom: 14
        });

        mapRef.current.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl }), 'top-left');

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        markerRef.current = new mapboxgl.Marker();

        return () => mapRef.current.remove();
    }, []);

    useEffect(() => {
        if (currentSession && mapRef.current) {
            const el = document.createElement('div');
            el.className = 'custom-marker'
            el.style.backgroundImage = 'url(' + '/icons/blue/parking.svg' + ')';
            el.style.width = markerSize + 'px';
            el.style.height = markerSize + 'px';
            el.style.backgroundSize = 'cover';
            el.style.zIndex = 2;
            const newMarker = new mapboxgl.Marker(el)
                .setLngLat([currentSession.parking.location.lng, currentSession.parking.location.lat])
                .setPopup(new mapboxgl.Popup({ offset: markerSize / 2 })
                    .setHTML(`
                    <h3 style='color:black'>${currentSession.parking.name}</h3>
                    <p style='color:black'>You're parked here</p>
                `))
                .addTo(mapRef.current);
            newMarker.getElement().addEventListener('click', (e) => {
                e.preventDefault();
                onMarkerClick(currentSession.parking);
            })
        }
    }, [currentSession])


    useEffect(() => {
        if (markers && mapRef.current) {
            markers.forEach(marker => {
                const el = document.createElement('div');
                el.className = 'custom-marker'
                el.style.backgroundImage = 'url(' + locationIcon + ')';
                el.style.width = markerSize + 'px';
                el.style.height = markerSize + 'px';
                el.style.backgroundSize = 'cover';

                const newMarker = new mapboxgl.Marker(el)
                    .setLngLat([marker.location.lng, marker.location.lat])
                    .setPopup(new mapboxgl.Popup({ offset: markerSize / 2 })
                        .setHTML(`<h3 style='color:black'>${marker.name}</h3>`))
                    .addTo(mapRef.current);
                newMarker.getElement().addEventListener('click', (e) => {
                    e.preventDefault();
                    onMarkerClick(marker);
                })
            });
        }
    }, [markers])

    useEffect(() => {
        if (navigator.geolocation && mapRef.current) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLocation = [position.coords.longitude, position.coords.latitude];

                const el = document.createElement('div');
                el.className = 'user-location-marker';
                el.style.width = markerSize + 'px';
                el.style.height = markerSize + 'px';
                el.style.backgroundSize = 'cover';
                el.style.backgroundImage = 'url(/icons/blue/person.svg)';

                new mapboxgl.Marker(el)
                    .setLngLat(userLocation)
                    .addTo(mapRef.current);

                if (useOwnLocation) {
                    mapRef.current.flyTo({
                        center: userLocation,
                        essential: true,
                        zoom: 14
                    });
                }
            }, () => {
                console.error('Error in the geolocation service.');
            })
        }
    }, [])


    return <div ref={mapContainerRef} className={sytles['map-box-container']} style={{ width: '100%', height: '400px' }} />;
};
