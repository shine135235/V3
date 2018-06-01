import React,{Component} from 'react';

export default class ChildArea extends Component{
    constructor(props){
        super(props)
        this.state={
            editLoading: false,
            htmlContent: `<p style="text-align:center;">\n\t<strong><u><span style="background-color:#E53333;">的撒多撒的撒多撒</span></u></strong><strong><u><span style="background-color:#E53333;">的撒多撒</span></u></strong><strong><u><span style="background-color:#E53333;">的撒多撒</span></u></strong><strong><u><span style="background-color:#E53333;">的撒多撒</span></u></strong>\n</p>\n<p style="text-align:center;">\n\t<strong><u><span style="background-color:#E53333;"><img src="http://101.200.173.227:9092/resource/20180526/11.jpeg" alt="" /><br />\n</span></u></strong>\n</p>\n<h1 style="textAlign:left;">\n\t<strong><u><span style="backgroundColor:#E53333;">的撒啊啊啊啊啊啊啊啊啊啊啊啊啊<span style={{backgroundColor:#B8D100"}}>嘟嘟嘟嘀嘀多多多多多多多</span></span></u></strong>\n</h1>`,
  markdownContent: "## HEAD 2 \n markdown examples \n ``` welcome ```",
  responseList: []

        }
    }
    receiveRaw(content) {
        console.log("recieved Raw content", content);
      }
    render(){
        
        return (
                <div className='data-class-over'>
                </div>
        )
    }
}