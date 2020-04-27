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





class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marking: false,
      addForm: false,
      formStage: "basic",
      signedIn: false,
      route: 'register',
      loading: false,
      addMsg: false,
      tipBox: false,


      //current Store
      currentStore: {
        id: "",
        ownerId: "",
        name: "",
        type: "",
        coords: {},
        items: [{ name: "", quantity: "", price: "" }]
      },


      //all stores
      stores: [],

      //user

      user: {
        id: "",
        name: "",
        email: "",
        type: "",
        joined: "",
        pic: ""
      },

      //filter

      filter: ""
    }
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
              this.setState({ user, stores, loading: false, signedIn: true, route: 'home' })
            })
        })
        .catch(err => {
          localStorage.removeItem('user')
          this.setState({ loading: false, user: { id: "", name: "", email: "", type: "", joined: "", pic: "" }, route: 'login' })
        })
    } else {
      this.setState({ loading: false, user: { id: "", name: "", email: "", type: "", joined: "", pic: "" }, route: 'register' })
    }
  }


  onAddBusiness = () => {
    if (!this.state.addForm) {
      this.setState({ marking: true, addMsg: true, tipBox: false })
    }
  }

  mapClick = (x, y, lat, lng, event) => {
    console.log(lat.latLng.toString());
    if (this.state.marking) {
      let currentMarker = { lat: lat.latLng.lat().toString(), lng: lat.latLng.lng().toString() }
      this.setState(Object.assign(this.state.currentStore, { coords: currentMarker, id: uuidv1(), ownerId: this.state.user.id }))
      this.setState({ addForm: true, marking: false, addMsg: false })
    }
  }


  onCancel = () => {
    this.setState({
      addForm: false, formStage: "basic", currentStore: {
        id: "",
        ownerId: "",
        name: "",
        type: "",
        coords: {},
        items: [{ name: "", quantity: "", price: "" }]
      }
    })
  }


  handleInputChange = (e) => {
    this.setState(Object.assign(this.state.currentStore, { [e.target.name]: e.target.value }))
  }



  routeChange = (route) => {
    if (route === 'home') {
      this.setState({ route, signedIn: true })
    } else {
      this.setState({ route, signedIn: false })
    }
  }




  //start here 

  handleAddStore = (store) => {
    const cloneStores = [...this.state.stores]
    const newStores = [...cloneStores, store]
    this.setState({ stores: newStores, addForm: false, formStage: "basic", currentStore: { name: "", type: "", coords: {}, items: [{ name: "", quantity: "", price: "" }] } })
  }

  handleItemChange = (prop, event, index) => {
    const old = this.state.currentStore.items[index];
    const updated = { ...old, [prop]: event.target.value }
    const clone = [...this.state.currentStore.items];
    clone[index] = updated;
    this.setState(Object.assign(this.state.currentStore, { items: clone }))
  }

  addItem = () => {
    const newItem = { name: "", quantity: "", price: "" };
    this.setState(Object.assign(this.state.currentStore, { items: this.state.currentStore.items.concat(newItem) }))
  }
  deleteItem = (i, e) => {
    this.setState(Object.assign(this.state.currentStore, { items: this.state.currentStore.items.filter((item, index) => index !== i) }));
  }

  //register and login

  loadUser = (user, type) => {
    if (type === "auth") {
      this.setState({ user })
      fetch('https://covid-19-shopping.herokuapp.com/getstores')
        .then(response => response.json())
        .then(stores => {
          this.setState({ stores, tipBox: true })
        })
    } else {
      this.setState({ user })
    }

  }

  onSignOut = () => {
    this.setState({ filter: "", signedIn: false, route: "login", user: { name: "", email: "", id: "" } })
    localStorage.removeItem('user')
  }


  //store edit

  onStoreEdit = (store) => {
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
    })
  }

  handleStoreChange = (stores) => {
    this.setState({ stores })
  }




  //search

  handleSearch = (e) => {
    this.setState({ filter: e.target.value })
  }

  //tipbox

  tipBoxClose = () => {
    this.setState({ tipBox: false })
  }

  render() {
    let filteredStores = this.state.stores.filter(({ items }) => items.find(item => item.name.toLowerCase().includes(this.state.filter.toLowerCase())));

    if (this.state.route === 'login') {
      return (
        <>
          {this.state.loading && <Loading />}
          {!this.state.loading && <div className="gradient-bg"></div>}
          <Header routeChange={this.routeChange} signedIn={this.state.signedIn} />
          <Login loadUser={this.loadUser} routeChange={this.routeChange} />
        </>
      )
    } else if (this.state.route === 'register') {
      return (
        <>
          {this.state.loading && <Loading />}
          {!this.state.loading && <div className="gradient-bg"></div>}
          <Header routeChange={this.routeChange} signedIn={this.state.signedIn} />
          <Register loadUser={this.loadUser} routeChange={this.routeChange} />
        </>
      )
    } else {
      return (
        <>
          {this.state.loading && <Loading />}

          <Header tipbox={this.state.tipBox} tipBoxClose={this.tipBoxClose} loadUser={this.loadUser} handleSearch={this.handleSearch} onSignOut={this.onSignOut} user={this.state.user} pic={this.state.user.pic} routeChange={this.routeChange} signedIn={this.state.signedIn} />

          {this.state.addMsg && <AddMsg />}

          <GoogleMap handleStoreChange={this.handleStoreChange} user={this.state.user} currentStore={this.state.currentStore} stores={filteredStores} mapClick={this.mapClick} marking={this.state.marking} />



          {this.state.user.type === 'business' && <AddBtn open={this.state.tipBox} onClick={this.onAddBusiness} />}

          {
            this.state.addForm && <AddForm handleAddStore={this.handleAddStore} handleInputChange={this.handleInputChange} store={this.state.currentStore} handleItemChange={this.handleItemChange} addItem={this.addItem} deleteItem={this.deleteItem} handleFormClick={this.handleFormClick} onCancel={this.onCancel} lat={this.state.currentStore.coords.lat} lng={this.state.currentStore.coords.lng} />
          }
        </>
      )
    }
  }
}

export default App;
