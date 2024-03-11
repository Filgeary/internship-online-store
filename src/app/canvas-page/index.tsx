import Canvas from '@src/containers/canvas';
import { Circle, Edit2, Minus, RefreshCw, Square, Triangle, Type, X } from 'react-feather';

const iconsMap = {
  type: Type,
  circle: Circle,
  line: Minus,
  rect: Square,
  triangle: Triangle,
  pencil: Edit2,
  clear: X,
  random: RefreshCw,
};

type TKeyOfIcons = keyof typeof iconsMap;

const CanvasPage = () => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Canvas />
      <div
        style={{
          position: 'absolute',
          top: '88%',
          left: '50%',
          width: '80%',
          height: '80px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          placeItems: 'center',
          margin: '0 auto',
          fontSize: 48,
          color: 'white',
          backgroundColor: '#323232',
          transform: 'translateX(-50%)',
          borderRadius: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          {Object.entries(iconsMap).map(item => {
            const [key, Icon] = item as [TKeyOfIcons, (typeof iconsMap)[TKeyOfIcons]];
            return (
              <button
                key={key}
                style={{
                  padding: '8px 12px',
                  border: '3px solid #424242',
                  borderRadius: '12px',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                type='button'
                title={key}
                onClick={() => {
                  console.log(key);
                }}
              >
                <Icon
                  size={28}
                  color='white'
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
