import React, { useEffect, useState } from 'react';
import {Box, TextField} from "@mui/material";
import axios from 'axios';

const Payment = () => {
    const [user_id,setUser_id] = useState("")
    const [order_id, setOrder_id] = useState("")
    const [jumlah,setJumlah] =useState("")

    const [token,setToken] = useState("")

    const process = async () =>{
        const data = {
            user_id: user_id,
            order_id: order_id,
            jumlah: jumlah
        }
        const config = {
            headers: {
                "Content-Type":"application/json"
            }
        }
        const response = await axios.post("http://localhost:3000/api/payment/process-transaction",data,config);

        setToken(response.data.token);
    };

    useEffect(()=>{
        if(token){
            window.snap.pay(token,{
                onSuccess:(result) =>{
                    localStorage.setItem("Pembayaran",JSON.stringify(result))
                    setToken("");
                },
                onPending:(result) =>{
                    localStorage.setItem("Pembayaran",JSON.stringify(result))
                    setToken("");
                },
                onError: (error) =>{
                    console.log(error)
                    setToken("");
                },
                onClose: () =>{
                    console.log("Anda belum menyelesaikan pembayaran")
                    setToken("");
                }
            })
            setUser_id("")
            setOrder_id("")
            setJumlah("")
        }
    },[token]);

    useEffect(()=>{
        const midtrans_Url = "https://app.sandbox.midtrans.com/snap/snap.js";

        let scriptTag = document.createElement("script")
        scriptTag.src = midtrans_Url

        const midtransClientKey = "SB-Mid-client-8fEeQxWzAXIykRuE";
        scriptTag.setAttribute("data-client-key",midtransClientKey)

        document.body.appendChild(scriptTag)

        return () =>{
            document.body.removeChild(scriptTag)
        }
    },[])


    return (
        <><h1 className="text-5xl  bg-purple-700 hover:bg-purple-400  text-white font-bold px-8">Form Donasi</h1>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '50vw', p: 4 }}>
            <TextField type='number' label="User ID" value={user_id} onChange={(e) => setUser_id(parseInt(e.target.value))} sx={{ mb: 2 }} />

            <TextField type='number' label="Order ID" value={order_id} onChange={(e) => setOrder_id(parseInt(e.target.value))} sx={{ mb: 2 }} />

            <TextField type='number' label="Jumlah" value={jumlah} onChange={(e) => setJumlah(e.target.value)} sx={{ mb: 2 }} />

            <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onClick={process}>Donasi</button>
        </Box></>
        
    )
}

export default Payment