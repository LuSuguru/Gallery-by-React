import React, { Component } from 'react';

class ControllerUnit extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.arrange.isCenter ? this.props.inverse() : this.props.center();

        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let controllerUnitClassName = "controller-unit";
        const { isCenter, isInverse } = this.props.arrange;

        if (isCenter) { //如果是居中态的图片，显示控制按钮的居中态
            controllerUnitClassName += " is-center";
            if (isInverse) { //如果同时对应的是翻转图片，显示控制按钮的翻转态
                controllerUnitClassName += " is-inverse";
            }
        }
        return ( <span className = { controllerUnitClassName } onClick = { this.handleClick } > </span>
        );
    }
}

export default ControllerUnit;