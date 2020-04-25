import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import ProfileMenu from './profile/profile.jsx'
import './header.css'



const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'flex',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    form: {
        '& > *': {
            margin: theme.spacing(0, 2)
        },

    }

}));

const Header = (props) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null)

    const [open, setOpen] = React.useState(false);
    const [profilePic, setProfilePic] = React.useState(props.pic)
    const [password, setPassword] = React.useState({ currentPw: "", newPw: "", newPwConfirm: "" })
    const [saveLoading, setSaveLoading] = React.useState(false)
    const [updateLoading, setUpdateLoading] = React.useState(false)


    const [imgUrl, setImgUrl] = React.useState('')
    const [alert, setAlert] = React.useState({ display: false, msg: "", variant: "" })
    const isMenuOpen = Boolean(anchorEl);







    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        if (props.tipbox) {
            props.tipBoxClose()
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const saveDisabled = saveLoading || imgUrl === '' || updateLoading;
    const UpdateDisabled = saveLoading || updateLoading || password.currentPw === '' || password.newPw === '' || password.newPwConfirm === '' || password.newPw !== password.newPwConfirm;



    const handleDrawerOpen = () => {
        setOpen(true);
        handleMenuClose()
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setPassword({ currentPw: "", newPw: "", newPwConfirm: "" })
        setImgUrl('')
        setAlert({ display: false, msg: "", variant: "" })
    };


    const handleUrlChange = (e) => {
        setImgUrl(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value })
    }

    const onSignOut = () => {
        handleMenuClose()
        props.onSignOut();
    }

    const routeChange = (route) => {
        handleMenuClose()
        props.routeChange(route)
    }

    const handleUpdatePic = () => {
        setAlert({ display: false, msg: "", variant: "" })
        setSaveLoading(true)
        const { name, email, id, type, joined } = props.user
        const UpdatingUser = {
            name,
            email,
            id,
            type,
            joined,
            pic: imgUrl
        }
        fetch('https://covid-19-shopping.herokuapp.com/newpicture', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(UpdatingUser)
        })
            .then(res => res.json())
            .then(res => {
                if (res.id) {
                    setProfilePic(res.pic)
                    setAlert({ display: true, msg: "Your profile pic has been updated successfully!", variant: "success" })
                    setProfilePic(res.pic);
                    setSaveLoading(false);
                    setImgUrl('')
                    props.loadUser(res, 'update');
                    localStorage.setItem('user', JSON.stringify(res))
                } else {
                    setAlert({ display: true, msg: res, variant: "danger" })
                    setSaveLoading(false)
                }
            })
            .catch(err => {
                setAlert({ display: true, msg: "request failed!", variant: "danger" })
                setSaveLoading(false)
            })
    }


    const handleUpdatePassword = () => {
        setAlert({ display: false, msg: "", variant: "" })
        const info = {
            email: props.user.email,
            password: password.currentPw,
            newPassword: password.newPw
        }
        if (password.newPw === password.newPwConfirm) {
            setUpdateLoading(true)
            fetch('https://covid-19-shopping.herokuapp.com/newpassword', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(info)
            })
                .then(res => res.json())
                .then(res => {
                    if (res === 'success') {
                        setAlert({ display: true, msg: "Your account's password has been updated successfully!", variant: "success" })
                        setUpdateLoading(false)
                        setPassword({ currentPw: "", newPw: "", newPwConfirm: "" })
                    } else {
                        setAlert({ display: true, msg: res, variant: "danger" })
                        setUpdateLoading(false)
                        setPassword({ currentPw: "", newPw: "", newPwConfirm: "" })
                    }
                })
                .catch(() => {
                    setAlert({ display: true, msg: 'error, please try again later!', variant: "danger" })
                    setUpdateLoading(false)
                    setPassword({ currentPw: "", newPw: "", newPwConfirm: "" })
                })
        }
    }




    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        <> Quick covid-19 shopping </>
                    </Typography>
                    {props.signedIn && (

                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                onChange={(e) => props.handleSearch(e)}
                                placeholder="Search for items…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />

                        </div>

                    )}

                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>



                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="interaction-menu"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>

                        <ProfileMenu signedIn={props.signedIn} isMenuOpen={isMenuOpen} handleMenuClose={handleMenuClose} anchorEl={anchorEl} onProfileOpen={handleDrawerOpen} onSignOut={onSignOut} routeChange={routeChange} />

                    </div>

                </Toolbar>
            </AppBar>

            {props.signedIn && (
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <h5>Quick covid-19 shopping</h5>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <div className="profile-header">
                        <span>Your profile</span>
                    </div>
                    <Divider />
                    {alert.display && <div style={{ margin: 0, textAlign: 'center' }} className={`alert alert-${alert.variant}`} role="alert">{alert.msg}</div>}
                    <Divider />
                    <div className="profile-img-wrapper">
                        <div className="profile-img" style={{ backgroundImage: `url(${profilePic})` }}></div>
                        <div>
                            <span className="profile-name">{props.user.name}</span>
                        </div>
                        <div>
                            <span className="profile-email">{props.user.email}</span>
                        </div>
                    </div>
                    <Divider />
                    <div className="profile-header">
                        <span>Settings</span>
                    </div>
                    <Divider />
                    <div className="profile-padding">
                        <span>Update your profile picture</span>
                        <TextField value={imgUrl} onChange={handleUrlChange} style={{ width: '80%' }} label="Image link" variant="standard" />
                        <IconButton color="primary" disabled={saveDisabled} onClick={handleUpdatePic} aria-label="save">
                            {saveLoading && <CircularProgress style={{ color: "red" }} size={20} />}
                            {!saveLoading && <SaveIcon />}

                        </IconButton>
                    </div>
                    <Divider />
                    <div className="profile-padding">
                        <span>Update your password</span>
                        <form>
                            <TextField value={password.currentPw} type="password" name="currentPw" onChange={handlePasswordChange} style={{ width: '95%' }} label="Current password" variant="standard" />
                            <TextField value={password.newPw} type="password" name="newPw" onChange={handlePasswordChange} style={{ width: '95%' }} label="New password" variant="standard" />
                            <TextField value={password.newPwConfirm} type="password" name="newPwConfirm" onChange={handlePasswordChange} style={{ width: '95%' }} label="Confirm new password" variant="standard" />
                            <div className="pw-btn-wrapper">
                                <Button type="button" disabled={UpdateDisabled} onClick={handleUpdatePassword} className="password-submit" variant="contained" color="primary">
                                    {updateLoading && <CircularProgress size={20} />}
                                    {!updateLoading && "Update"}
                                </Button>
                            </div>
                        </form>

                    </div>

                    <Divider />

                </Drawer>

            )}

        </div>
    );
}

export default Header;