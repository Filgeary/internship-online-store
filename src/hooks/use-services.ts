import { useContext } from 'react';
import { ServicesContext } from '../context';

export default function useServices() {
  return useContext(ServicesContext);
}
