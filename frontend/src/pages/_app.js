import "@/styles/globals.css";
import { store } from "@/config/redux/store.js";
import { Provider } from "react-redux";
import "@/styles/variables.css"

export default function App({ Component, pageProps }) {
  return <>
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  </>

}
