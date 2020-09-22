import React from 'react';
import Loading from '../../loading/loading.jsx'
import { compose, withProps } from "recompose";
import marker from './marker.png'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import dotenv from 'dotenv';


dotenv.config();
let cord = {lat: 32,lng:34};

const GMap = compose(
    withProps({
        // 
        googleMapURL: process.env.REACT_APP_GOOGLE_API_LINK,
        loadingElement: <Loading />,
        containerElement: <div style={{ height: `calc(100vh - 60px)`, width: '100vw', position: 'absolute' }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) => {
    cord.lat++;
    cord.lng++;
    if(props.stores[0]){
        var centerMap={
            lat:Number(props.stores[0].coords.lat),
            lng:Number(props.stores[0].coords.lng)
        }

    }
    
    return (
        <GoogleMap
            onClick={(e) => props.mapClick(e)}
            defaultZoom={8}
            
            defaultCenter={props.stores[0]?{
                lat:Number(props.stores[0].coords.lat),
                lng:Number(props.stores[0].coords.lng)}:{lat: 35.77451720813653, lng: 3.15603125}}
            minZoom={3}
            key={cord.lat+cord.lng+2*props.stores.length}
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


