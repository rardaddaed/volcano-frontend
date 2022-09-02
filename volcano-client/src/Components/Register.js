import React from 'react'
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";
import Card from "@mui/material/Card";

function Register() {
    const emailElementRef = useRef();
    const passwordElementRef = useRef();

    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    // Handles registeration request, alerts error if error responded, navigates to volcano list if resgiteration suceeds
    let handleSubmit = async (e) => {
        e.preventDefault();
        let item = { email: emailElementRef.current.value, password: passwordElementRef.current.value }
        const registerUrl = "http://sefdb02.qut.edu.au:3001/user/register";

        let result = await fetch(registerUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                "accept": 'application/json',
                "Content-Type": 'application/json'
            }
        })
        result = await result.json();
        if (result.message === "User already exists") {
            setMessage("User already exists!")
        }
        else if (result.message === "Request body incomplete, both email and password are required") {
            setMessage("Please complete the registration form!")
        } else {
            navigate(`/volcanolist/`);
        }
        setOpen(true);
    }

    // Returns registration form, obtains user info from textfield and alerts error if error responds
    return (
        <form onSubmit={handleSubmit}>
            <Card className='register-card' variant="outlined" >
                <div className='register-title'>
                    <h1>Resgiter</h1>
                </div>

                <div className='register-form'>
                    <div className='email-field'>
                        <TextField label="Email" variant="outlined"
                            type="email"
                            inputRef={emailElementRef} />
                    </div>
                    <br />
                    <div className='password-field'>
                        <TextField label="Password" variant="outlined"
                            type="password"
                            inputRef={passwordElementRef} />
                    </div>

                </div>
                <Button type="submit" variant='contained'>Submit</Button>
                <Snackbar open={open} onClose={() => { setOpen(false) }}>
                    {message && <Alert severity="error" sx={{ width: '100%' }}>
                        {message}
                    </Alert>}
                </Snackbar>
            </Card>
        </form>
    );

}

export default Register