import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { getCurrentWalletConnected } from "../utils/getCurrentWalletConnected";
import { ethers } from "ethers";
import contractInfo from "../utils/WotsApp.json";

const Register = () => {
  console.log("here");
  const contractAddress = "0x228938E531DfdeD6ea683e82C83d0C84B4c35466";
  const [walletAddress, setWalletAddress] = useState("");
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [currentChat, setCurrentChat] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    //If not connected to metamask => navigate to login
    const getAddress = async () => {
      const address = await getCurrentWalletConnected();

      if (address != null) {
        console.log("Hello " + address);
        setWalletAddress(address);
      } else {
        navigate("/login");
      }
    };
    getAddress();
  }, [navigate]);

  useEffect(() => {
    listenContract();
  }, []);

  useEffect(() => {
    if (walletAddress.length > 0) {
      getContacts();
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const getContacts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const ChoKssa = new ethers.Contract(
      contractAddress,
      contractInfo.abi,
      provider.getSigner(walletAddress)
    );

    await ChoKssa.getContactsAdresses();
  };

  const listenContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const ChoKssa = new ethers.Contract(
      contractAddress,
      contractInfo.abi,
      provider.getSigner(walletAddress)
    );

    ChoKssa.on("contactsReceived", (allContacts) => {
      console.log("My contacts !!");
      console.log(allContacts);
    });
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
          {currentChat === undefined ? (
            <Welcome currentUsername={currentUser?.username || ""} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
            />
          )}
        </div>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: -webkit-fill-available;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #0e0e11;
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 20% 80%;

    @media screen and (min-width: 720px) {
      grid-template-columns: 35% 65%;
      grid-template-rows: none;
      width: 85vw;
      height: 100vh;
    }
    @media screen and (min-width: 1100px) {
      grid-template-columns: 28% 72%;
    }
  }
`;

export default Register;
