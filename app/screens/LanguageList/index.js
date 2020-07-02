import React, { Component } from 'react';
import { Text,Alert, StyleSheet,ScrollView,Dimensions, Modal,View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card,ListItem,Left,Right,List,Accordion} from 'native-base'
import firebase from 'react-native-firebase';
import { NavigationActions,StackActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
import {getBookSectionFromMapping, getBookNumberFromMapping } from '../../utils/UtilFunctions';
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants';
import { styles } from './styles.js';
import {connect} from 'react-redux';
import {updateVersion,fetchVersionBooks,fetchAllContent,updateMetadata} from '../../store/action/'
import Spinner from 'react-native-loading-spinner-overlay';

import {API_BASE_URL} from '../../utils/APIConstant'
import { State } from 'react-native-gesture-handler';

// const languageList = async () => { 
//   return await DbQueries.getLangaugeList()
// }
// const booksValue = null

class LanguageList extends Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Languages',
    });
    constructor(props){
      super(props)
      // console.log("LANGUAGELIST PROPS ",this.props.navigation.state.routeName)
      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
        this.state = {
          isLoading: false,
          text: '',
          languages:[],
          // searchList:[],
          startDownload:false,
          index : -1,
          // languageName:'',
          language:this.props.language,
          versionCode:this.props.versionCode,
          downloaded:this.props.downloaded,
          sourceId:this.props.sourceId,

          colorFile:this.props.colorFile,
          sizeFile:this.props.sizeFile,

      }
      this.styles = styles(this.props.colorFile, this.props.sizeFile);  
      this.fetchLanguages = this.fetchLanguages.bind(this) 
      this.alertPresent = false 
    }
   

     componentDidMount(){
      this.fetchLanguages()  
    }

    errorMessage(){
      if (!this.alertPresent) {
          this.alertPresent = true;
          if (this.state.languages.length == 0) {
            this.fetchLanguages()
            // Alert.alert("", "Check your internet connection", [{text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
            }else{
            console.log("LANGUAGEG LIST ",this.state.languages.length)
            this.alertPresent = false;
            // this.setState({languages:this.props.bibleLanguages[0].content})
          }
      }
    }
  updateData(){
      this.props.fetchAllContent()
      this.errorMessage()
  }
    async fetchLanguages(){
      console.log(" language list ")
      var lanVer = []
      const languageList =  await DbQueries.getLangaugeList()
      if(languageList === null){
        const response = await APIFetch.fetchBookInLanguage()
        if(this.props.bibleLanguages[0].content.length > 0){
          DbQueries.addLangaugeList(this.props.bibleLanguages[0].content,response)
          lanVer = this.props.bibleLanguages[0].content
        }
        else{
          console.log("no language found call update ")
          this.updateData()
        }
      }
      else{
        for(var i =0 ; i<languageList.length;i++){
          lanVer.push(languageList[i])
        }
      }
      this.setState({
        languages: lanVer,
        // searchList: lanVer
      })
    }
    downloadBible = async(langName,verCode,index,sourceId)=>{
      var bookModels = []
      try{
        const curTime = Date.now().toString() + "_1"
        notification = new firebase.notifications.Notification()
            .setNotificationId(curTime)
            .setTitle('Downloading')
            .setBody(this.state.language +" Bible downloading" )
            .android.setChannelId('download_channel')
            .android.setSmallIcon('ic_launcher')
            .android.setOngoing(true)
        firebase.notifications().displayNotification(notification)
        this.setState({startDownload:true})
        const response = await APIFetch.fetchBookInLanguage()
        var content = await APIFetch.getAllBooks(sourceId,"json")
        for(var i =0;i<response.length;i++){
          if(langName.toLowerCase() == response[i].language.name && content.bibleContent){
            for(var j=0;j<response[i].bookNames.length;j++){
            console.log("book name while downloading from api ",response[i].bookNames[j].short)
            bookModels.push({
            languageName: langName,
            versionCode: verCode,
            bookId:response[i].bookNames[j].book_code,
            bookName:response[i].bookNames[j].short,
            bookNumber:response[i].bookNames[j].book_id,
            chapters: this.getChapters(content.bibleContent,response[i].bookNames[j].book_code),
            section: getBookSectionFromMapping(response[i].bookNames[j].book_code),
          })
            }
          }
        }
      DbQueries.addNewVersion(langName,verCode,bookModels,sourceId)
      firebase.notifications().removeDeliveredNotification(curTime)
      await this.fetchLanguages()
      this.setState({startDownload:false})
      }catch(error){
      this.setState({startDownload:false})
      console.log("error ",error)
        alert("There is some error on downloading this version please select another version")
      }
    }
    getChapters=(content,bookId)=>{
      var chapterModels =[]
      
        for(var id in content){
        if(content != null && id == bookId){
          console.log("id in chapter",id,bookId)
          for(var i=0; i<content[id].chapters.length; i++){
            var  verseModels = []
            for(var j=0; j<content[id].chapters[i].verses.length; j++){
              verseModels.push(content[id].chapters[i].verses[j])
            }
            var chapterModel = { 
              chapterNumber:  parseInt(content[id].chapters[i].header.title),
              numberOfVerses: parseInt(content[id].chapters[i].verses.length),
              verses:verseModels,
            }
            chapterModels.push(chapterModel)
          }
          return chapterModels
        }
      }
    }

     navigateTo(langName,langCode,booklist,verCode,sourceId,metadata,downloaded){
      // this.props.fetchVersionBooks({language:langName,versionCode:verCode,downloaded:downloaded,sourceId:sourceId})
      this.props.updateMetadata({copyrightHolder:metadata[0].copyrightHolder,
        description:metadata[0].description,
        license:metadata[0].license,
        source:metadata[0].source,
        technologyPartner:metadata[0].technologyPartner,
        revision:metadata[0].revision,
        versionNameGL:metadata.versionNameGL}) 
      this.props.navigation.state.params.updateLangVer({
        sourceId:sourceId,languageName:langName,languageCode:langCode, 
        versionCode:verCode,downloaded:downloaded,
        books:booklist
      })
      this.props.navigation.pop()
    }
    async deleteBible(languageName,languageCode,versionCode,sourceId,downloaded){
     await  DbQueries.deleteBibleVersion(languageName,versionCode,sourceId,downloaded)
     await this.fetchLanguages()
    }

    _renderHeader = (item, expanded) =>{
      return(
        <View style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center" ,
          }}>
          <Text
          style={this.styles.headerText} 
          >
          {/* {" "}{item.languageName.charAt(0).toUpperCase()+item.languageName.slice(1)} */}
          {item.languageName}
          </Text>
          <Icon  style={this.styles.iconStyle} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>
        </View>
      )
    }
    _renderContent = (item) =>{
      return(
        <View>
            {/*Content under the header of the Expandable List Item*/}
            {item.versionModels.map((element, index, key) => (
              <TouchableOpacity 
              style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:8}} 
               onPress={()=>{this.navigateTo(item.languageName,item.languageCode,item.bookNameList,element.versionCode,element.sourceId,element.metaData, element.downloaded)}}>
                  <View>
                    <Text style={[this.styles.text,{marginLeft:8,fontWeight:'bold'}]} >{element.versionCode} </Text>
                    <Text style={[this.styles.text,{marginLeft:8}]} >{element.versionName}</Text>
                  </View>
                  <View>
                  {
                    element.downloaded == true ? 
                    <Icon style={[this.styles.iconStyle,{marginRight:8}]} name="delete" size={24}  onPress={()=>{this.deleteBible(item.languageName,item.languageCode,element.versionCode,element.sourceId, element.downloaded)}}
                    />
                  :
                    <Icon  style={[this.styles.iconStyle,{marginRight:12}]} name="file-download" size={24} onPress={()=>{this.downloadBible(item.languageName,element.versionCode,index,element.sourceId)}}/>
                  }
                </View>
                </TouchableOpacity>
            ))}
        </View>

      )
    }
    render(){
      console.log(" LANGUaGE ",this.state.languages )
      return (
        <View style={this.styles.MainContainer}>
        {
        this.props.isLoading ?
            <Spinner
            visible={true}
            textContent={'Loading...'}
            //  textStyle={styles.spinnerTextStyle}
          />
           :null }
          {this.state.startDownload ?
            <Spinner
            visible={true}
            textContent={'DOWNLOADING BIBLE...'}
            //  textStyle={styles.spinnerTextStyle}
          />
        :null }
          
            {this.state.languages.length == 0  ?
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <TouchableOpacity 
              onPress={()=>this.updateData()}
              style={{height:40,width:120,borderRadius:4,backgroundColor:'#3F51B5',justifyContent:'center',alignItems:'center'}}
              >
              <Text style={{fontSize:18,color:'#fff'}}>Reload</Text>
              </TouchableOpacity>
              </View>
              :
              <Accordion 
                dataArray={this.state.languages}
                animation={true}
                expanded={true}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
              />
              }
            
        
       
      </View>
      )
    }
}

const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    versionCode:state.updateVersion.versionCode,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,
    bookId:state.updateVersion.bookId,
    chapterNumber:state.updateVersion.chapterNumber,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    bibleLanguages:state.contents.contentLanguages,
    books:state.versionFetch.data,
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    updateVersion: (value)=>dispatch(updateVersion(value)),
    fetchAllContent:()=>dispatch(fetchAllContent()),
    fetchVersionBooks:(payload)=>dispatch(fetchVersionBooks(payload)),
    updateMetadata:(payload)=>dispatch(updateMetadata(payload)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(LanguageList)