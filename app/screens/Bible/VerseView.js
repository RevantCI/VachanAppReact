import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
const Constants = require('../../utils/constants')
import {getResultText} from '../../utils/UtilFunctions';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
const { Popover } = renderers

export default class VerseView extends Component {

  constructor(){
    super()
    this.state  = {
      opened:false
    }
  }
 
  onPress(menuValue) {
    console.log("get selection ")
    this.props.getSelection(
        this.props.index, 
        this.props.verseData.chapterNumber,
        this.props.verseData.verseNumber
    )
    Alert.alert(menuValue)
  }

  has(selectedReferences, obj) {
    for(var i = 0; i < selectedReferences.length; i++) {
      if (selectedReferences[i] == obj) {
        return true;
      }
    }
    return false;
  }
  onBackdropPress(){
    this.setState({ opened: false });
    console.log("coming to on backdrop press")
  }
  openMenu = () => {
    this.props.getSelection(
      this.props.index, 
      this.props.verseData.chapterNumber,
      this.props.verseData.verseNumber
  )
    this.menu.open();
  };

  
  render() {
    let obj = this.props.verseData.chapterNumber + '_' + this.props.index + '_' + this.props.verseData.verseNumber;
    let isSelect = this.has(this.props.selectedReferences, obj)
    let isHighlight = this.props.verseData.highlighted;
    console.log("is highlighted text "+isHighlight+" is selected text "+isSelect)

    switch(this.props.verseData.type) {
      case Constants.MarkerTypes.VERSE: {
        return (
          <TouchableWithoutFeedback onLongPress={this.openMenu}>
          <View>
          <Menu 
          ref={c => (this.menu = c)}
          onBackdropPress={() => this.onBackdropPress()}
          >
          <MenuTrigger text=""/>
            <MenuOptions style={{flexDirection:'row',justifyContent:"center"}}>
                      <MenuOption onSelect={() => this.props.makeHighlight()}  style={{alignItems:'center'}}>
                        <Text>{this.props.HighlightText == true ? "Highlight" : "Remove Highlight"}</Text>
                      </MenuOption>
                      
                      <MenuOption  onSelect={() => this.props.makeNotes()} style={{alignItems:'center'}}>
                        <Text>Note</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => this.props.share()} style={{alignItems:'center'}}>
                        <Text>Share</Text>
                      </MenuOption>
            </MenuOptions>
          </Menu>    
             <Text>
            <Text style={this.props.styles.verseNumber} >
              {this.props.verseData.verseNumber}{" "}
            </Text>
              <Text style={isSelect && isHighlight 
                      ? this.props.styles.verseTextSelectedHighlighted 
                      : !isSelect && !isHighlight 
                      ? this.props.styles.verseTextNotSelectedNotHighlighted
                      : !isSelect && isHighlight
                      ? this.props.styles.verseTextNotSelectedHighlighted
                      : this.props.styles.verseTextSelectedNotHighlighted}
                      >
                {getResultText(this.props.verseData.text)}
              </Text>   
            </Text>
         
        </View>
        </TouchableWithoutFeedback>   
        );
      }
      case Constants.MarkerTypes.PARAGRAPH: {
        if (this.props.verseData.verseNumber == "1" || 
            this.props.verseData.verseNumber.startsWith("1-")) {
              return (
                <Text style={this.props.styles.paragraphText} >
                  {getResultText(this.props.verseData.text)}
                </Text>      
              );
        }
        return (
          <Text style={this.props.styles.paragraphText} >
            {"\n"} {getResultText(this.props.verseData.text)}
          </Text>
        );
      }
      case Constants.MarkerTypes.SECTION_HEADING: {
      }
      case Constants.MarkerTypes.SECTION_HEADING_ONE: {
        return (
          <Text style={this.props.styles.headingOne} >
            {this.props.verseData.text}
          </Text>
        );        
      }
      case Constants.MarkerTypes.SECTION_HEADING_TWO: {
        return (
          <Text style={this.props.styles.headingTwo} >
            {this.props.verseData.text}
          </Text>
        );
      }
      case Constants.MarkerTypes.SECTION_HEADING_THREE: {
        return (
          <Text style={this.props.styles.headingThree} >
            {this.props.verseData.text}
          </Text>
        );
      }
      case Constants.MarkerTypes.SECTION_HEADING_FOUR: {
        return (
          <Text style={this.props.styles.headingFour} >
            {this.props.verseData.text}
          </Text>
        );      
      }
      default: {
        return null;
      }
    }
  }
}