import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {

  const router = useRouter();

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>

            <h1>Connect with professionals without exaggeration.</h1>

            <p>Build meaningful connections, showcase your work, and grow your professional network with authenticity.</p>

            <div onClick={() => {
              router.push("/login");
            }} className={styles.buttonJoin}>
              <button>Join Now</button>
            </div>

          </div>

          <div className={styles.mainContainer_right}>

            <img src="images/image.jpg" alt="" />

          </div>
        </div>
      </div>
    </UserLayout>
  );
}
