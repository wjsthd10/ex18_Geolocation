import React,{Component} from 'react';
import {View, StyleSheet, Text, Button, Alert, PermissionsAndroid} from 'react-native';

// Geolocation-service 라이브러리 적용
import Geolocation from 'react-native-geolocation-service';

export default class Main extends Component{

    
        state={
            currPos:{latitude:0.0, longitude:0.0},            
        }
    


    render(){
        return(
            <View style={styles.root}>
                <Button title='get my location' onPress={()=>{this.clickBtn()}}></Button>

                <View style={styles.buttonView}>
                    <Button title="watch my location : update" color="green" onPress={()=>{this.clickBtn2}}></Button>
                    <Button title="stop my location" color="red" onPress={()=>{this.clickBtn3}}></Button>
                </View>

                <View style={styles.textView}>
                    <Text style={styles.text}>latitude : {this.state.currPos.latitude}</Text>
                    <Text style={styles.text}>longitude : {this.state.currPos.longitude}</Text>
                </View>

                
                
            </View>
        )
    }
    clickBtn=()=>{
        
        Geolocation.getCurrentPosition(
            (position)=>{// 객체가 latitude와 longitude를 갖고있다.
                this.setState({currPos:position.coords})
            },
            (error)=>{
                console.log(error.code, error.message);
                // Alert.alert('error : '+error.message.toString);
            })
    }

    clickBtn2=()=>{
        const id=Geolocation.watchPosition(position=>this.setState({currPos:position.coords}), error=>console.log(error.message.toString));
        // 변수명과 프로퍼티명이 같으면 생략가능 => ({id})
        this.setState({id:id});
    }

    clickBtn3=()=>{
        Geolocation.clearWatch(this.state.id);
    }

    // 동적퍼미션 작업...
    async requestLocationPermission(){
        try{
            // 퍼미션을 요청하는 다이얼로그 보이도록 요청
            const granted=await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            if(granted==PermissionsAndroid.RESULTS.GRANTED){
                // alert('you can use the location');
            }else{
                alert('location permission denied');
            }

        }catch(error){
            console.warn(error);
        }
    }
    // 이 컴포넌트가 처음 화면에 보여질때 자동으로 실행되는 라이프사이클 메소드
    componentDidMount(){
        this.requestLocationPermission();
    }

    // 화면이 안보이면 중지
    componentWillUnmount(){

        // if(this.state.id != undefined){
        if(this.state.id){// c를 기반으로 하기때문에 0과 felse만 아니면 모두 참이다.
            Geolocation.clearWatch(this.state.id);
        }
        
    }


}// Main Class

const styles=StyleSheet.create({
    root:{
        flex:1,
        padding:16,
        backgroundColor:'#44552266'
    },
    textView:{
        backgroundColor:'#55886611',
        flex:1,
        marginTop:10,
        alignItems:"center",
        justifyContent:"center"
    },
    text:{
        fontSize:20,
        fontWeight:"bold",
        padding:8
    },
    buttonView:{
        flexDirection:"row",
        justifyContent:'space-between',
        marginTop:16
    }
})