import axios from "axios";

// export const BASE_URL = "https://networkx-vbr3.onrender.com/"

export const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export const clientServer = axios.create({
    baseURL: NEXT_PUBLIC_BASE_URL,
});

