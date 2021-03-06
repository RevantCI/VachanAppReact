import ApiUtils from './ApiUtils'
const API_BASE_URL = 'https://api.vachanonline.net/v1/'
const GIT_BASE_API = 'https://github.com/Bridgeconn/vachancontentrepository/raw/master/'
const OWN_BASE_URL = 'https://raw.githubusercontent.com/neetuy/BibleContent/master/jpg_files/'

var APIFetch = {

    async getVersions() {
        try {
            return await fetch(API_BASE_URL + "bibles", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },

    async availableBooks(sourceId) {
        try {
            return await fetch(API_BASE_URL + "bibles" + "/" + sourceId + "/" + "books", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },

    async getChapterContent(sourceId, bookId, chapterNum) {
        try {
            return await fetch(API_BASE_URL + "bibles" + "/" + sourceId + "/" + "books" + "/" + bookId + "/" + "chapter" + "/" + chapterNum, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },
    async getAllBooks(sourceId, type) {
        try {
            return await fetch(API_BASE_URL + "bibles" + "/" + sourceId + "/" + type, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },
    async getAudioBible(language_code, version, bookId, chapter) {
        const version_code = version.toLowerCase()
        // const book_code = bookId.toLowerCase()
        try {
            return await fetch(GIT_BASE_API + "audio_bibles" + "/" + language_code + "/" + version_code + "/" + bookId + "/" + chapter + ".mp3", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response)
                .catch(e =>  e)
        } catch (error) {
            return error;
        }
    },
    async availableAudioBook(language_code, version) {
        const version_code = version.toLowerCase()
        try {
            return await fetch(GIT_BASE_API + "audio_bibles" + "/" + language_code + "/" + version_code + "/" + "manifest.json", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>e)
        } catch (error) {
            return error;
        }
    },


    async getAvailableInfographics() {
        try {
            return await fetch(OWN_BASE_URL + "HIN" + "/mapping.json", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>  e)
        } catch (error) {
            return error;
        }
    },
    async getInfographicsFile(language_code, filname) {
        try {
            return await fetch(OWN_BASE_URL + "HIN" + "/" + encodeURIComponent(filename), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>  e)
        } catch (error) {
            return error;
        }
    },
    async getAvailableCommentary() {
        try {
            return await fetch('https://api.vachanonline.net/v1/commentaries', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>  e)
        } catch (error) {
            return error;
        }
    },
    async commentaryContent() {
        try {
            return await fetch('https://api.vachanonline.net/v1/commentaries/67/gen/1', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>  e)
        } catch (error) {
            return error;
        }
    },
    async fetchWord(sourceId, wordId) {
        try {
            return await fetch('https://api.vachanonline.net/v1/dictionaries/' + sourceId + "/" + wordId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>  e)
        } catch (error) {
            return error;
        }
    },
    async fetchBookInLanguage() {
        try {
            return await fetch('https://api.vachanonline.net/v1/booknames', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },
    async searchText(sId, text) {
        try {
            return await fetch('https://api.vachanonline.net/v1/search/' + JSON.parse(sId) + '?keyword=' + text, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },
    async fetchVideo(language_code){
        console.log(" language  code fetch video ",language_code)
        try {
            return await fetch('https://api.vachanonline.net/v1/videos?language='+language_code,{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    }



}
export default APIFetch;