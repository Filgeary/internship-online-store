import React from 'react';
import Spinner from "@src/components/spinner";
import useSelector from "@src/hooks/use-selector";
import ChatComponent from "@src/components/chat-component";
import useStore from "@src/hooks/use-store";

function ChatContainer() {
    const store = useStore()
    const select = useSelector(select => ({
        message: select.chat.message,
        waiting: select.chat.waiting,
        username: select.session.user.username,
    }))

    function sendMessage(text: string) {
        store.actions.chat.send(text)
    }

    function uploadOldMessages () {
        store.actions.chat.uploadOldMessage()
    }

    return (
        <>
            <Spinner active={select.waiting}>
                <ChatComponent list={select.message} username={select.username} sendMessage={sendMessage} uploadOldMessages={uploadOldMessages}/>
            </Spinner>
        </>
    );
}

export default ChatContainer;
