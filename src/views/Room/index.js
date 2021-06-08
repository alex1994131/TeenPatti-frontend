import React from "react"
import { connect } from 'react-redux'
import { LogOut, Plus, Send } from "react-feather"
import { toast } from "react-toastify"
import { JoinRoom } from "../../redux/actions/Home"
import config from "../../configs/config"
import { history } from "../../history"
import { Images } from "../../constants"
const Currency =  'INR'

class Room extends React.Component{
  constructor(props) {
    super(props)
    let prevRoomData = props.location.state?props.location.state:{}
    this.state = {
      amount:prevRoomData.bootAmount,
      myData:{},
      playersData:[],
      roomData:prevRoomData,
      chat:'',
      chatList:[],
      time:0,
      interval:null,
      playerCount:0,
      dealerPosition:-1,
      isOver:false
    }
  }
  
  async componentDidMount(){
    if(this.state.roomData){
      let playersData = Array.from({length: this.state.roomData.maxPlayer}, (v, i) => null)
      this.setState({playersData})
      await this.enterRoom(this.props.userinfo)
    }else{
      history.push('/')
    }

    config.socket.emit('Getchat', {room:this.state.roomData._id})
    config.socket.on('Getchat', (chat)=>{this.setState({chatList:chat})})
    config.socket.on('chat', (chat)=>{
      toast.info(`${chat.name}: ${chat.content}`);
      this.setState(prevState=>({chatList:[...prevState.chatList, chat]}))
    })
  }
  
  async componentDidUpdate(prevPorps, prevState){
    const { playersData, roomData, myData, userinfo } = this.props
    if(userinfo !== prevPorps.userinfo){
      await this.enterRoom(userinfo)
    }
    if(myData !== prevPorps.myData&&Object.keys(myData).length){
      await this.myData(myData)
    }
    if(roomData !== prevPorps.roomData&&Object.keys(roomData).length){
      await this.roomData(roomData)
    }
    if(playersData !== prevPorps.playersData&&playersData.length){
      await this.initRoom(playersData)
    }
    if(prevState.chatList !== this.state.chatList){
      this.scrollToBottom();
    }
  }

  async roomData(roomData){
    await this.setState({roomData})
    if(roomData.channel!==this.state.amount){
      this.setState({amount:roomData.channel})
    }
  }

  async myData(myData){
    await this.setState({myData})
    if(myData){
      if(myData.currentPlayer){
        if(!this.state.interval){
          this.timer()
        }
      }else{
        clearInterval(this.state.interval)
        this.setState({interval:null})
      }
    }
  }

  async enterRoom(userinfo){
    let player = userinfo._id
    let room = this.state.roomData._id
    config.socket.emit("getMyRoom", {room, player})
    config.socket.emit("EnterRoom", {room, player})
  }

  async initRoom(players){
    if(this.state.roomData){
      let maxPlayer = this.state.roomData.maxPlayer
      let playersData = []
      let playerCount = 0
      for (let i = 0; i < maxPlayer; i++) {
        let playerData = players.find(e => e.position === i)
        if(playerData){
          playersData.push(playerData)
          playerCount ++
        }else{
          playersData.push(null)
        }
      }
      this.setState({playerCount, playersData})
      const playerS = [...playersData, ...playersData]
      let dealerPosition = playerS.map(el => el?el.dealer:false).lastIndexOf(true)
      for (let index = dealerPosition-1; index>= 0; index--){
        if(playerS[index] === null){
          dealerPosition--
        }else{
          if(dealerPosition>=maxPlayer){
            dealerPosition = dealerPosition-maxPlayer
          }
          this.setState({dealerPosition:dealerPosition})
          return
        }
      }
    }
  }

  async scrollToBottom (){
    let chatElement = document.querySelector(".chat-view-wrapper")
    chatElement.scrollTop = chatElement.scrollHeight
  }

  timer(){
    let lastTime = this.state.myData.lastTime
    let newTime = this.props.newTime
    let time  = (new Date(lastTime).valueOf() + this.state.roomData.userFTimeout - new Date(newTime).valueOf())/1000
    let i = 1
    if(!this.state.interval){
      let interval = setInterval(async ()=>{
        if (i>= time) {
          this.pack()
        }i++
      }, 1000)
      this.setState({interval})
    }
  }

