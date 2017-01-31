require('css/App.css');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ImgFigure from 'js/ImgFigure';
import ControllerUnit from 'js/ControllerUnit';


//获取图片相关数据
var imageDatas = require('data/data.json');

// 图片名信息转成图片URL路径信息
imageDatas = ((imageDatasArr) => {
    for (let i = 0, len = imageDatasArr.length; i < len; i++) {
        let singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDatas);

/**
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
};

/**
 *  获取0~30之间的一个任意正负值
 */
function get30DegRandom() {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
};

class MainStage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgsArrangeArr: [
                /*{
                    pos: {
                        left: '0',
                        top: '0',
                    }
                    rotate:0   //旋转角度
                    isInverse: false  //图片正反面
                    isCenter: false //图片是否居中
                }*/
            ]
        };
        this.constant = { //存储取值范围
            centerPos: { // 中间值的取值范围
                left: 0,
                right: 0
            },

            hPosRange: { //水平方向的取值范围
                leftsecX: [0, 0],
                rightsecX: [0, 0],
                y: [0, 0]
            },

            vPosRange: { //竖直方向的取值范围
                x: [0, 0],
                topY: [0, 0]
            }
        }
    }

    /**
     * 翻转图片
     * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @return {function}这是一个闭包函数，其内return一个真正待被执行的函数
     */
    inverse(index) {
        return () => {
            const { imgsArrangeArr } = this.state;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        };
    }

    /**
     * 利用rearrange函数，居中对应index的图片
     * @param index 需要被居中的图片对应的图片数组的index值
     * @return {function} 
     */
    center(index) {
        return () => {
            this.rearrange(index);
        };
    }

    /**
     * 重新布局所有图片
     * @param centerIndex 指定居中排布哪个图片
     */
    rearrange(centerIndex) {
        let { imgsArrangeArr } = this.state, 
            { centerPos, hPosRange, vPosRange } = this.constant, 
            { leftsecX: hPosRangeLeftSecX, rightsecX: hPosRangeRightSecX, y: hPosRangeY } = hPosRange, 
            { topY: vPosRangeTopY, x: vPosRangeX } = vPosRange,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
            topImgSpliceIndex = 0, //取出的元素在数组的位置

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //居中centerIndex的图片，居中的centerIndex的图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };

        //居中的图片不需要旋转
        imgsArrangeCenterArr[0].rotate = 0;

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach((value, index) => {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        });

        //布局位于两侧的图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;

            hPosRangeLORX = (i < k ? hPosRangeLeftSecX : hPosRangeRightSecX); //前半部分布局左边，右半部分布局右边

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        };

        //将取出的数组合并
        if (imgsArrangeArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        };

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }

    //组件加载以后，为每张图片计算其位置的范围
    componentDidMount() {
        let stateDom = ReactDOM.findDOMNode(this.refs.state), //首先拿到舞台的大小
            stateW = stateDom.scrollWidth,
            stateH = stateDom.scrollHeight,

            halfStateW = Math.ceil(stateW / 2),
            halfStateH = Math.ceil(stateH / 2);

        let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0), //拿到一个imageFigure的大小
            imgFigureW = imgFigureDom.scrollWidth,
            imgFigureH = imgFigureDom.scrollHeight,

            halfImgW = Math.ceil(imgFigureW / 2),
            halfImgH = Math.ceil(imgFigureH / 2);

        this.constant.centerPos = { //计算中心图片的位置点
            left: halfStateW - halfImgW,
            top: halfStateH - halfImgH
        };

        //左边区域水平位置的范围
        this.constant.hPosRange.leftsecX[0] = -halfImgW;
        this.constant.hPosRange.leftsecX[1] = halfStateW - halfImgW * 3;

        //右边区域水平位置的范围
        this.constant.hPosRange.rightsecX[0] = halfStateW + halfImgW;
        this.constant.hPosRange.rightsecX[1] = stateW - halfImgW;

        //左右区域竖直位置的范围
        this.constant.hPosRange.y[0] = -halfImgH;
        this.constant.hPosRange.y[1] = stateH - halfImgH;

        //中间上区域水平位置的范围
        this.constant.vPosRange.x[0] = halfStateW - imgFigureW;
        this.constant.vPosRange.x[1] = halfStateW;

        //中间上区域竖直位置的范围
        this.constant.vPosRange.topY[0] = -halfImgH;
        this.constant.vPosRange.topY[1] = halfStateH - halfImgH * 3;

        this.rearrange(0);
    }

    render() {
        let ControllerUnits = [],
            ImgFigures = [];

        imageDatas.forEach((value, index) => {
            //初始化图片位置
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,  
                    isInverse: false,
                    isCenter: false
                };
            }
            ImgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
            ControllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
        });

        return (
            <section className="state" ref='state'>
                <section className="img-sec">
                    {ImgFigures}
                </section>
                <nav className="controller-nav">
                    {ControllerUnits}
                </nav>
            </section>
        );
    }
}

export default MainStage;