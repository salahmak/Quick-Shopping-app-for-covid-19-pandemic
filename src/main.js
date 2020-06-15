import React, { useState, useEffect } from 'react';
import Header from './components/Header/header.jsx';
import GoogleMap from './components/Map/map.jsx'
import AddBtn from './components/addbusiness/addbtn.jsx'
import AddForm from './components/addbusiness/addForm.jsx'
import Login from './components/login/login.jsx';
import Register from './components/register/register.jsx'
import AddMsg from './components/addmsg/addMsg.jsx'
import Loading from './components/loading/loading.jsx'


import { v1 as uuidv1 } from 'uuid';


import 'bootstrap/dist/css/bootstrap.min.css';





const Main = () => {
    const initialUser = {
        id: "",
        name: "",
        email: "",
        type: "",
        joined: "",
        pic: ""
    }

    const initialStore = {
        id: "",
        ownerId: "",
        name: "",
        type: "",
        coords: {},
        items: [{ name: "", quantity: "", price: "" }]
    }

    const [currentStore, setCurrentStore] = useState(initialStore)
    const [stores, setStores] = useState([])
    const [user, setUser] = useState(initialUser)

    const [filter, setFilter] = useState("")

    const [marking, setMarking] = useState(false)
    const [addForm, setAddForm] = useState(false)
    const [signedIn, setSignedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [addMsg, setAddMsg] = useState(false)
    const [tipBox, setTipBox] = useState(false)
    const [route, setRoute] = useState("login")

    useEffect(() => {
        setLoading(true)
        let storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
            fetch(`https://covid-19-shopping.herokuapp.com/user/${storedUser.id}`)
                .then(response => response.json())
                .then(user => {
                    localStorage.setItem('user', JSON.stringify(user))
                    fetch('https://covid-19-shopping.herokuapp.com/getstores')
                        .then(response => response.json())
                        .then(stores => {
                            setUser(user);
                            setStores(stores)
                            setLoading(false)
                            setSignedIn(false)
                            setRoute('home')
                        })
                })
                .catch(err => {
                    localStorage.removeItem('user')
                    setLoading(false)
                    setRoute('login')
                })
        } else {
            setLoading(false)
            setRoute('register')
        }
    }, [])



    const onAddBusiness = () => {
        if (!addForm) {
            setMarking(true)
            setAddMsg(true)
            setTipBox(false)
        }
    }

    const mapClick = (x, y, lat, lng, event) => {
        if (marking) {
            let currentMarker = { lat: lat.latLng.lat().toString(), lng: lat.latLng.lng().toString() }
            setCurrentStore({ ...currentMarker, coords: currentMarker, id: uuidv1(), ownerId: user.id })
            setAddForm(true)
            setMarking(false)
            setAddMsg(false)
        }
    }


    const onCancel = () => {
        setAddForm(false)
        setCurrentStore(initialStore)
    }


    const handleInputChange = (e) => {
        setCurrentStore({ ...currentStore, [e.target.name]: e.target.value })
    }



    const routeChange = (route) => {
        if (route === 'home') {
            setRoute(route)
            setSignedIn(true)
        } else {
            setRoute(route)
            setSignedIn(false)
        }
    }




    //start here 

    const handleAddStore = (store) => {
        const cloneStores = [...stores]
        const newStores = [...cloneStores, store]
        setStores(newStores)
        setAddForm(false)
        setCurrentStore(initialStore)
    }

    const handleItemChange = (prop, event, index) => {
        const old = currentStore.items[index];
        const updated = { ...old, [prop]: event.target.value }
        const clone = [...currentStore.items]
        clone[index] = updated;
        setCurrentStore({ ...currentStore, items: clone })
    }

    const addItem = () => {
        const newItem = { name: "", quantity: "", price: "" };
        setCurrentStore({ ...currentStore, items: currentStore.items.concat(newItem) })
    }
    const deleteItem = (i, e) => {
        setCurrentStore({ ...currentStore, items: currentStore.items.filter((item, index) => index !== i) })
    }

    //register and login

    const loadUser = (user, type) => {
        if (type === "auth") {
            setUser(user)
            fetch('https://covid-19-shopping.herokuapp.com/getstores')
                .then(response => response.json())
                .then(stores => {
                    setStores(stores)
                    setTipBox(true)
                })
        } else {
            setUser(user)
        }

    }

    const onSignOut = () => {
        setFilter("")
        setSignedIn(false)
        setRoute('login')
        setUser(initialUser)
        localStorage.removeItem('user')
    }


    //store edit



    const handleStoreChange = (stores) => {
        setStores(stores)
    }




    //search

    const handleSearch = (e) => {
        setFilter(e.target.value)
    }

    //tipbox

    const tipBoxClose = () => {
        setTipBox(false)
    }


    let filteredStores = stores.filter(({ items }) => items.find(item => item.name.toLowerCase().includes(filter.toLowerCase())));

    if (route === 'login') {
        return (
            <>
                {loading && <Loading />}
                {!loading && <div className="gradient-bg"></div>}
                <Header user={user} routeChange={routeChange} signedIn={signedIn} />
                <Login loadUser={loadUser} routeChange={routeChange} />
            </>
        )
    } else if (route === 'register') {
        return (
            <>
                {loading && <Loading />}
                {!loading && <div className="gradient-bg"></div>}
                <Header user={user} routeChange={routeChange} signedIn={signedIn} />
                <Register loadUser={loadUser} routeChange={routeChange} />
            </>
        )
    } else {
        return (
            <>
                {loading && <Loading />}

                <Header tipbox={tipBox} tipBoxClose={tipBoxClose} loadUser={loadUser} handleSearch={handleSearch} onSignOut={onSignOut} user={user} pic={user.pic} routeChange={routeChange} signedIn={signedIn} />

                {addMsg && <AddMsg />}

                <GoogleMap handleStoreChange={handleStoreChange} user={user} currentStore={currentStore} stores={filteredStores} mapClick={mapClick} marking={marking} />



                {user.type === 'business' && <AddBtn open={tipBox} onClick={onAddBusiness} />}

                {
                    addForm && <AddForm handleAddStore={handleAddStore} handleInputChange={handleInputChange} store={currentStore} handleItemChange={handleItemChange} addItem={addItem} deleteItem={deleteItem} onCancel={onCancel} lat={currentStore.coords.lat} lng={currentStore.coords.lng} />
                }
            </>
        )
    }
}


export default Main;
