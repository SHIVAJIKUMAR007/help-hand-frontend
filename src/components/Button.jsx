import React from 'react'
import styled from 'styled-components';


function Button({btntext}) {
    return (
        <ButtonBox type="submit">{btntext}</ButtonBox>
    )
}

export default Button


const ButtonBox = styled.button `
    width: 180px;
    margin-top: 20px;
    padding: 7px 25px;
    background: white;
    font-size: 18px;
    background: #fe346e; 
    color: white;
    border: none;
    outline: none;
    border-radius: 8px;
    justify-self: flex-start;
`