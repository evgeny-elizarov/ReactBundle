import React from 'react';
import Button from "@AndevisReactBundle/UI/Components/Button/Button";
import ExampleBaseView from "@AndevisReactBundle/UI/Views/ExampleBaseView";

export default class ExampleComponentsArray extends ExampleBaseView {

    getBundleName(){
        return 'React';
    }

    getInitialState(){
        return {
            clickData: null,
            clickBackendData: null,
            items: [
                { id: 1, name: "test1"},
                { id: 2, name: "test2"},
                { id: 3, name: "test3"}
            ]
        }
    }

    btnEdit_onClick(btn){
        this.setState({
            clickData: this.state.items[btn.getIndex()]
        });
        // console.log("bntEdit_onClick", btn, btn.index);
    }

    render(){
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Components array</h1>
                </div>
                <p>
                    Clicked on backend: {JSON.stringify(this.state.clickData)}
                </p>
                <p>
                    Clicked data on backend: {JSON.stringify(this.state.clickBackendData)}
                </p>

                <table className="table">
                    <tbody>
                    {this.state.items.map((item, i) => (
                        <tr key={i}>
                            <td>{i}</td>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>
                                <Button name="btnEdit" index={i}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>
        )
    }
}