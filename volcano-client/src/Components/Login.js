import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";
import Card from "@mui/material/Card";
import { useState, useRef } from 'react';

function Login(props) {
    const emailElementRef = useRef();
    const passwordElementRef = useRef();

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Handles the login request, fetches from API and stores the JWT token or alerts messages if error responded
    let handleSubmit = async (e) => {
        e.preventDefault();
        let item = {email: emailElementRef.current.value, password: passwordElementRef.current.value}
        const loginUrl = "http://sefdb02.qut.edu.au:3001/user/login"

        let result = await fetch(loginUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers:{
                "accept" : 'application/json',
                "Content-Type" : 'application/json'
            }
        })
        result = await result.json();
        if (result.message === "Request body incomplete, both email and password are required"){
            setMessage("Please complete the login form!");
        } else if(result.message === "Incorrect email or password"){
            setMessage("Incorrect email or password!");
        } else {
            localStorage.setItem("token", result.token);
            props.setIsLoggedIn(true);
            navigate(`/volcanolist/`);
        }
        setOpen(true);

    
    }

    // Returns the login form and obtains the login info from textfield, alerts error if error is responded
    return (
        <form onSubmit={handleSubmit}>
            <Card className='login-card' variant="outlined" >
            <div  className='login-title'>
                <h1>Login</h1>
            </div>

                <div className='login-form'>
                    <div className='email-field'>
                        <TextField label="Email" variant="outlined" 
                        type="email"
                        inputRef={emailElementRef}/>
                    </div>
                    <br />
                    <div className='password-field'>
                        <TextField label="Password" variant="outlined" 
                        type="password"
                        inputRef={passwordElementRef}/>
                    </div>
                    
                </div>
                <Button type="submit" variant='contained'>Login</Button>
                <Snackbar open={open} onClose={() => {setOpen(false)}}>
                {message &&  <Alert severity="error" sx={{ width: '100%' }}>
                        {message}
                    </Alert>}
                </Snackbar>
            </Card>
            </form>
    );

}

export default Login