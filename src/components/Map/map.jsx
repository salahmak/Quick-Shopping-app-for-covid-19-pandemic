import React, { useState, memo, useCallback } from 'react';
import StoreCard from '../storeCard/storeCard.jsx'
import marker from './marker.png'
import Loading from '../loading/loading.jsx'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


import './map.css'



const GoogleMap = memo((props) => {
    const [selectedStore, setSelectedStore] = useState({});
    const [showStoreCard, setShowStoreCard] = useState(false);
    const [alert, setAlert] = useState({ display: false, msg: "" })
    const [updateLoading, setUpdateLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const onMarkerClick = useCallback((i) => {
        setSelectedStore(props.stores[i])
        setShowStoreCard(true)
    }, [])





    const onStoreCardClose = () => {
        setShowStoreCard(false)
        setSelectedStore({});
        setAlert({ display: false, msg: "" })
        setUpdateLoading(false)
        setDeleteLoading(false)
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
        const newItem = { name: "", quantity: "", price: "" };
        setSelectedStore({ ...selectedStore, items: selectedStore.items.concat(newItem) })
    }

    const deleteItem = (i) => {
        setSelectedStore({ ...selectedStore, items: selectedStore.items.filter((item, index) => index !== i) })
    }


    const deleteStore = () => {
        setAlert({ display: false, msg: "" })
        setDeleteLoading(true)
        fetch('https://covid-19-shopping.herokuapp.com/deletestore', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedStore)
        })
            .then(response => response.json())
            .then(res => {
                if (Array.isArray(res)) {
                    props.handleStoreChange(res)
                    setDeleteLoading(false)
                    setShowStoreCard(false)
                } else {
                    console.log("Bad response from server")
                    setAlert({ display: true, msg: res })
                    setDeleteLoading(false)
                }
            })
            .catch(() => {
                setAlert({ display: true, msg: "could not get a response from the server" })
                setDeleteLoading(false)
            })
    }


    const isStoreValid = selectedStore.name && selectedStore.type && selectedStore.items.every(i => Object.values(i).every(v => v)) && selectedStore.items.length > 0;

    const onStoreEdit = () => {
        setAlert({ display: false, msg: "" })
        if (isStoreValid) {
            setUpdateLoading(true)
            fetch('https://covid-19-shopping.herokuapp.com/editstore', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedStore)
            }).then(response => response.json())
                .then(res => {
                    if (Array.isArray(res)) {
                        props.handleStoreChange(res)
                        setShowStoreCard(false)
                        setUpdateLoading(false)
                    } else {
                        setAlert({ display: true, msg: res })
                        setUpdateLoading(false)
                    }
                })
                .catch(() => {
                    setAlert({ display: true, msg: "could not get a response from the server" })
                    setUpdateLoading(false)
                })
        } else {
            setAlert({ display: true, msg: "Please fill all the empty inputs before updating" })
        }

    }



    const mapStyles = {
        width: '100vw',
        height: 'calc(100vh - 60px)',
    };


    return (
        <>
            <div className="map-out-div">
                <Map
                    className="map-wrapper"
                    google={props.google}
                    onClick={props.mapClick}
                    zoom={8}
                    minZoom={3}
                    style={mapStyles}
                    initialCenter={{ lat: 35.77451720813653, lng: 3.15603125 }}
                >
                    {JSON.stringify(props.currentStore) !== '{}' && <Marker position={props.currentStore.coords} />}

                    {props.stores.map((store, i) => {
                        return (
                            <Marker icon={{ url: marker, scaledSize: new props.google.maps.Size(34, 34) }} key={store.id} user={props.user} position={store.coords} onClick={() => onMarkerClick(i)} />
                        )
                    })}
                </Map>
            </div>

            {showStoreCard && <StoreCard updateLoading={updateLoading} deleteLoading={deleteLoading} alert={alert} deleteStore={deleteStore} onStoreEdit={onStoreEdit} deleteItem={deleteItem} addItem={addItem} handleItemChange={handleItemChange} handleChange={handleInputChange} onStoreCardClose={onStoreCardClose} store={selectedStore} user={props.user} />
            }
        </>
    );
})



export default GoogleApiWrapper({
    apiKey: 'AIzaSyDRvYpK6ySVnY1WbKQlrsmO1Oy6pEHq_co',
    LoadingContainer: (Loading)
})(GoogleMap);


