import React, { Component } from 'react';
import { Text, StyleSheet,ScrollView,Dimensions, Modal,View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import timestamp from '../../assets/timestamp.json'
import {NavigationActions} from 'react-navigation'
import  grammar from 'usfm-grammar'
import { getBookNameFromMapping, getBookSectionFromMapping, getBookNumberFromMapping } from '../../utils/UtilFunctions';
import VerseModel from '../../models/VerseModel';
import dbQueries from '../../utils/dbQueries';
import { catchClause } from '@babel/types';
const width = Dimensions.get('window').width;
var height =  Dimensions.get('window').width;

const languageList = async () => { 
return await dbQueries.getLangaugeList()
}

//  {
  // try{
    // return await dbQueries.getLangaugeList()
  // }
  // catch(error){
    // console.log("erooro "+error )
  // }
  
// }



class ExpandableItemComponent extends Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
      modalVisible:true,
    };
  }
  componentWillReceiveProps(nextProps){
    // console.log("next props "+JSON.stringify(nextProps))
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log("should update next props "+JSON.stringify(nextProps)+ "next state "+nextState)
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

 
  render() {
    return (
      <View>
      <Card>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={styles.header}
        >
          <Text style={styles.headerText}>{this.props.item.languageName}</Text>
          <Icon name={this.props.item.isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-up" } style={styles.iconStyle} size={24}/>
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
          }}>
          {/*Content under the header of the Expandable List Item*/}
          {this.props.item.versionModels.map((item, index,key) => (
            <View style={styles.content}>
            <TouchableOpacity
              // onPress={this.props.goToBible}
              >
              <View style={{flex:1,flexDirection:'column',}}>
              <Text  style={{fontWeight:'bold',fontSize:18}}>{item.versionCode} </Text>
              <Text style={{fontSize:18}}> {item.versionName}</Text>
              </View>
              {/* <TouchableOpacity > */}
              </TouchableOpacity>
              {
                item.downloaded==true ? 
              //   <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.props.DownloadBible(this.props.item.languageName,item.versionCode,index)}}>
              //   <Icon name="file-download" size={24} 
              //   />
              //  </TouchableOpacity>
              <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.props.goToBible(this.props.item.languageName,item.versionCode)}}>
                <Icon name="check" size={24} 
                />
               </TouchableOpacity>
               :
              <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.props.DownloadBible(this.props.item.languageName,item.versionCode,index)}}>
                <Icon name="file-download" size={24} 
                />
               </TouchableOpacity>}
              {/* </TouchableOpacity> */}
              {/* <View style={styles.separator} /> */}
            </View>
          ))}
        </View>
      </Card>

      </View>
    );
  }
}


