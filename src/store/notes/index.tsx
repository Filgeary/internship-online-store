import StoreModule from '../module';
import { TNote, TNotesState } from './types';

class NotesStore extends StoreModule<TNotesState> {
  initState(): TNotesState {
    return {
      list: [
        {
          _id: '1',
          title: 'Выучить JS',
          description: 'Таким образом новая модель организационной деятельности',
        },
        {
          _id: '2',
          title: 'Выучить TS',
          description: 'Задача организации, в особенности же постоянное',
        },
        {
          _id: '3',
          title: 'Выучить React',
          description: 'Значимость этих проблем настолько очевидна',
        },
      ],
      count: 3,
      waiting: false,
    };
  }

  /**
   * Удалить заметку
   */
  deleteNote(id: string) {
    const newList = this.getState().list.filter((note) => note._id !== id);

    this.setState({
      ...this.getState(),
      list: newList,
      count: this.getState().count - 1,
    });
  }

  /**
   * Добавить заметку
   */
  appendNote(note: TNote) {
    this.setState({
      ...this.getState(),
      list: [...this.getState().list, note],
      count: this.getState().count + 1,
    });
  }

  /**
   * Установить список заметок
   */
  setNotesList(notesList: TNote[]) {
    this.setState({
      ...this.getState(),
      list: notesList,
      count: notesList.length,
    });
  }
}

export default NotesStore;
