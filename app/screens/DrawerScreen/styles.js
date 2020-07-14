import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
import Color from '../../utils/colorConstants'
const width = Dimensions.get('window').width;

export const styles =(colorFile, sizeFile) =>{
    return StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorFile.backgroundColor 
    },
    headerContainer: {
        height: 150,
    },
    drawerItem:{
        flex:1,
        flexDirection:"row",
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:8,
        paddingVertical:12,
        borderWidth: 0.3,
        borderColor: Color.Gray,
        backgroundColor:colorFile.backgroundColor 
    },
    headerText: {
    // padding:8,
    color: Color.White,
    // textDecorationLine: 'underline',
    // lineHeight:6
    },
    customText:{
    fontSize: 18,
    textAlign: 'center',
    color:Color.Black

    },
    textStyle: {
        color: colorFile.textColor,   
        fontSize:16,
        marginLeft:4,
        alignSelf:'center'
    },
   
    iconStyle:{
        color:colorFile.iconColor
    },
    iconStyleDrawer:{
        paddingRight:16,
        color:colorFile.iconColor
    },
    imageStyle:{width: 64,height: 64,alignSelf:'center',padding:8}
})
}



