import SideLayout from '@src/components/side-layout';
import type { TMessage } from '../types';

type Props = {
  message: TMessage | null;
  postMessage: (message: string) => void;
};

const WorkerMain = ({ message, postMessage }: Props) => {
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const message = (evt.target as any).message.value;
    if (typeof message === 'string' && message.trim().length > 0) {
      postMessage(message);
      (evt.target as any).reset();
    }
  };

  const parsedMessageData =
    typeof message?.data === 'string' ? message.data : JSON.stringify(message?.data, null, 2);

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Programmer vs Worker 😄</h2>
      <SideLayout
        padding='medium'
        direction='column'
      >
        <form onSubmit={handleSubmit}>
          <input
            style={{ fontSize: 20, width: '400px' }}
            ref={ref => ref && ref.focus()}
            placeholder='Type your message...'
            type='text'
            name='message'
          />
        </form>

        <div>
          <div style={{ fontWeight: 'bold' }}>{message?.owner}</div>
          <div style={{ fontStyle: 'italic', fontSize: '18px' }}>
            {message?.data && <pre style={{ whiteSpace: 'pre-wrap' }}>{parsedMessageData}</pre>}
          </div>
          <div style={{ fontSize: 'small' }}>{message?.timestamp}</div>
        </div>
      </SideLayout>
    </>
  );
};

export default WorkerMain;
