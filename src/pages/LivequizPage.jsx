import React from 'react'
import LiveQuiz from '../components/LiveQuiz';
import Nav2 from '../components/Nav2';
import Footer from '../components/Footer';
import WebSocketTest from "../components/WebSocketTest";



const LivequizPage = () => {
  return (
    <div>
       <Nav2 />
       <WebSocketTest />
      <LiveQuiz />
      <Footer />
    </div>
  )
}

export default LivequizPage



