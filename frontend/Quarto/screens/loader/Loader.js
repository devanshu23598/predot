import React from 'react';
import {View,Text} from 'react-native'
const Loader=(props)=>{
    if(props.loader === true){
        return(
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', }}>
                <View style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 0.15, flexDirection: 'column',  justifyContent: 'flex-start' }}>
                        <View style={{ flex: 0.5, flexDirection: 'row',justifyContent: 'center' }}>
                            <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'space-around' }}>
                                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgb(237,56,0)', alignSelf: 'center', }}></View>

                            </View>
                            <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'space-around' }}>
                                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgb(253,199,31)', alignSelf: 'center', }}></View>

                            </View>

                        </View>
                        <View style={{ flex: 0.5, flexDirection: 'row' }}>
                            <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'space-around' }}>
                                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgb(246,105,0)', alignSelf: 'center', }}></View>

                            </View>
                            <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'space-around' }}>
                                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgb(14,130,167)', alignSelf: 'center', }}></View>

                            </View>
                        </View>

                    </View>
                </View>
            </View>
        );
    }
    else{
        return(
            <View></View>
        );
    }
}

export default Loader;