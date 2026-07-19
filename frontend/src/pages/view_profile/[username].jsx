

import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { sentConnectionRequest, getConnectionRequest } from "@/config/redux/action/authAction";
import { incrementPostLike } from '@/config/redux/action/postAction';




function ViewProfilePage({ userProfile }) {

  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

  const searchParamers = useSearchParams();

  const getUserPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
  }

  useEffect(() => {

    let post = postState.posts.filter((post) => {

      return post.userId.username === router.query.username

    })

    setUserPosts(post)

  }, [postState.posts]);


  useEffect(() => {

    if (authState.connections.some(user => user.connectionId._id === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true);
      if (authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true) {
        setIsConnectionNull(false)
      }
    }

    if (authState.connectionRequest.some(user => user.connectionId === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true)
      if (authState.connectionRequest.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true) {
        setIsConnectionNull(false)
      }
    }

  }, [authState.connections, authState.connectionRequest])


  useEffect(() => {

    getUserPost();

  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>

          <div className={styles.coverSection}>
            <div className={styles.coverBanner}></div>

            <div className={styles.avatarWrapper}>
              <img
                className={styles.profileImage}
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
            </div>

            <div className={styles.headerActions}>
              {isCurrentUserInConnection ?
                <button className={styles.connectedBtn}>{isConnectionNull ? "Pending" : "Connected"}</button>
                :
                <button className={styles.connectBtn} onClick={() => {
                  dispatch(sentConnectionRequest({ token: localStorage.getItem("token"), user_id: userProfile.userId._id }))
                }}>Connect</button>
              }

              <div className={styles.resumeIconWrapper}>
                <svg onClick={async () => {
                  const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                  window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                }} className={styles.resumeIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.profileMeta}>
            <div className={styles.nameRow}>
              <h2 className={styles.nameHeading}>{userProfile.userId.name}</h2>
              <p className={styles.username}>@{userProfile.userId.username}</p>
            </div>

            <p className={styles.bioText}>
              {userProfile.bio}
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <strong>{userPosts.length}</strong>
                <span>Posts</span>
              </div>
              <div className={styles.statItem}>
                <strong>{userProfile.pastWork.length}</strong>
                <span>Work</span>
              </div>
              <div className={styles.statItem}>
                <strong>{userProfile.education.length}</strong>
                <span>Education</span>
              </div>
            </div>
          </div>

          <div className={styles.contentGrid}>

            <div className={styles.mainColumn}>
              <section className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h4>Work History</h4>
                </div>

                <div className={styles.workHistoryContainer}>
                  {
                    userProfile.pastWork.map((work, index) => {
                      return (
                        <div key={index} className={styles.workHistorycard}>
                          <p> {work.company} - {work.position} </p>
                          <p> {work.years} </p>
                        </div>
                      )
                    })
                  }
                </div>
              </section>
            </div>

            <div className={styles.mainColumn}>
              <section className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h4>Education</h4>
                </div>

                <div className={styles.workHistoryContainer}>
                  {
                    userProfile.education.map((edu, index) => {
                      return (
                        <div key={index} className={styles.workHistorycard}>
                          <p> {edu.school} - {edu.degree} </p>
                          <p> {edu.fieldOfStudy} </p>
                        </div>
                      )
                    })
                  }
                </div>
              </section>
            </div>

          </div>

          <section className={styles.postsSection}>

            <div className={styles.postsHeader}>
              <h3>Posts</h3>
              <span>{userPosts.length} Posts</span>
            </div>

            <div className={styles.postsContainer}>

              {
                userPosts.length === 0 ?

                  <div className={styles.emptyPosts}>
                    <h3>No Posts Yet</h3>
                    <p>This user hasn't shared any posts.</p>
                  </div>

                  :

                  userPosts.map((post) => (

                    <div key={post._id} className={styles.postCard}>

                      <div className={styles.postHeader}>

                        <div className={styles.postUser}>

                          <img
                            className={styles.postAvatar}
                            src={`${BASE_URL}/${post.userId.profilePicture}`}
                            alt=""
                          />

                          <div>

                            <h4>{post.userId.name}</h4>

                            <p>@{post.userId.username}</p>

                          </div>

                        </div>

                      </div>


                      {
                        post.body &&
                        <p className={styles.postCaption}>
                          {post.body}
                        </p>
                      }


                      {
                        post.media &&
                        <img
                          className={styles.postImage}
                          src={`${BASE_URL}/${post.media}`}
                          alt=""
                        />
                      }


                      <div className={styles.postActions}>

                        <div onClick={async () => {
                            await dispatch(incrementPostLike({ post_id: post._id }))
                            dispatch(getAllPosts())

                          }} className={styles.actionButton}>

                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                          </svg>

                          <span>{post.likes}</span>

                        </div>


                        <div className={styles.actionButton}>

                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                          </svg>

                        </div>


                        <div className={styles.actionButton}>

                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                          </svg>

                          <span>Share</span>

                        </div>

                      </div>

                    </div>

                  ))

              }

            </div>

          </section>

        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context) {

  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: {
      username: context.query.username
    }
  })

  const response = await request.data;
  console.log(response);


  return {
    props: {
      userProfile: request.data.profile
    }
  }

}

export default ViewProfilePage

