import React from "react";
import styled from "styled-components";
import Register from "./Register";

function Signup() {
  return (
    <Container>
      <InfoContainer>
        <img src="/images/bgimg.jpg" alt="help hand register" />
      </InfoContainer>
      <Register />
    </Container>
  );
}

export default Signup;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  img {
    height: 100vh;
    width: 600px;

    @media (max-width: 1200px) {
      width: 100%;
      margin-bottom: 20px;
    }
  }
  @media (max-width: 1200px) {
    width: 100%;
  }
`;
