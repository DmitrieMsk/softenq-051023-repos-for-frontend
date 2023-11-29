import * as Cookie from "../includes/cookie.js"
import { verifyUser } from "../includes/verifyUser.js";
import { NavLink, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react"
import PageNotFound from '../includes/pageNotFound.jsx'
import * as UserPageIncludes from "./userPageIncludes.jsx"
import './userProfile.css'
function MyProfile(props){
    const [id, setId] = useState([])
    let token = Cookie.getCookie("token")  
    const getId = async () => {
        let _id =  await verifyUser(token)
        setId(_id)
    }
    console.log(id)
    const [user, setUser] = useState([])
    const [statusCode, setStatusCode] = useState([])
    const [isAuthorized, setAuthorized] = useState([])
    const [photos, setPhotos] = useState([])

    const googleLink = "https://drive.google.com/u/0/uc?id=";
    const urlRight = "&export=download"
    const params = useParams();
    // const link = async () => fetch(`/api/user/${user.id}/avatar`)
    const link = googleLink + user.profilePicture + urlRight
    let userPage = 
    <div className="head"> 
        <div>
        { isAuthorized !== -1  && UserPageIncludes.renderLogout()}
        { isAuthorized == -1 && UserPageIncludes.renderLogin()}
        </div>
        <p className="title">Вы зашли на свою страницу, ваши данные:</p>
        <div >
            {user.profilePicture !== undefined && UserPageIncludes.renderAvatar(link)}
        </div>
        <p className = "infoAboutUser">id: {user.id}</p>
        <p className = "infoAboutUser">username: {user.username}</p>
        <p className = "infoAboutUser">email: {user.email}</p>
        <div>
            
            {isAuthorized == true && UserPageIncludes.renderAvatarForm(user)}
        </div>
        <div>
            {isAuthorized == true && UserPageIncludes.renderRegularForm(user)}
        </div>
        <div>
            {photos.length != 0 && UserPageIncludes.renderGallery(photos)}
        </div>
    </div>
    let pageNotFound = <PageNotFound></PageNotFound>
    const getUserData = async () => {
        let _id =  await verifyUser(token)
        console.log("fdfd_"+ id)
        if(_id == -1) {
            window.location.assign("/signin");
        }
        let response =  await fetch("/api/user/" + _id)
        .then((response) => {
            setStatusCode(response.status)
            if (response.status == 200) {
            }
            return  response.json();
        })
        .then(async(data) => {
            let rs = await verifyUser(token)
            console.log(data.id == rs)
            console.log(rs)
            let photoLinks = await fetch("/api/user/" + rs + "/photos")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                return data;
            })
            console.log(photoLinks)
            setPhotos(photoLinks)
            setUser(data)
            if (rs == -1) {
                setAuthorized(-1)
            } else if (rs != data.id) {
                setAuthorized(false)
            } else {
                setAuthorized(true)
            }
        });
        
    }
    useEffect(() => {
        getUserData()
    }, [])
        return ((statusCode == 200)? userPage : pageNotFound)
    
  }

export default MyProfile