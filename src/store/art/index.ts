import StoreModule from '../module';
import { TArtState } from './types';

class ArtStore extends StoreModule<TArtState> {
  initState() {
    return {};
  }
}

export default ArtStore;
