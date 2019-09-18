import {StyleSheet} from 'react-native'

export const styles =(colorFile, sizeFile) =>{
    return StyleSheet.create({
    MainContainer :{
    flex:1,
    backgroundColor:colorFile.backgroundColor
    },
    container:{
        // margin:8,
        backgroundColor:colorFile.backgroundColor
    },
    rowViewContainer: {
      fontSize: 17,
      padding: 4
     },
    
     TextInputStyleClass:{
      position:'absolute',
      top:0,
      textAlign: 'center',
      height: 40,

      borderWidth: 1,
      borderColor: '#009688',
      borderRadius: 7 ,
      backgroundColor : "#FFFFFF"
           
      },
   
   
      header: {
        flexDirection:"row",
        padding: 6,
        paddingHorizontal:10,
        justifyContent:'space-between',
        backgroundColor:colorFile.backgroundColor
      },
      headerText: {
        fontSize: 16,
        color:colorFile.textColor
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
        color: colorFile.textColor,
        // paddingLeft:10
      },
      content: {
        paddingHorizontal:20,
        paddingVertical:10,
        // paddingLeft: 20,
        // paddingRight: 20,
        flexDirection:"row",
        justifyContent:'space-between',
        backgroundColor:colorFile.backgroundColor
      },
   })
}