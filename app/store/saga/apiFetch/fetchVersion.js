
import { FETCH_VERSION_LANGUAGE, FETCH_VERSION_BOOKS, FETCH_VERSION_CONTENT, QUERY_DOWNLOADED_BOOK } from '../../action/actionsType'
import {
  versionLanguageSuccess, versionLanguageFailure,
  versionBooksSuccess, versionBooksFailure,
  versionContentSuccess, versionContentFailure,
  downloadedBookSuccess, downloadedBookFailure
} from '../../action/'
import { getBookSectionFromMapping, getBookChaptersFromMapping } from '../../../utils/UtilFunctions';

import { put, takeLatest, call } from 'redux-saga/effects'
import fetchApi from '../../api';
import DbQueries from '../../../utils/dbQueries'

const API_BASE_URL = 'https://api.vachanonline.net/v1/'

//fetch audio available book ,audio file 
function* fetchVersionLanguage() {
  try {
    const url = API_BASE_URL + "bibles"
    const response = yield call(fetchApi, url)
    yield put(versionLanguageSuccess(response))
    yield put(versionLanguageFailure(null))

  } catch (e) {
    yield put(versionLanguageFailure(e))
    yield put(versionLanguageSuccess([]))

  }
}

function* fetchVersionBooks(params) {
  try {
    const payload = params.payload
    let bookListData = []
    if (payload.downloaded) {
      var response = yield DbQueries.getDownloadedBook(payload.language)
      for (var i = 0; i <= response.length - 1; i++) {
        var books = {
          bookId: response[i].bookId,
          bookName: response[i].bookName,
          section: getBookSectionFromMapping(response[i].bookId),
          bookNumber: response[i].bookNumber,
          numOfChapters: getBookChaptersFromMapping(response[i].bookId)
        }
        bookListData.push(books)
      }
    }
    else {
      var result = yield call(fetch, 'https://api.vachanonline.net/v1/booknames')
      if (result.ok && result.status == 200) {
        const response = yield result.json()
        for (var i = 0; i < response.length; i++) {
          if (payload.language.toLowerCase() == response[i].language.name) {
            for (var j = 0; j <= response[i].bookNames.length - 1; j++) {
              var books = {
                bookId: response[i].bookNames[j].book_code,
                bookName: response[i].bookNames[j].short,
                section: getBookSectionFromMapping(response[i].bookNames[j].book_code),
                bookNumber: response[i].bookNames[j].book_id,
                numOfChapters: getBookChaptersFromMapping(response[i].bookNames[j].book_code)
              }
              bookListData.push(books)
            }
          }
        }
      }
    }
    var res = bookListData.length == 0 ? [] : bookListData.sort(function (a, b) { return a.bookNumber - b.bookNumber })
    yield put(versionBooksSuccess(res))
    yield put(versionBooksFailure(null))

  } catch (e) {
    yield put(versionBooksFailure(e))
    yield put(versionBooksSuccess([]))
  }
}

function* queryDownloadedBook(params) {
  try {
    var content = yield DbQueries.queryVersions(params.languageName, params.versionCode, params.bookId)
    if (content !== null) {
      yield put(downloadedBookSuccess(content[0].chapters))
      yield put(downloadedBookFailure(null))
    }
  }
  catch (e) {
    yield put(downloadedBookFailure(e))
    yield put(downloadedBookSuccess([]))
  }
}

function* fetchVersionContent(params) {
  try {
    const payload = params.payload
    const url = API_BASE_URL + "bibles" + "/" + payload.sourceId + "/" + "books" + "/" + payload.bookId + "/" + "chapter" + "/" + payload.chapter
    const res = yield call(fetch, url)
    if (res.ok && res.status == 200) {
      const response = yield res.json()
      const chapterContent = response.chapterContent.verses
      const totalVerses = response.chapterContent.verses.length
      yield put(versionContentSuccess({ chapterContent: chapterContent, totalVerses: totalVerses }))
      yield put(versionContentFailure(null))
    }
    else {
      yield put(versionContentFailure(e))
      yield put(versionContentSuccess([]))
    }

  } catch (e) {
    yield put(versionContentFailure(e))
    yield put(versionContentSuccess([]))

  }
}


export const watchVersion = [
  takeLatest(FETCH_VERSION_LANGUAGE, fetchVersionLanguage),
  takeLatest(FETCH_VERSION_BOOKS, fetchVersionBooks),
  takeLatest(FETCH_VERSION_CONTENT, fetchVersionContent),
  takeLatest(QUERY_DOWNLOADED_BOOK, queryDownloadedBook),
]




