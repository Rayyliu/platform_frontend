import React from 'react'
import Background from "../../components/Background";

class Home extends React.Component {
    render() {
        return (
            <div >
                <img style={{height:'80vh',width:'100%'}} src={require('../../assets/images/bg.jpg')} alt="" />
            </div>
        )
    }
}

export default Home
