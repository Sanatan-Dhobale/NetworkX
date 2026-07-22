import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css"
import { clientServer } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router';

function ProfilePage() {

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.posts)
    const dispatch = useDispatch();
    const router = useRouter();


    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        dispatch(getAllPosts())
    }, []);

    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(null);

    const [inputData, setInputData] = useState({ company: "", position: "", years: "" });
    const [educationData, setEducationData] = useState({ school: "", degree: "", fieldOfStudy: "" });

    const handleWorkInputChange = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value })
    }

    const handleEducationChange = (e) => {
        const { name, value } = e.target;
        setEducationData({ ...educationData, [name]: value });
    }

    useEffect(() => {

        if (authState.user != undefined) {
            setUserProfile(authState.user)

            console.log(authState);


            let post = postReducer.posts.filter((post) => {
                return post.userId.username === authState.user?.userId?.username
            })



            setUserPosts(post)


        }

    }, [authState.user, postReducer.posts]);


    const updateProfilePicture = async (file) => {
        const formData = new FormData();

        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/upload_profile_picture", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        dispatch(getAboutUser({ token: localStorage.getItem("token") }));

    }


    const updateProfileData = async () => {
        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name,
        })

        const response = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education
        });

        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }



    return (
        <UserLayout>

            <DashboardLayout>
                {authState.user && userProfile.userId &&
                    <div className={styles.container}>

                        <div className={styles.coverSection}>
                            <div className={styles.coverBanner}></div>

                            <div className={styles.avatarWrapper}>
                                <img
                                    className={styles.profileImage}
                                    src={userProfile.userId.profilePicture}
                                    alt=""
                                />

                                <div className={styles.editOverlay}>
                                    <label htmlFor="profilePictureUpload">Edit</label>
                                    <input onChange={(e) => {
                                        updateProfilePicture(e.target.files[0])
                                    }} type="file" id='profilePictureUpload' hidden />
                                </div>
                            </div>

                            {userProfile != authState.user &&
                                <div className={styles.headerActions}>
                                    <div className={styles.connectionButton} onClick={() => {
                                        updateProfileData();
                                    }}>
                                        Update Profile
                                    </div>
                                </div>
                            }
                        </div>

                        <div className={styles.profileMeta}>
                            <div className={styles.nameRow}>
                                <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) => {
                                    setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                                }} />
                                <p className={styles.username}>@{userProfile.userId.username}</p>
                            </div>

                            <textarea
                                className={styles.bioInput}
                                onChange={(e) => {
                                    setUserProfile({ ...userProfile, bio: e.target.value })
                                }}
                                rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                                name=""
                                id=""
                            >{userProfile.bio}</textarea>

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
                                        <button className={styles.addWorkButton} onClick={() => {
                                            setIsModalOpen("work");
                                        }}>+ Update Work</button>
                                    </div>

                                    <div className={styles.workHistoryContainer}>
                                        {
                                            userProfile.pastWork.map((work, index) => {
                                                return (
                                                    <div key={index} className={styles.workHistorycard}>
                                                        <p> {work.company} - {work.position} </p>
                                                        <p> Experience - {work.years} Years</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </section>

                                <section className={styles.sectionCard}>
                                    <div className={styles.sectionHeader}>
                                        <h4>Education History</h4>
                                        <button className={styles.addWorkButton} onClick={() => {
                                            setIsModalOpen("education");
                                        }}>+ Update Education</button>
                                    </div>

                                    <div className={styles.workHistoryContainer}>
                                        {
                                            userProfile.education.map((education, index) => {
                                                return (
                                                    <div key={index} className={styles.workHistorycard}>
                                                        <p> {education.school} - {education.degree} </p>
                                                        <p> Field of Study - {education.fieldOfStudy}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </section>

                            </div>


                        </div>

                    </div>
                }

                {
                    isModalOpen === "work" &&
                    <div onClick={() => {
                        setIsModalOpen(false);
                    }} className={styles.modalOverlay}>
                        <div onClick={(e) => {
                            e.stopPropagation();
                        }} className={styles.modalCard}>
                            <h3 className={styles.modalTitle}>Add Work Experience</h3>

                            <div className={styles.modalForm}>
                                <input name='company' onChange={(e) =>
                                    handleWorkInputChange(e)
                                } className={styles.inputField} type="text" placeholder='Enter Company' />
                                <input name='position' onChange={(e) =>
                                    handleWorkInputChange(e)
                                } className={styles.inputField} type="text" placeholder='Enter Position' />
                                <input name='years' onChange={(e) =>
                                    handleWorkInputChange(e)
                                } className={styles.inputField} type="number" placeholder='Year of Experience' />
                                <button onClick={() => {
                                    setUserProfile({ ...userProfile, pastWork: [...userProfile.pastWork, inputData] });
                                    setIsModalOpen(false);
                                }} className={styles.addWorkBtn}>Add Work</button>
                            </div>
                        </div>
                    </div>
                }

                {
                    isModalOpen === "education" &&
                    <div onClick={() => {
                        setIsModalOpen(null);
                    }} className={styles.modalOverlay}>
                        <div onClick={(e) => {
                            e.stopPropagation();
                        }} className={styles.modalCard}>
                            <h3 className={styles.modalTitle}>Add Education</h3>

                            <div className={styles.modalForm}>
                                <input name='school' onChange={(e) =>
                                    handleEducationChange(e)
                                } className={styles.inputField} type="text" placeholder='Enter School' />
                                <input name='degree' onChange={(e) =>
                                    handleEducationChange(e)
                                } className={styles.inputField} type="text" placeholder='Enter Degree' />
                                <input name='fieldOfStudy' onChange={(e) =>
                                    handleEducationChange(e)
                                } className={styles.inputField} type="text" placeholder='Field of Study' />
                                <button onClick={() => {
                                    setUserProfile({ ...userProfile, education: [...userProfile.education, educationData] });
                                    setIsModalOpen(null);
                                }} className={styles.addWorkBtn}>Add Education</button>
                            </div>
                        </div>
                    </div>
                }

                

            </DashboardLayout>

        </UserLayout>
    )
}

export default ProfilePage

