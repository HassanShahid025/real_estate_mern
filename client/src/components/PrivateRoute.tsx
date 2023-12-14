import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
    const {currentUser } = useSelector((store:RootState) => store.user)

  return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default PrivateRoute