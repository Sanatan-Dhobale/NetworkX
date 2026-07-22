import React, { useEffect } from 'react';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from "@/config/redux/action/authAction"
import styles from "./index.module.css";
import { useRouter } from 'next/router';

function DiscoverPage() {

  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers())
    }
  }, [])

  return (
    <UserLayout>

      <DashboardLayout>

        <div>

          <div className={styles.discoverContainer}>

            <div className={styles.discoverHeader}>
              <h1>Discover Professionals</h1>
              <p>Connect with people from your network.</p>
            </div>
            <div className={styles.allUserProfile}>
              {
                authState.all_profile_fetched && authState.all_users.map((user) => {
                  return (
                    <div onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`)
                    }} key={user._id} className={styles.userCard}>
                      <img className={styles.userCard_image} src={user.userId.profilePicture} alt="" />
                      <div>
                        <h2>{user.userId.name}</h2>
                        <p>@{user.userId.username}</p>
                      </div>

                    </div>
                  )
                })
              }

            </div>
          </div>

        </div>

      </DashboardLayout>

    </UserLayout>
  )
}

export default DiscoverPage
