import React from 'react';
import useStore from "@src/shared/hooks/use-store";
import useSelector from "@src/shared/hooks/use-selector";
import Spinner from "@src/shared/ui/layout/spinner";
import ChatComponent from "@src/pages/chat/components/chat-component";

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
