import EditableCell from "./EditableCell";
import {Button, Form,Table,Popconfirm,Select,Tabs} from "antd";
import React from "react";



class EditBodyTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            panes:[]
        }
    }


    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== key)
        });
    };

    handleAdd = () => {
        console.log("进入add方法");
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            // name: `Edward King ${count}`,
            parameter: '',
            except: '',
            rule:this.columns.rule,
        };
        console.log("Edit---newData==="+JSON.stringify(newData))
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1
        });
    };

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        console.log("newData=="+JSON.stringify(newData))
        this.setState({ dataSource: newData });
    };



    render() {
        const { panes } = this.state;
        // const components = {
        //     body: {
        //         row: EditableFormRow,
        //         cell: EditableCell
        //     }
        // };
        // const columns = this.columns.map((col) => {
        //     if (!col.editable) {
        //         return col;
        //     }
        //     return {
        //         ...col,
        //         onCell: (record) => ({
        //             record,
        //             editable: col.editable,
        //             dataIndex: col.dataIndex,
        //             title: col.title,
        //             handleSave: this.handleSave
        //         })
        //     };
        // });
        return (
            <div>
                {/*<Button*/}
                    {/*onClick={this.handleAdd}*/}
                    {/*type="primary"*/}
                    {/*style={{ marginBottom: 16 }}*/}
                {/*>*/}
                    {/*Add a row*/}
                {/*</Button>*/}
                {/*<Button onClick={this.props.submit}>确认</Button>*/}
                <Tabs>
                </Tabs>
            </div>
        );
    }
}

export default EditBodyTabs;