  JoinRoom(key){
    if(this.state.myData.chips<10*this.state.roomData.bootAmount){
      toast.error('Not enough chips.')
    }else{
      this.props.JoinRoom(this.state.roomData, key)
    }
  }

  bet(){
    clearInterval(this.state.interval)
    this.setState({interval:null})
    let room = this.state.roomData._id
    let player = this.props.userinfo._id
    let amount = this.state.myData.see?this.state.amount*2:this.state.amount
    config.socket.emit('bet', {room, player, amount})
  }
  
  pack(){
    clearInterval(this.state.interval)
    this.setState({interval:null})
    let room = this.state.roomData._id
    let player = this.props.userinfo._id
    config.socket.emit('pack', {room, player})
  }

  Show(){
    clearInterval(this.state.interval)
    this.setState({interval:null})
    let room = this.state.roomData._id
    let player = this.props.userinfo._id
    config.socket.emit('show', {room, player})
  }

  exitRoom(){
    history.push('/')
    this.setState({chatActive:false})
    let room = this.state.roomData._id
    let player = this.props.userinfo._id
    config.socket.emit('exitRoom', {room, player})
  }
  
  sendChat(){
    let data = {
      room:this.state.roomData._id, 
      content:this.state.chat,
      player:this.props.userinfo._id,
      name:this.props.userinfo.name,
    }
    config.socket.emit('chat',data)
    this.setState(prevState=>({
      chatList:[...prevState.chatList, data],
      chat:''
    }))
  }

  keyPress(e){
    if(e.keyCode === 13){this.sendChat()}
  }
  
  See(){
    let room = this.state.roomData._id
    let player = this.props.userinfo._id
    config.socket.emit('see',{room, player})
  }

  betAmountChange(e){
    const {channel} = this.state.roomData
    if(e){
      this.setState({amount:channel*2})
    }else{
      this.setState({amount:channel})
    }
  }

