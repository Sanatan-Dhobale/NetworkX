import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from "@/config/redux/reducer/authReducer"

function NavbarComponent() {

    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>

                <h1
                    className={styles.logo}
                    onClick={() => router.push("/")}
                >
                    NetworkX
                </h1>

                <div className={styles.navBarOptionContainer}>

                    {authState.profileFetched && <div>
                        <div className={styles.navLinks}>
                            <p
                                className={styles.navItem}
                                onClick={() => router.push("/profile")}
                            >
                                Profile
                            </p>

                            <p onClick={() => {
                                localStorage.removeItem("token");
                                router.push("/login")
                                dispatch(reset())
                            }} className={`${styles.navItem} ${styles.logout}`}>Logout</p>
                        </div>
                    </div>}

                    {!authState.profileFetched && <div onClick={() => {
                        router.push("/login")
                    }} className={styles.buttonJoin}>
                        <p>Be a part</p>
                    </div>}



                </div>

            </nav>
        </div>
    )
}

export default NavbarComponent
