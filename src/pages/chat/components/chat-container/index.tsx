import React from 'react';
import Spinner from "@src/ww-old-components-postponed/spinner";
import useSelector from "../../ww-old-hooks-postponed/use-selector";
import ChatComponent from "@src/ww-old-components-postponed/chat-component";
import useStore from "../../ww-old-hooks-postponed/use-store";

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
