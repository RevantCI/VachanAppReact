



import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Card, CardItem } from 'native-base'
import APIFetch from '../../../utils/APIFetch'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'
import { bookStyle } from './styles.js'
import { Toast } from 'native-base'

class Infographics extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerTitle: 'Infographics',

    }
  }
  constructor(props) {
    super(props);
    this.state = {
      bookId: this.props.navigation.state.params ? this.props.navigation.state.params.bookId : null,
      bookName: this.props.navigation.state.params ? this.props.navigation.state.params.bookName : null,
      infographics: [],
      url: null,
      isLoading: false
    }
    this.styles = bookStyle(this.props.colorFile, this.props.sizeFile);

  }
  async componentDidMount() {
    const apiData = await APIFetch.getInfographics(this.props.languageCode)
    let infographicsBook = []
    if (apiData) {
      let found = false
      for (var i = 0; i < apiData.books.length; i++) {
        if (this.state.bookId) {
          if (apiData.books[i].bookCode == this.state.bookId) {
            found = true
            infographicsBook.push(apiData.books[i])
          }
        }
      }
      if (found) {
        this.setState({ infographics: infographicsBook, url: apiData.url })
      } else {
        if (this.state.bookId){
          Toast.show({
            text: 'Infographics for '+this.state.bookName +'is unavaialble. You can checkout other books',
            buttonText: "Okay",
            duration: 3000
          })
        }
        this.setState({ infographics: apiData.books, url: apiData.url })
      }
    }
  }
  gotoImage = (item) => {
    this.props.navigation.navigate("InfographicsImage", { url: this.state.url, fileName: item.fileName })
  }
  renderItem = ({ item }) => {
    console.log("ITEM ", item)
    console.log("ITEM book code", item.bookCode)
    var bookName = null
    if (this.props.books) {
      for (var i = 0; i <= this.props.books.length - 1; i++) {
        var bId = this.props.books[i].bookId
        if (bId == item.bookCode) {
          bookName = this.props.books[i].bookName
        }
      }
    } else {
      this.setState({ bookmarksList: [] })
      return
    }
    var value = item.infographics.map(e =>
      <Card>
        <CardItem style={this.styles.cardItemStyle} >
          <TouchableOpacity style={this.styles.infoView} onPress={() => this.gotoImage(e)}>
            <Text style={this.styles.infoText}>{bookName}: {e.title}</Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
    )
    return (
      <View>
        {bookName && value}
      </View>
    )
  }
  render() {
    return (
      <View style={this.styles.container}>
        {
          this.state.isLoading ?
            <ActivityIndicator animate={true} style={{ justifyContent: 'center', alignSelf: 'center' }} /> :
            <FlatList
              data={this.state.infographics}
              contentContainerStyle={this.state.infographics.length === 0 && this.styles.centerEmptySet}
              renderItem={this.renderItem}
              ListEmptyComponent={
                <View style={this.styles.emptyMessageContainer}>
                  <Icon name="image" style={this.styles.emptyMessageIcon} />
                  <Text style={this.styles.messageEmpty}>
                    No Infographics for {this.props.languageName}
                  </Text>
                </View>
              }
            />
        }
      </View>
    )
  }
}


const mapStateToProps = state => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    books: state.versionFetch.data,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}


export default connect(mapStateToProps, null)(Infographics)

