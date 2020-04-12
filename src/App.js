import React, { Component } from 'react';
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

const initialState = {
  marking: false,
  addForm: false,
  markers: [],
  currentMarker: {},
  formStage: "basic",
  signedIn: false,
  route: 'register',
  loading: false,
  buttonLoading: false,
  addMsg: false,


  //current Store
  currentStore: {
    id: "",
    ownerId: "",
    name: "",
    type: "",
    coords: {},
    items: []
  },


  //all stores
  stores: [],

  //user

  user: {
    id: "",
    name: "",
    email: ""
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState
  }




  componentDidMount() {
    this.setState({ loading: true })
    let storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) {
      fetch(`https://covid-19-shopping.herokuapp.com/user/${storedUser.id}`)
        .then(response => response.json())
        .then(user => {
          localStorage.setItem('user', JSON.stringify(user))
          fetch('https://covid-19-shopping.herokuapp.com/getstores')
            .then(response => response.json())
            .then(stores => {
              //this.setState({ stores })
              this.setState({ user, stores, loading: false, signedIn: true, route: 'home' })
            })

        })
        .catch(err => {
          localStorage.removeItem('user')
          this.setState({ loading: false, user: initialState.user, route: 'login' })
        })
    } else {
      this.setState({ loading: false, user: initialState.user, route: 'login' })
    }
  }


  /* if (this.state.route === 'home') {
    fetch('https://covid-19-shopping.herokuapp.com/getstores')
      .then(response => response.json())
      .then(stores => {
        this.setState({ stores })
      })
  } */


  onAddBusiness = () => {
    if (!this.state.addForm) {
      this.setState({ marking: true, addMsg: true })
    }

  }


  mapClick = (x, y, lat, lng, event) => {
    console.log(lat.latLng.toString());

    if (this.state.marking) {
      let markers = [...this.state.markers]

      let currentMarker = { lat: lat.latLng.lat().toString(), lng: lat.latLng.lng().toString() }
      this.setState(Object.assign(this.state.currentStore, { coords: currentMarker, id: uuidv1(), ownerId: this.state.user.id }))

      this.setState({ markers, currentMarker, addForm: true, marking: false, addMsg: false })
    }
  }


  onCancel = () => {
    this.setState({ addForm: false, currentMarker: {}, formStage: "basic" })
    this.setState({
      currentStore: {
        id: "",
        ownerId: this.state.user.id,
        name: "",
        type: "",
        coords: {},
        items: []
      }
    })
  }


  handleNameChange = (e) => {
    this.setState(Object.assign(this.state.currentStore, { name: e.target.value }))
  }

  handleTypeChange = (e) => {
    this.setState(Object.assign(this.state.currentStore, { type: e.target.value }))
  }







  routeChange = (route) => {
    if (route === 'home') {
      this.setState({ route, signedIn: true })
    } else {
      this.setState({ route, signedIn: false })
    }

  }


  handleFormClick = (stage) => {
    if (stage !== 'finish') {
      this.setState({ formStage: stage })
    }
    else {

      const newStore = this.state.currentStore;
      const cloneStores = [...this.state.stores];


      this.setState({ buttonLoading: true })
      fetch('https://covid-19-shopping.herokuapp.com/newstore', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore)
      })
        .then(response => {
          if (response.ok) {
            console.log('store added');
            return response.json();
          }
        })
        .then(store => {
          this.setState({ buttonLoading: false })
          const newStores = [...cloneStores, store]
          this.setState({ stores: newStores, addForm: false, formStage: "basic", currentStore: { name: "", type: "", coords: {}, items: [] } })
        })
    }
  }


  handleItemChange = (prop, event, index) => {
    const old = this.state.currentStore.items[index];
    const updated = { ...old, [prop]: event.target.value }
    const clone = [...this.state.currentStore.items];
    clone[index] = updated;
    this.setState(Object.assign(this.state.currentStore, { items: clone }))
  }

  addItem = () => {
    const newItem = { name: "", quantity: "", unit: "" };
    this.setState(Object.assign(this.state.currentStore, { items: this.state.currentStore.items.concat(newItem) }))
  }
  deleteItem = (i, e) => {
    this.setState(Object.assign(this.state.currentStore, { items: this.state.currentStore.items.filter((item, index) => index !== i) }));
  }


  //register and login

  loadUser = (user) => {
    this.setState({ user })
    fetch('https://covid-19-shopping.herokuapp.com/getstores')
      .then(response => response.json())
      .then(stores => {
        this.setState({ stores })
      })
  }





  //store edit

  onStoreEdit = (store) => {
    this.setState({ buttonLoading: true })
    fetch('https://covid-19-shopping.herokuapp.com/editstore', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(store)
    }).then(response => {
      if (response.ok) {
        return response.json()
      }
    }).then(stores => {
      this.setState({ stores })
      this.setState({ buttonLoading: false })
    })
  }

  onStoreDelete = (stores) => {
    this.setState({ stores })
  }

  setBtnLoading = (bool) => {
    this.setState({ buttonLoading: bool })
  }


  onSignOut = () => {
    this.setState({ signedIn: false, route: "login", user: { name: "", email: "", id: "" } })
    localStorage.removeItem('user')
  }



  render() {

    if (this.state.route === 'login') {
      return (
        <>
          {this.state.loading && <Loading />}
          <Header routeChange={this.routeChange} signedIn={this.state.signedIn} />
          <Login loadUser={this.loadUser} routeChange={this.routeChange} />
        </>
      )
    } else if (this.state.route === 'register') {
      return (
        <>
          {this.state.loading && <Loading />}
          <Header routeChange={this.routeChange} signedIn={this.state.signedIn} />
          <Register loadUser={this.loadUser} routeChange={this.routeChange} />
        </>
      )
    } else {
      return (
        <>
          {this.state.loading && <Loading />}
          <Header onSignOut={this.onSignOut} username={this.state.user.name} routeChange={this.routeChange} signedIn={this.state.signedIn} />
          {this.state.addMsg && <AddMsg />}
          <GoogleMap setBtnLoading={this.setBtnLoading} deleteStore={this.onStoreDelete} btnLoading={this.state.buttonLoading} onStoreEdit={this.onStoreEdit} user={this.state.user} currentMarker={this.state.currentStore.coords} stores={this.state.stores} mapClick={this.mapClick} marking={this.state.marking} />
          <AddBtn onClick={this.onAddBusiness} />
          {
            this.state.addForm
              ? <AddForm btnLoading={this.state.buttonLoading} handleTypeChange={this.handleTypeChange} handleNameChange={this.handleNameChange} store={this.state.currentStore} handleItemChange={this.handleItemChange} addItem={this.addItem} deleteItem={this.deleteItem} formStage={this.state.formStage} handleFormClick={this.handleFormClick} onCancel={this.onCancel} lat={this.state.currentStore.coords.lat} lng={this.state.currentStore.coords.lng} />

              : <></>
          }

        </>
      )
    }


  }
}

export default App;




