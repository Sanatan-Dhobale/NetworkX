import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getMyConnectionRequests, acceptConnection } from "@/config/redux/action/authAction";
import styles from "./index.module.css";
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

function MyConnectionsPage() {

    const dispatch = useDispatch();
    const router = useRouter();

    const authState = useSelector((state) => state.auth);

    const [isConnectionNull, setIsConnectionNull] = useState(true);


    useEffect(() => {
        dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }))
    }, []);


    useEffect(() => {
        if (authState.connectionRequest.length != 0) {
            console.log(authState.connectionRequest);

        }
    }, [authState.connectionRequest])

    return (
        <UserLayout>

            <DashboardLayout>

                <div style={{display:"flex", flexDirection:"column", gap:"1.2rem"}}>



                    {
                        authState.connectionRequest.length === 0 && <h2>No Connection Requests</h2>
                    }

                    {

                        authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection)=> connection.status_accepted === null ).map((user, index) => {
                            return (
                                <>
                                    <h3>My Connections</h3>
                                    <div onClick={() => {
                                        router.push(`/view_profile/${user.userId.username}`)
                                    }} className={styles.userCard} key={index}>
                                        <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"2em"}}>
                                            <div className={styles.profilePicture}>
                                                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                                            </div>

                                            <div className={styles.userInfo}>
                                                <h3>
                                                    {user.userId.name}
                                                </h3>
                                                <p>@{user.userId.username}</p>

                                            </div>
                                        </div>

                                        <button onClick={(e)=>{
                                            e.stopPropagation();
                                            dispatch(acceptConnection({
                                                connectionId: user._id,
                                                token: localStorage.getItem("token"),
                                                action: "accept"
                                            }))
                                        }} className={styles.connectedBtn}>Accept</button>

                                    </div>
                                </>
                            )
                        })
                    }

                    <h3>My Network</h3>

                    {

                        authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection)=> connection.status_accepted !== null ).map((user, index) => {
                            return (
                                <>
                                    <div onClick={() => {
                                        router.push(`/view_profile/${user.userId.username}`)
                                    }} className={styles.userCard} key={index}>
                                        <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"2em"}}>
                                            <div className={styles.profilePicture}>
                                                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                                            </div>

                                            <div className={styles.userInfo}>
                                                <h3>
                                                    {user.userId.name}
                                                </h3>
                                                <p>@{user.userId.username}</p>

                                            </div>
                                        </div>

                                    </div>
                                </>
                            )
                        })
                    }

                </div>

            </DashboardLayout>

        </UserLayout>
    )
}

export default MyConnectionsPage