export default class LanguageList extends Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Languages',
    });
    constructor(props){
      super(props)
      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
        this.state = {
          isLoading: false,
          text: '',
          languages:[],
          searchList:[],
      }
    }
   
    updateLayout(index){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const array = [...this.state.languages];
      array[index]['isExpanded'] = !array[index]['isExpanded'];
      this.setState(() => {
        return {
          languages: array,
        }
      })
    }

    componentDidMount(){
      this.fetchLanguages()
    }
   
     async fetchLanguages(){
      var lanVer = []
      var oneDay = 24*60*60*1000; 
      var d = new Date('1-feb-2000')
      var ud = new Date(timestamp.languageUpdate)
      var diffDays = Math.round(Math.abs((d.getTime() - ud.getTime())/(oneDay)))
      
        if(diffDays <= 20 ){
          console.log("diff "+diffDays)
            languageList().then(async(language) => {
            console.log("language list ",language)
            console.log("language list ",language.length)

              this.setState({
                languages: language,
                searchList:language
              })
              if(language.length == 0){
                var versionRes = await APIFetch.getVersions()
                console.log("VERSION RESPONSE "+JSON.stringify(versionRes))
                
                if(versionRes){
                  var versions = []
                  var languageName = ''
                  if(versionRes.status == 200 ){
                    for(var i=0;i<=versionRes.length-1; i++){
                 
                      if(versionRes[i].contentType=="bible"){
                        var version = {
                          "versionName":versionRes[i].versionContentDescription,
                          "versionCode": versionRes[i].versionContentCode,
                          "license": versionRes[i].license,
                          "year": versionRes[i].year,
                          downloaded:false
                        }
                        versions.push(version)
                        languageName = versionRes[i].languageName
                      }
                    }
                    var langObj = {"languageName":languageName,versionModels:versions}
                    lanVer.push(langObj)
                    this.setState({
                      languages: lanVer,
                      searchList:lanVer
                    })
                    await dbQueries.addLangaugeList(langObj,versions)
                  }
                }
             
            }
            })
          .catch(err => console.error(err))
        }
       
        else{
          languageList().then(async(language) => {
            console.log("language list ",language)
            console.log("language list ",language.length)

              this.setState({
                languages: language,
                searchList:language
              })
              if(language.length == 0){
                var versionRes = await APIFetch.getVersions()
                console.log("VERSION RESPONSE "+JSON.stringify(versionRes))
                
                if(versionRes){
                  var versions = []
                  var languageName = ''
                  if(versionRes.status == 200 ){
                    for(var i=0;i<=versionRes.length-1; i++){
                 
                      if(versionRes[i].contentType=="bible"){
                        var version = {
                          "versionName":versionRes[i].versionContentDescription,
                          "versionCode": versionRes[i].versionContentCode,
                          "license": versionRes[i].license,
                          "year": versionRes[i].year,
                          downloaded:false
                        }
                        versions.push(version)
                        languageName = versionRes[i].languageName
                      }
                    }
                    var langObj = {"languageName":languageName,versionModels:versions}
                    lanVer.push(langObj)
                    this.setState({
                      languages: lanVer,
                      searchList:lanVer
                    })
                    await dbQueries.addLangaugeList(langObj,versions)
                  }
                }
             
            }
            })
          .catch(err => console.error(err))
      }
        console.log("lanvar "+JSON.stringify(lanVer))

        
  
    }
    goToVersionScreen(value){
     this.props.navigation.navigate('VersionList',  {versions: value });
    }

    SearchFilterFunction = (text)=>{
        const newData = this.state.searchList.filter(function(item){
          const itemData = item.languageName
          const textData = text.toLowerCase()
          return itemData.indexOf(textData) > -1
        })
        this.setState({
          text: text,
          languages:newData
        })
    }

    DownloadBible = async(langName,versCode,index)=>{
      // console.log("language NAME ",langName,"version cosde ",versCode)
      var chapterModels = []
      var verseModels = []
      var content = await APIFetch.getContent(18,"json",62)
      var bookId = ''

      for(var id in content){
      if(content !=null){
        for(var i=0; i< content[id].chapters.length; i++){
          verseModels = []
          for(var j=0; j< content[id].chapters[i].verses.length; j++){
              verseModels.push(content[id].chapters[i].verses[j])
          }
          var chapterModel = { 
                chapterNumber:  parseInt(content[id].chapters[i].header.title),
                numberOfVerses: parseInt(content[id].chapters[i].verses.length),
                verses:verseModels,
              }
          chapterModels.push(chapterModel)
          bookId = id
        }
      }
      }
      var bookModels = {
        languageName: langName,
        versionCode: versCode,
        bookId: bookId,
        bookName:getBookNameFromMapping(bookId,this.props.screenProps.languageName),
        chapters: chapterModels,
        section: getBookSectionFromMapping(bookId),
        bookNumber: getBookNumberFromMapping(bookId)
      }
     
      
      await DbQueries.addNewVersion(langName,versCode,bookModels)
      languageList().then(async(language) => {
        this.setState({languages:language})
      })
      .catch((error)=>{console.log("error")})
     
    }
    setModalVisible=()=>{
      this.setState({modalVisible:!this.state.modalVisible})
    }
    goToBible = (langName,verCode)=>{
      this.props.navigation.state.params.updateLanguage(langName,verCode)
      this.props.navigation.dispatch(NavigationActions.back())    
    }
  
    render(){
      // languageList =  await languageList
      // console.log("languaguage list ",languageList)
      return (
            <View style={styles.MainContainer}>
            {this.state.languages.length == 0 ?
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>   
              <ActivityIndicator 
                size="large" 
                color="#0000ff"/>
                </View>:
                <View>
        <TextInput 
          style={styles.TextInputStyleClass}
          onChangeText={(text) => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder="Search Here"
        />  
        <ScrollView>
          {this.state.languages.map((item, index) => (
            <ExpandableItemComponent
              // key={item}
              onClickFunction={this.updateLayout.bind(this, index)}
              item={item}
              DownloadBible = {this.DownloadBible}
              goToBible = {this.goToBible}
              // setModalVisible={this.setModalVisible}
            />
          ))}
        </ScrollView>
        
      </View>
            }
            </View>
      )
    }
}
const styles = StyleSheet.create({
 
    MainContainer :{
     flex:1,
     margin:8
     },
    
    rowViewContainer: {
      fontSize: 17,
      padding: 10
     },
    
     TextInputStyleClass:{
      // position:'absolute',
      // top:0,
      textAlign: 'center',
      height: 40,

      borderWidth: 1,
      borderColor: '#009688',
      borderRadius: 7 ,
      backgroundColor : "#FFFFFF"
           
      },
      container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#F5FCFF',
      },
      topHeading: {
        paddingLeft: 10,
        fontSize: 20,
      },
      header: {
        flexDirection:"row",
        padding: 6,
        paddingHorizontal:10,
        justifyContent:'space-between'
      },
      headerText: {
        fontSize: 16,
        // fontWeight: '500',
        // alignItems:'flex-start'
      },
      iconStyle:{
        // alignItems:'flex-end'
      },
      separator: {
        height: 0.5,
        backgroundColor: '#808080',
        width: '95%',
        marginLeft: 16,
        marginRight: 16,
      },
      text: {
        fontSize: 16,
        color: '#606070',
        // paddingLeft:10
      },
      content: {

        paddingHorizontal:20,
        paddingVertical:10,
        // paddingLeft: 20,
        // paddingRight: 20,
        flexDirection:"row",
        justifyContent:'space-between',
        backgroundColor: '#fff',
      },
    
   });

