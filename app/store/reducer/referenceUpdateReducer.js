import { SELECTED_BOOK, SELECTED_CHAPTER, SELECTED_VERSE  } from '../action/actionsType';

const initialState = {
    bookId: '3jn',
    bookName: '3 John',
    chapterNumber:1,
    totalChapters:1,
    verseNumber: 1,
    totalVerses:15,
    verseText:'',
    bookName:'3 यूहन्ना'
}

function referenceUpdateReducer(state=initialState,action){
    switch(action.type) {
        case SELECTED_BOOK:
        return {
            ...state,
            bookId:action.bookId,
            bookName:action.bookName,
            totalChapters:action.totalChapters,
        }
        case SELECTED_CHAPTER:
        return {
            ...state,
            chapterNumber:action.chapterNumber,
            totalVerses:action.totalVerses,
        }
        case SELECTED_VERSE:
        return {
            ...state,
            verseNumber:action.verseNumber,
        }
       
        default: 
        return state
    }
}

export default referenceUpdateReducer