import React, { Component } from 'react';

class ControllerUnit extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        //如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
        this.props.arrange.isCenter ? this.props.inverse() : this.props.center();

        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let controllerUnitClassName = "controller-unit";

        //如果是居中态的图片，显示控制按钮的居中态
        if (this.props.arrange.isCenter) {
            controllerUnitClassName += " is-center";

            //如果同时对应的是翻转图片，显示控制按钮的翻转态
            if (this.props.arrange.isInverse) {
                controllerUnitClassName += " is-inverse";
            }
        }
        return ( <span className = { controllerUnitClassName } onClick = { this.handleClick } ></span>
        );
    }
}

export default ControllerUnit;