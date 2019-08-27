import React, { Component } from 'react';
import { StackNavigator ,TabNavigator} from "react-navigation";
import SelectBook from '../SelectBook/SelectBook'
import ChapterSelection from '../numberSelection/ChapterSelection'

const SelectionTab = TabNavigator(
	{
        Books: {
            screen: SelectBook
        },
        Chapters:{
            screen:ChapterSelection
        },
       
    },
    {   
        // tabBarPosition: 'bottom',
        activeTintColor:'#fff',
        inactiveTintColor:'#D3D3D3',
        swipeEnabled:true,
        tabBarOptions: {
            labelStyle: { fontSize: 16,margin:0,padding:0 },
            showIcon: true,
            showLabel: true,
            activeTintColor: '#fff',
            upperCaseLabel: false,
            style: {
                backgroundColor: '#3F51B5', // Makes Android tab bar white instead of standard blue
            },
            indicatorStyle: {
                backgroundColor: '#fff',
            },
        },
      
    }
	
)



export default class SelectionStack extends Component {

    constructor(props){
        super(props)
        this.state = {
            bookId:'',
            chapterNumber:''
        }
    }
    updateSelectedBook = (bookId)=>{
        this.setState({bookId})
    }
    updateSelectedChapter = (bookId,chapterNumber)=>{
        this.setState({chapterNumber,bookId})
        // this.props.screenProps.updateChapterData(bookId,chapterNumber)
        this.props.navigation.state.params.updateLanguage(null,null,null,null,bookId,chapterNumber)
        // this.props.navigation.state.params.updateLanguage(chapterNumber)
        this.props.navigation.goBack()

    }

    render(){
        return(
            <SelectionTab
                screenProps={{
                    colorFile:this.props.screenProps.colorFile,
                    sizeFile:this.props.screenProps.sizeFile,
                    colorMode:this.props.screenProps.colorMode,
                    booksList:this.props.screenProps.booksList,
                    languageName:this.props.navigation.state.params.languageName,
                    versionCode:this.props.screenProps.versionCode,
                    bookId:this.state.bookId,
                    bookName:this.props.navigation.state.params.bookName,
                    chapterNumber:this.props.navigation.state.params.chapterNumber,
                    updateSelectedBook:this.updateSelectedBook,
                    updateSelectedChapter:this.updateSelectedChapter,
                }}
            
            />
        )
    }
}