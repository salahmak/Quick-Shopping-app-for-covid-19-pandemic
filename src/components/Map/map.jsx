import React, { useState } from 'react';
import StoreCard from '../storeCard/storeCard.jsx'
import marker from './marker.png'
import Loading from '../loading/loading.jsx'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


import './map.css'



const GoogleMap = (props) => {





    const [selectedStore, setSelectedStore] = useState({});
    const [showItems, setShowItems] = useState(false);


    const onMarkerClick = (props, marker, e) => {
        setSelectedStore(props.store)
        setShowItems(true)
    }



    const onItemsClose = () => {
        setShowItems(false)
        setSelectedStore({});
    }

    const handleInputChange = (e) => {
        setSelectedStore({ ...selectedStore, [e.target.name]: e.target.value })
    }

    const handleItemChange = (prop, event, index) => {
        const old = selectedStore.items[index];
        const updated = { ...old, [prop]: event.target.value }
        const clone = [...selectedStore.items];
        clone[index] = updated;
        setSelectedStore({ ...selectedStore, items: clone })
    }

    const addItem = () => {
        const newItem = { name: "", quantity: "", unit: "" };
        setSelectedStore({ ...selectedStore, items: selectedStore.items.concat(newItem) })
    }

    const deleteItem = (i) => {
        setSelectedStore({ ...selectedStore, items: selectedStore.items.filter((item, index) => index !== i) })
    }


    const deleteStore = () => {
        props.setBtnLoading(true)
        fetch('https://covid-19-shopping.herokuapp.com/deletestore', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedStore)
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(stores => {
                if (Array.isArray(stores)) {
                    props.HandleStoreChange(stores)
                    props.setBtnLoading(false)
                    setShowItems(false)
                } else {
                    console.log("Bad response from server")
                }
            })
    }


    const onStoreEdit = () => {
        props.setBtnLoading(true)
        fetch('https://covid-19-shopping.herokuapp.com/editstore', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedStore)
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(stores => {
            if (Array.isArray(stores)) {
                props.HandleStoreChange(stores)
                props.setBtnLoading(false)
                setShowItems(false)
            } else {
                console.log("Bad response from server")
            }
        })
    }


    const mapStyles = {
        width: '100vw'
    };


    return (


        <Map
            className="map-wrapper"
            google={props.google}
            onClick={props.mapClick}
            zoom={8}
            style={mapStyles}
            initialCenter={{ lat: 35.77451720813653, lng: 3.15603125 }}

        >
            <Marker position={props.currentMarker} />

            {props.stores.map((store, i) => {
                return (
                    <Marker icon={{ url: marker, scaledSize: new props.google.maps.Size(34, 34) }} key={i} user={props.user} store={store} position={store.coords} onClick={(props, marker) => onMarkerClick(props, marker)} />


                )
            })}

            {showItems && <StoreCard deleteStore={deleteStore} btnLoading={props.btnLoading} onStoreEdit={onStoreEdit} deleteItem={deleteItem} addItem={addItem} handleItemChange={handleItemChange} handleChange={handleInputChange} onItemsClose={onItemsClose} store={selectedStore} user={props.user} />
            }
        </Map>
    );
}



export default GoogleApiWrapper({
    apiKey: 'AIzaSyDRvYpK6ySVnY1WbKQlrsmO1Oy6pEHq_co',
    LoadingContainer: (Loading)
})(GoogleMap);


