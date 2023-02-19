import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatLogo from "../assets/chat.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentWalletConnected } from "../utils/getCurrentWalletConnected";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getAddress = async () => {
      const address = await getCurrentWalletConnected();
      if (address != null) {
        navigate("/");
      } else {
        console.log("Not connected !!! ");
      }
    };
    getAddress();
  }, [navigate]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        // Metamask installed
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // setWalletAddress(accounts[0]);
        console.log(accounts[0]);
        navigate("/");
      } catch (error) {
        console.error(error.message);
      }
    } else {
      // Metamask is not installed
      console.log("Install Metamask");
    }
  };

  return (
    <>
      <FormContainer>
        <img src={ChatLogo} alt="logo" />
        <button onClick={connectWallet}>Connect Wallet</button>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;