  cardRender(){
    return this.state.playersData.map((data,key)=>{
      let index = key+1
      if(data){
        if(data.cards&&data.cards.length){
          if(this.state.roomData.finished){
            return (
              <div key={key} className={`sg-poker-table-seat player-${index}`}>
                <div className="player-mini-container-p poker">
                  <div className="player-info-line">
                    {data.winner&&<i className={`type-p-wsbp v-${data.player._id===this.props.userinfo._id?'y':'w'}`}>W</i>}
                    <div className="avatar-view-p default using_reserve_time"></div>
                    <div className="player-name-count-v">
                      <div className="player-text-info-p">
                        {data.player._id!==this.props.userinfo._id&&<p>{data.player.name}</p>}
                        <span><b>{data.chips} {Currency}</b></span>
                      </div>
                    </div>
                  </div>
                  <div className="carts-container-p">
                    {data.cards.map((card, i)=>(
                      <div key={i} className='sg-card'>
                        <div className={`single-cart-view-p v-3-cards icon-layer2_${card}`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          }
          else if(data.player._id===this.props.userinfo._id){
            return(
              <div key={key} className={`sg-poker-table-seat player-${index}`}>
                <div className="player-mini-container-p poker">
                  <div className="player-info-line">
                    <i className="type-p-wsbp v-y">Y</i>
                    {data.currentPlayer&&<div className="time-line-animation-v" style={{width: '90%'}}>
                      <span style={{animationDuration: ((new Date(data.lastTime).valueOf() + this.state.roomData.userFTimeout - new Date(this.props.newTime).valueOf())/1000+'s')}} />
                    </div>}
                    <div className="avatar-view-p default using_reserve_time">
                      <svg viewBox="0 0 100 100" className="timer_wrapper">
                        <circle r="48%" cx="50" cy="50" strokeWidth="4%" fill="transparent" className="bar_time"></circle>
                        <circle r="48%" cx="50" cy="50" fill="transparent" strokeWidth="4%" className="bar_left_time" strokeDasharray="301.592" strokeDashoffset="301.592"></circle>
                        <circle r="35%" cx="50" cy="50" fill="transparent" strokeWidth="17%" className="bar_left_time_inner" strokeDasharray="219.911" strokeDashoffset="219.911"></circle>
                      </svg>
                      <div className="time_left"> 0 </div>
                    </div>
                    <div className="player-name-count-v">
                      <div className="player-text-info-p">
                        <span><b>{data.chips} {Currency}</b></span>
                      </div>
                    </div>
                  </div>
                  <div className="carts-container-p">
                    {data.cards.map((card, i)=>(
                      <div key={i} className='sg-card'>
                        <div className={`single-cart-view-p ${data.see?'v-3-cards icon-layer2_'+card:'back-v-1'}`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          }else{
            return (
              <div key={key} className={`sg-poker-table-seat player-${index}`}>
                <div className="player-mini-container-p poker">
                  <div className="player-info-line">
                    {data.pack?<i className="type-p-wsbp v-p">P</i>:(data.see?<i className="type-p-wsbp v-s">S</i>:<i className="type-p-wsbp v-b">B</i>)}
                    {data.currentPlayer&&<div className="time-line-animation-v" style={{width: '90%'}}>
                      <span style={{animationDuration: ((new Date(data.lastTime).valueOf() + this.state.roomData.userFTimeout - new Date(this.props.newTime).valueOf())/1000+'s')}} />
                    </div>}
                    <div className="avatar-view-p default using_reserve_time">
                      <svg viewBox="0 0 100 100" className="timer_wrapper">
                        <circle r="48%" cx="50" cy="50" strokeWidth="4%" fill="transparent" className="bar_time"></circle>
                        <circle r="48%" cx="50" cy="50" fill="transparent" strokeWidth="4%" className="bar_left_time" strokeDasharray="301.592" strokeDashoffset="301.592"></circle>
                        <circle r="35%" cx="50" cy="50" fill="transparent" strokeWidth="17%" className="bar_left_time_inner" strokeDasharray="219.911" strokeDashoffset="219.911"></circle>
                      </svg>
                      <div className="time_left"> 0 </div>
                    </div>
                    <div className="player-name-count-v">
                      <div className="player-text-info-p">
                        <p>{data.player.name}</p>
                        <span><b>{data.chips} {Currency}</b></span>
                      </div>
                    </div>
                  </div>
                  <div className="carts-container-p">
                    {data.cards.map((card, i)=>( <div key={i} className='sg-card'><div className="single-cart-view-p back-v-1"></div></div>))}
                  </div>
                </div>
              </div>
            )
          }
        }else{
          return (
            <div key={key} className={`sg-poker-table-seat player-${index}`}>
              <div className="player-mini-container-p poker">
                <div className="player-info-line">
                  <div className="avatar-view-p default using_reserve_time"></div>
                  <div className="player-name-count-v">
                    <div className="player-text-info-p">
                      {data.player._id!==this.props.userinfo._id&&<p>{data.player.name}</p>}
                      <span><b>{data.chips} {Currency}</b></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      }else{
        return <div key={key} className={`sg-poker-table-seat player-${index}`}>
          <div className="empty-p-view-b" onClick={()=>this.JoinRoom(key)}><Plus/></div>
        </div>
      }
    }) 
  }

  render(){
    const { amount, myData, playersData, roomData, playerCount, dealerPosition, chatList } = this.state
    return(
      <React.Fragment>
        <teenpatti-wrapper>
          <teenpatti-container>
            <teenpatti-header>
              {/* <div className='teepatti-logo'></div> */}
              <div className="user-menu-p-wrapper">
                <div onClick={()=>this.exitRoom()} className="user-menu-icon-p" title='Room exit'><LogOut/></div>
                <div className="user-menu-icon-p ">
                  <span className="balance-p-view tm"> Name: {this.props.userinfo&&this.props.userinfo.name} </span>
                </div>
                <div className="user-menu-icon-p ">
                  <span className="balance-p-view"> {this.props.userinfo&&this.props.userinfo.chips} {Currency} </span>
                </div>
              </div>
            </teenpatti-header>
            <teenpatti-table>
              <div className="teenpatti-table-wrapper">
                <div className="table-header-v-left">
                  <p><span>Current hand ID: </span><i>{roomData._id}</i></p><p></p>
                </div>
                <div className="table-header-v-right"></div>
                <teenpatti-board className="table-vertical-v-p">
                  <div className="table-view-background">
                    <div className="table-view-container">
                      <img src={Images.transparent} alt='' />
                      <div className="mini-t-wrapper-p">
                        <div style={{background:`url(${Images.circle}) no-repeat 50% 50%`}} className={`full-table-w-p player-count-${playersData.length}`}>
                          {playersData&&this.cardRender()}
                          {dealerPosition>-1&&<div className={`dealer-icon-view animate position-${dealerPosition}`}><span>D</span></div>}
                          <div className="game-cards-view-d">
                            <div className="pot-w-view-p">
                              <span>Pot: <b>{roomData?roomData.allPot:0} {Currency}</b></span>
                            </div>
                          </div>
                        </div>
                        <div style={{background:`url(${Images.table_pattern}) no-repeat 50% 50%`}} className="t-color-view-p color-v-1" />
                      </div>
                    </div>
                  </div>
                </teenpatti-board>
                <div className="footer-component-v">
                  <div className="table-footer-v">
                    <div className="f-left-column-p">
                      <div className="chat-view-checkbox-w"></div>
                      <div className="mini-tabs-wrapper">
                        <ul>
                          <li className="active"> Chat </li>
                        </ul>
                      </div>
                      <div className="mini-tab-info-container">
                        <sg-chat-widget>
                          <div className="chat-view-wrapper">
                            {chatList&&chatList.length?chatList.map((item, key)=>(
                              <p key={key} className='m-0'> 
                                <span className="player-1-color-t dealer-color-t"> {item.name}:</span> {item.content}
                              </p>
                            )):null}
                          </div>
                          <div  className="chat-form-contain">
                            <input 
                              type="text" 
                              placeholder="Enter message here" 
                              maxLength={50} 
                              value={this.state.chat} 
                              onKeyDown={(e)=>this.keyPress(e)} 
                              onChange={(e)=>this.setState({chat:e.target.value})} 
                            />
                            <button className="enter-chat-text-b"/>
                            <Send onClick={()=>this.sendChat()}/>
                          </div>
                        </sg-chat-widget>
                      </div>
                    </div>
                    <div className="f-right-column-p action-ch-view">
                      {roomData.finished||!myData.currentPlayer?
                        <button className="button-p-view disabled"> PACK </button>:
                        <button onClick={()=>this.pack()} className="button-p-view trans-view-b"> PACK </button>
                      }
                      {roomData.finished||!myData.currentPlayer?
                        <button className="button-p-view disabled"> - </button>:
                        <button onClick={()=>this.betAmountChange(false)} className="button-p-view trans-view-b"> - </button>
                      }
                      {roomData.finished||!myData.currentPlayer?
                        <button className="button-p-view disabled"> {myData&&myData.see?<p>BET {amount*2}</p>:<p>BLAIND {amount}</p>} </button>:
                        <button onClick={()=>this.bet()} className="button-p-view trans-view-b"> {myData&&myData.see?<p>BET {amount*2}</p>:<p>BLAIND {amount}</p>} </button>
                      }
                      {roomData.finished||!myData.currentPlayer?
                        <button className="button-p-view disabled"> + </button>:
                        <button onClick={()=>this.betAmountChange(true)} className="button-p-view trans-view-b"> + </button>
                      }
                      {!roomData.finished&&myData.currentPlayer&&roomData&&roomData.see?
                        <button id='btnsss' onClick={()=>this.pack()} className="button-p-view trans-view-b"> {(playerCount>2?'SIDE ':'')+'SHOW'} </button>:
                        <button id='btnsss' className="button-p-view disabled"> {(playerCount>2?'SIDE ':'')+'SHOW'} </button>
                      }
                      {roomData.finished||myData.see?
                        <button className="button-p-view disabled"> SEE </button>:
                        <button onClick={()=>this.See()} className="button-p-view trans-view-b"> SEE </button>
                      }
                      <div className="wait-p-list">
                        <ul className='f-wspb'>
                          <li><i className="type-p-v v-w">W</i><span>WON</span></li>
                          <li><i className="type-p-v v-s">S</i><span>SEEN</span></li>
                          <li><i className="type-p-v v-b">B</i><span>BLAIND</span></li>
                          <li><i className="type-p-v v-p">P</i><span>PACKED</span></li>
                          <li><i className="type-p-v v-y">Y</i><span>YOU</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </teenpatti-table>
          </teenpatti-container>
        </teenpatti-wrapper>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  userinfo:state.auth.userinfo,
  myData:state.documents.myData,
  roomData:state.documents.roomData,
  playersData:state.documents.playersData,
  newTime:state.documents.newTime,
})
const mapDispatchToProps = { JoinRoom }
export default connect(mapStateToProps, mapDispatchToProps)(Room)