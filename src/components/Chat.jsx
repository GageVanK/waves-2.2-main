import { Text, Paper, TextInput, Button, Space } from '@mantine/core';
import { useState,useContext } from "react";
import {
    collection,
    addDoc,
    where,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
  } from "firebase/firestore";
  import { db } from "../firebase-config";
  import { DeSoIdentityContext } from "react-deso-protocol";
export const Chat = () => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");
  const { currentUser } = useContext(DeSoIdentityContext);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
        user: currentUser.ProfileEntryResponse?.Username,
        room: "room1",
    });

    setNewMessage("");
  };

    return(
        <Paper shadow="xl" radius="xl" p="xl" withBorder>
      
      <form  onSubmit={handleSubmit}>
        <TextInput
           value={newMessage}
           onChange={(event) => setNewMessage(event.target.value)}
          placeholder="Say some cool shit..."
          description="Send Chat"
         
        />
        <Space h='md' />
        <Button type="submit" >
          Send
        </Button>
      </form>
    </Paper>
    )
}