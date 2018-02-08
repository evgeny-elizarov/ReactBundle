import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ show, type }) => {

        switch (type) {
            case 'rect':
                return <div className="spinner" style={{ display: show ? 'block' : 'none' }}>
                    <div className="rect1"/>
                    <div className="rect2"/>
                    <div className="rect3"/>
                    <div className="rect4"/>
                    <div className="rect5"/>
                </div>;
            default:
                return <div className="sk-fading-circle" style={{ display: show ? 'block' : 'none' }}>
                    <div className="sk-circle1 sk-circle"/>
                    <div className="sk-circle2 sk-circle"/>
                    <div className="sk-circle3 sk-circle"/>
                    <div className="sk-circle4 sk-circle"/>
                    <div className="sk-circle5 sk-circle"/>
                    <div className="sk-circle6 sk-circle"/>
                    <div className="sk-circle7 sk-circle"/>
                    <div className="sk-circle8 sk-circle"/>
                    <div className="sk-circle9 sk-circle"/>
                    <div className="sk-circle10 sk-circle"/>
                    <div className="sk-circle11 sk-circle"/>
                    <div className="sk-circle12 sk-circle"/>
                </div>;
        }
};
export default LoadingSpinner;
