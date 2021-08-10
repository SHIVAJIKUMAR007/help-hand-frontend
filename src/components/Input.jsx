import React from 'react'
import styled from 'styled-components';

function Input({name, type, placeholder}) {
    return (
        <Box type={type} placeholder={placeholder} name={name} />
    )
}

export default Input



const Box = styled.input `
    padding: 10px 20px;
    width: 300px;
    outline: none;
    border: none;
    font-family: 'Fredoka One', cursive;
    box-shadow: 0 0 3px #0a043c;
    border-radius: 7px;
    margin-bottom: 7px;

    :focus::placeholder{
        color: transparent;
    }
`