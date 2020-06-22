import React from 'react';
import Loading from '../../loading/loading.jsx'
import { compose, withProps } from "recompose";
import marker from './marker.png'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const GMap = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDRvYpK6ySVnY1WbKQlrsmO1Oy6pEHq_co&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <Loading />,
        containerElement: <div style={{ height: `calc(100vh - 60px)`, width: '100vw', position: 'absolute' }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) => {
    return (
        <GoogleMap
            onClick={(e) => props.mapClick(e)}
            defaultZoom={8}
            defaultCenter={{ lat: 35.77451720813653, lng: 3.15603125 }}
            minZoom={3}
        >

            {props.currentStore.coords.lat !== undefined && <Marker position={props.currentStore.coords} />}


            {props.stores.map((store, i) => {
                return (
                    <Marker options={{ icon: { url: marker, size: new window.google.maps.Size(34, 34), scaledSize: new window.google.maps.Size(34, 34) } }} key={store.id} position={{ lat: Number(store.coords.lat), lng: Number(store.coords.lng) }} onClick={() => props.onMarkerClick(i)} />
                )
            })}
        </GoogleMap>
    )
}
)
export default GMap;


