import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DbQueries from '../../utils/dbQueries'
import { getBookChaptersFromMapping } from '../../utils/UtilFunctions';
import { highlightstyle } from './styles'
import { connect } from 'react-redux'
import { updateVersionBook } from '../../store/action/'
import firebase from 'react-native-firebase'


class HighLights extends Component {
  static navigationOptions = {
    headerTitle: 'Highlights',
  };

  constructor(props) {
    super(props)
    this.state = {
      HightlightedVerseArray: [],
      isLoading: false
    }
    this.styles = highlightstyle(this.props.colorFile, this.props.sizeFile);

  }
  async getHighlights() {
    let model2 = await DbQueries.queryHighlights(this.props.languageName, this.props.versionCode, null)
    if (model2 == null) {
    }
    else {

    }
  }
  removeHighlight = (id, chapterNum, verseNum) => {
    var data = this.state.HightlightedVerseArray
    index = -1
    data.forEach((a, i) => {
      if (a.bookId == id && a.chapterNumber == chapterNum) {
        a.verseNumber.forEach(async (b, j) => {
          if (b == verseNum) {
            if (a.verseNumber.length == 1) {
              if (this.props.emai) {
                firebase.database().ref("users/" + this.props.uid + "/highlights/" + this.props.sourceId + "/" + id + "/" + chapterNum).remove()
              }
              data.splice(i, 1)
            }
            else {
              a.verseNumber.splice(j, 1)
              index = i
            }
          }
        })

      }
    })
    var updates = {}
    if (index != -1) {
      updates[chapterNum] = data[index].verseNumber
      firebase.database().ref("users/" + this.props.uid + "/highlights/" + this.props.sourceId + "/" + id).update(updates)
    }
    this.setState({ HightlightedVerseArray: data })
  }
  fetchHighlights() {
    if (this.props.email) {
      this.setState({ isLoading: true }, () => {
        firebase.database().ref("/users/" + this.props.uid + "/highlights/" + this.props.sourceId + "/").once('value', (snapshot) => {
          var highlights = snapshot.val()
          var array = []
          if (highlights != null) {
            for (var key in highlights) {
              for (var val in highlights[key]) {
                if (highlights[key][val] != null) {
                  array.push({ bookId: key, chapterNumber: val, verseNumber: highlights[key][val] })
                }
              }
            }
            this.setState({ HightlightedVerseArray: array, isLoading: false })
          } else {
            this.setState({ HightlightedVerseArray: [], isLoading: false })
          }
        })
        this.setState({ isLoading: false })
      })
    }
  }
  async componentDidMount() {
    this.fetchHighlights()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.books.length != this.props.books.length) {
      this.fetchHighlights()
    }
  }
  navigateToBible = (bId, bookName, chapterNum, verseNum) => {
    this.props.updateVersionBook({
      bookId: bId,
      bookName: bookName,
      chapterNumber: chapterNum,
      totalChapters: getBookChaptersFromMapping(bId),
    })
    this.props.navigation.navigate("Bible")
  }
  renderItem = ({ item, index }) => {
    var bookName = null
    if (this.props.books) {
      for (var i = 0; i <= this.props.books.length - 1; i++) {
        var bId = this.props.books[i].bookId
        if (bId == item.bookId) {
          bookName = this.props.books[i].bookName
        }
      }
    }
    else {
      this.setState({ HightlightedVerseArray: [] })
      return
    }

    let value = item.verseNumber &&
      item.verseNumber.map(e =>
        <TouchableOpacity style={this.styles.bookmarksView} onPress={() => { this.navigateToBible(item.bookId, bookName, item.chapterNumber, e) }} >
          <Text style={this.styles.bookmarksText}>{bookName}  {":"} {item.chapterNumber} {":"} {e}</Text>
          <Icon name='delete-forever' style={this.styles.iconCustom}
            onPress={() => { this.removeHighlight(item.bookId, item.chapterNumber, e) }}
          />
        </TouchableOpacity>
      )
    return (
      <View>{bookName && value}</View>
    )
  }
  render() {
    return (
      <View style={this.styles.container}>
        {this.state.isLoading ?
          <ActivityIndicator animate={true} style={{ justifyContent: 'center', alignSelf: 'center' }} /> :
          <FlatList
            data={this.state.HightlightedVerseArray}
            contentContainerStyle={this.state.HightlightedVerseArray.length === 0 && this.styles.centerEmptySet}
            renderItem={this.renderItem}
            ListEmptyComponent={
              <View style={this.styles.emptyMessageContainer}>
                <Icon name="border-color" style={this.styles.emptyMessageIcon} onPress={() => { this.props.navigation.navigate("Bible") }} />
                <Text
                  style={this.styles.messageEmpty}>
                  Select verse to Highlight
                </Text>
              </View>
            }
          />
        }
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    languageName: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    sourceId: state.updateVersion.sourceId,
    email: state.userInfo.email,
    uid: state.userInfo.uid,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    books: state.versionFetch.data,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HighLights)