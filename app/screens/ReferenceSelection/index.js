import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions
} from 'react-native';
import {connect} from 'react-redux'
import {SelectionTab} from './routes/index'
import {fetchVersionBooks} from '../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';
import APIFetch from '../../utils/APIFetch'
import ReloadButton from '../../components/ReloadButton';
import { styles } from  './styles';

class ReferenceSelection extends Component {

  constructor(props){
    super(props)
    console.log("REFERNCE SELECTION NAVIGATION : " + JSON.stringify(props.navigation))
    console.log("REFERNCE SELECTION SCREEN : " + JSON.stringify(props.screenProps))    
    
    this.state = {
    //   selectedBookIndex: 0,
      selectedBookId: this.props.navigation.state.params.bookId,
      selectedBookName: this.props.navigation.state.params.bookName,
      totalChapters:this.props.navigation.state.params.totalChapters,
      selectedChapterIndex: 0,
      selectedChapterNumber: this.props.navigation.state.params.chapterNumber,
      
      selectedVerseIndex: 0,
      selectedVerseNumber: '',

    }
    this.alertPresent =false

  }

  updateSelectedBook = (item) => {
    console.log("item ob book ",item)
    this.setState({
        // selectedBookIndex: index,
        selectedBookId: item.bookId, 
        selectedBookName: item.bookName, 
        totalChapters: item.numOfChapters,
    })
  }

  updateSelectedChapter = (chapter, index) => {
    var chapterNum = chapter === null ?  this.state.selectedChapterNumber : chapter
    console.log("CHAPTER NUMBER ",chapter , "chapter number ",chapterNum,"selected book name" ,this.state.selectedBookName)
    // this.state.selectedChapterNumber > this.state.totalChapters ? '1' : chapterNum,
    this.setState({selectedChapterNumber:chapterNum,
      selectedChapterIndex:index !=null && index,
    },()=>{
      this.props.navigation.state.params.getReference({
        bookId:this.state.selectedBookId,
        bookName:this.state.selectedBookName,
        chapterNumber: chapterNum > this.state.totalChapters ? '1' : chapterNum,
        totalChapters:this.state.totalChapters,
      })
      if(this.props.navigation.state.params.parallelContent){
        this.props.books.length = 0
      }
      this.props.navigation.goBack()
    })
  }
  async componentDidMount(){
    if(this.props.navigation.state.params.parallelContent){
      this.props.fetchVersionBooks({language:this.props.parallelContentLanguage,versionCode:this.props.parallelContentVersionCode,downloaded:false,sourceId:this.props.parallelContentSourceId})
    }
    else{
      this.props.fetchVersionBooks({language:this.props.language,versionCode:this.props.versionCode,downloaded:this.props.downloaded,sourceId:this.props.sourceId})
    }
    // var bookLangugae = await APIFetch.fetchBookInLanguage()
    // for(var i=0;i<=bookLangugae.length;i++){
    // console.log("parallelContentType ",bookLangugae[i].language)
    // }
  }
  errorMessage(){
    if (!this.alertPresent) {
        this.alertPresent = true;
        if (this.props.error !== null) {
            Alert.alert("", "Check your internet connection", [{text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
        } else {
            this.alertPresent = false;
        }
    }
  }
  
  reloadBooks=()=>{
    this.errorMessage()
    if(this.props.navigation.state.params.parallelContent){
      this.props.fetchVersionBooks({language:this.props.parallelContentLanguage,versionCode:this.props.parallelContentVersionCode,downloaded:false,sourceId:this.props.parallelContentSourceId})
    }
    else{
      this.props.fetchVersionBooks({language:this.props.language,versionCode:this.props.versionCode,downloaded:this.props.downloaded,sourceId:this.props.sourceId})
    }
    // this.props.fetchVersionBooks({language:this.props.language,versionCode:this.props.versionCode,downloaded:this.props.downloaded,sourceId:this.props.sourceId})
  }
  render() {
    this.styles = styles(this.props.colorFile, this.props.sizeFile);  
    return (
      this.props.isLoading ?
        <Spinner
        visible={true}
        textContent={'Loading...'}
        //  textStyle={styles.spinnerTextStyle}
      /> : ( 
        this.props.error ? 
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <ReloadButton
          styles={this.styles}
          reloadFunction={this.reloadBooks}
          />
        {/* <TouchableOpacity 
        onPress={this.reloadBooks}
        style={{height:40,width:120,borderRadius:4,backgroundColor:'#3F51B5',justifyContent:'center',alignItems:'center'}}
        >
        <Text style={{fontSize:18,color:'#fff'}}>Reload</Text>
        </TouchableOpacity> */}
        </View>
        :
        <SelectionTab 
        screenProps={{
        selectedBookIndex: this.state.selectedBookIndex,
        selectedBookId: this.state.selectedBookId,
        selectedChapterIndex: this.state.selectedChapterIndex,
        selectedChapterNumber: this.state.selectedChapterNumber,
        selectedVerseIndex: this.state.selectedVerseIndex,
        selectedVerseNumber: this.state.selectedVerseNumber,
        totalChapters:this.state.totalChapters,

        updateSelectedBook: this.updateSelectedBook,
        updateSelectedChapter: this.updateSelectedChapter,
        onPressCheck:this.onPressCheck

      }}/>
      ) 
      
    );
  }
  
};


const mapStateToProps = state =>{
    return{
        language: state.updateVersion.language,
        languageCode:state.updateVersion.languageCode,
        versionCode:state.updateVersion.versionCode,
        sourceId:state.updateVersion.sourceId,
        downloaded:state.updateVersion.downloaded,

        parallelContentSourceId:state.updateVersion.parallelContentSourceId,
        parallelContentVersionCode:state.updateVersion.parallelContentVersionCode,
        parallelContentLanguage:state.updateVersion.parallelContentLanguage,
        parallelContentLanguageCode:state.updateVersion.parallelContentLanguageCode,
        parallelContentType:state.updateVersion.parallelContentType,

        books:state.versionFetch.data,
        error:state.versionFetch.error,
        isLoading:state.versionFetch.loading,

        sizeFile:state.updateStyling.sizeFile,
        colorFile:state.updateStyling.colorFile,
    }
  }
  const mapDispatchToProps = dispatch =>{
    return {
    fetchVersionBooks:(payload)=>dispatch(fetchVersionBooks(payload)),
    }
  }
  export  default connect(mapStateToProps,mapDispatchToProps)(ReferenceSelection)