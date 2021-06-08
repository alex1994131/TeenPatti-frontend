import React from "react"
import { connect } from 'react-redux'
import { Check, ChevronDown, Database, Layers, LogOut, Plus, RefreshCw, User, Users } from "react-feather"
import { CountUp } from 'use-count-up'
import { history } from "../../history"
import config from "../../configs/config"
import { JoinRoom } from "../../redux/actions/Home"
import { signOut, socket_connect } from "../../redux/actions/auth"
import { revenue } from "../../redux/actions/root"
import { toast } from "react-toastify"
const Currency =  'INR'

class Home extends React.Component{

  constructor(props) {
    super(props)
  
    this.state = {
      documentsData:null,
      activeRoom:null,
      playersData:[],
      active:null,
      
      Type:[],
      Player:[],
      Bland:[],
      GamesType:[],
      maxPlayer:[],
      maxBlind:[],
    }
  }

  componentDidMount(){
    config.socket.emit("GetRooms")
    config.socket.emit("GetFilter")
    config.socket.on("GetFilter", ({roomType, maxPlayer, maxBlind})=>{
      let GamesType = [], GamesPlayer = [], GamesBland = []
      roomType.sort((a, b) => {return a._id - b._id})
      maxPlayer.sort((a, b) => {return a._id - b._id})
      maxBlind.sort((a, b) => {return a._id - b._id})
      for (const key in roomType) {
        GamesType.push({value:roomType[key]._id, label:roomType[key]._id.toString()})
      }
      for (const key in maxPlayer) {
        GamesPlayer.push({value:maxPlayer[key]._id, label:maxPlayer[key]._id.toString()})
      }
      for (const key in maxBlind) {
        GamesBland.push({value:maxBlind[key]._id, label:maxBlind[key]._id.toString()})
      }
      this.setState({GamesType, GamesPlayer, GamesBland, Type:GamesType, Player:GamesPlayer, Bland:GamesBland})
    })
    config.socket.on("user_change", async()=>{
      config.socket.emit("GetRooms")
    })
  }

  refresh(){
    config.socket.emit("GetRooms")
  }

  componentDidUpdate(prevProps, prevState){
    const { playersData, documentsData } = this.props
    if(documentsData !== prevProps.documentsData&&documentsData.length){
      this.setState({
        documentsData:documentsData,
        activeRoom:documentsData[0]
      })
    }
    if(playersData !== prevProps.playersData&&playersData.length){
      this.initRoom(playersData)
    }
    if(this.state.activeRoom !== prevState.activeRoom && this.state.activeRoom){
      let playersData = Array.from({length: this.state.activeRoom.maxPlayer}, (v, i) => null)
      this.setState({playersData})
      this.enterRoom(this.props.userinfo)
    }
  }
  
  initRoom(players){
    if(this.state.activeRoom){
      let maxPlayer = this.state.activeRoom.maxPlayer
      let playersData = []
      for (let i = 0; i < maxPlayer; i++) {
        let playerData = players.find(e => e.position === i)
        if(playerData){
          playersData.push(playerData)
        }else{
          playersData.push(null)
        }
      }
      this.setState({playersData})
    }
  }

  enterRoom(userinfo){
    if (userinfo.chips >= this.state.activeRoom.bootAmount * 10 && this.state.activeRoom) {
      config.socket.emit("getMyRoom", {player:userinfo._id, room:this.state.activeRoom._id})
    }
  }

  onSelectPicker(e){
    if(this.state.active===e){
      this.setState({active:null})
    }else{
      this.setState({active:e})
    }
  }
  
  onSelectValueChange(item, label){
    const array = this.state['Games'+label]
    if(item.value==='All'){
      if(array.length===this.state[label].length){
        this.setState({[label]:[]})
      }else{
        this.setState({[label]:[...array]})
      }
    }else{
      let data = this.state[label]
      let isData = data.find(e=>e.value===item.value)
      if(isData){
        data = data.filter(e=>e.value!==item.value)
        if(data.length===0){
          this.setState({[label]:[]})
        }else{
          this.setState({[label]:data})
        }
        return
      }else{
        this.setState({[label]:[...data, item]})
      }
    }
  }

  JoinRoom(key){
    if(this.props.userinfo.chips<10*this.state.activeRoom.bootAmount){
      toast.error('Not enough chips.')
    }else{
      history.push('/Room', this.state.activeRoom)
      this.props.JoinRoom(this.state.activeRoom, key)
    }
  }

  Join(){
    if (this.props.userinfo.chips >= this.state.activeRoom.bootAmount * 10) {
      history.push('/Room', this.state.activeRoom)
    }
  }

  AcitveRoom(e){
    this.setState({activeRoom:e})
    if(window.innerWidth<=768){this.Join()}
  }

  render(){
    const { documentsData, playersData, active, activeRoom } = this.state
    return(
      <teenpatti-wrapper>
        <revenue-container>
          {revenue.map((item, key)=>(
            <revenue-item key={key}>
              <revenue-preview>
                <revenue-name>
                  <div className={`icon icon-${key}`}></div><div className="name">{item.name}</div>
                </revenue-name>
                <revenue-counter>
                  <CountUp isCounting end={item.number} suffix={` ${Currency}`}/>
                </revenue-counter>
              </revenue-preview>
              <revenue-view>
                <div className='section'>
                  <h5 className="title">Winners and Total</h5>
                  <p className="text">
                    <User className='icon'/> 235
                  </p>
                  <p className="text">69 805.77 {Currency}</p>
                </div>
                <div className='section'>
                  <div className='container'>
                    <h5 className="title">Largest Winner</h5>
                    <p className="text">766.62 {Currency}</p>
                    <p className="b-text">Belote</p>
                    <span className="sm-text">
                      <i>12979087693</i><b>Dec 23, 2019 </b>
                    </span>
                  </div>
                  <div className='container'>
                    <h5 className="title">Latest Winner</h5>
                      <p className="text">256.28 {Currency}</p>
                      <p className="b-text">Poker</p>
                      <span className="sm-text">
                        <i>12979087693</i><b>Dec 13, 2020</b>
                      </span>
                  </div>
                </div>
              </revenue-view>
            </revenue-item>
          ))}
        </revenue-container>
        <teenpatti-container>
          <teenpatti-header>
            {/* <div className='teepatti-logo'></div> */}
            <div className="user-menu-p-wrapper">
              <div onClick={()=>this.props.signOut()} className="user-menu-icon-p" title='LogOut'><LogOut/></div>
              <div className="user-menu-icon-p ">
                <span className="balance-p-view tm"> Name: {this.props.userinfo&&this.props.userinfo.username} </span>
              </div>
              <div className="user-menu-icon-p ">
                <span className="balance-p-view"> {this.props.userinfo&&this.props.userinfo.chips} {Currency} </span>
              </div>
            </div>
          </teenpatti-header>
          <teenpatti-body>
            <lobby-wrapper>
              <div className='left-column-l-p'>
                <div className='lobby-filter-p'>
                  <div className='lobby-top-row-p'>
                    <category-filters>
                      <div className="dropdown-f-container">
                        <ul>
                          <li>
                            <Dropdown
                              index = {1}
                              label={'Type'} 
                              icon={<Layers className='icon'/>}
                              value = {this.state.Type}
                              array = {this.state.GamesType}
                              active = {active}
                              onSelectPicker={(e)=>this.onSelectPicker(e)}
                              valueChange={(a, b)=>this.onSelectValueChange(a, b)}
                            />
                          </li>
                          <li>
                            <Dropdown
                              index = {2}
                              label={'Player'} 
                              icon={<Users className='icon'/>}
                              value = {this.state.Player}
                              array = {this.state.GamesPlayer}
                              active = {active}
                              onSelectPicker={(e)=>this.onSelectPicker(e)}
                              valueChange={(a, b)=>this.onSelectValueChange(a, b)}
                            />
                          </li>
                          <li>
                            <Dropdown
                              index = {3}
                              label={'Bland'} 
                              icon={<Database className='icon'/>}
                              value = {this.state.Bland}
                              array={this.state.GamesBland}
                              active = {active}
                              onSelectPicker={(e)=>this.onSelectPicker(e)}
                              valueChange={(a, b)=>this.onSelectValueChange(a, b)}
                            />
                          </li>
                        </ul>
                      </div>
                      <div onClick={()=>this.refresh()} className="refresh-icon-p"><RefreshCw/></div>
                    </category-filters>
                  </div>
                  <div className="tables-list-component-v">
                    <div className="lobby-p-list-items-rows">
                      <div className="title-filter-row-view">
                        <ul>
                          <li><span> Name </span></li>
                          <li><span> Game </span></li>
                          <li><span> Type </span></li>
                          <li><span> MaxBlind </span></li>
                          <li><span> BootAmt </span></li>
                          <li><span> Players </span></li>
                        </ul>
                      </div>
                      <div className='table-body'>
                        {documentsData&&documentsData.length&&documentsData.map((item, key)=>(
                          <RoomItem 
                            key={key} 
                            item={item} 
                            state={this.state} 
                            Active={(e)=>this.AcitveRoom(e)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='right-column-l-p'>
                <div className="title-container-g-h">
                  <h2>{activeRoom&&activeRoom.roomName}</h2>
                  <p>{activeRoom&&activeRoom.roomType}</p>
                </div>
                <div className="lobby-right-c">
                  <div className="right-b-column">
                    <div className="right-b-p">
                      <div className="right-b-info-box">
                        <div className="single-game-info-p">
                          <div className="single-game-column-p">
                            <table-details className="table-details-component-mini">
                              <div className="p-table-mini">
                                <div className="table-info-view-contain-p">
                                  <div className="table-info-view-p">
                                    <p>MAX BLAND {activeRoom&&activeRoom.maxBlind}</p>
                                    <span>BOOT AMOUNT {activeRoom&&activeRoom.bootAmount}</span>
                                  </div>
                                </div>
                                <div className="t-seat-count-container">
                                  {playersData&&playersData.length&&playersData.map((item, key)=>(
                                    <div key={key} className="single-t-seat-view">
                                      {
                                        item?
                                        <div className="gamer-view-p">
                                          <div className="user-info-box-p">
                                            <div className="gamer-info-view-p">
                                              <p>{item.player.username}</p>
                                              <span>{item.player.chips}</span>
                                            </div>
                                          </div>
                                        </div>:
                                        <div className="add-circle-v" onClick={()=>this.JoinRoom(key)}><Plus/></div>
                                      }
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </table-details>
                            <div className="join-open-buttons-view-p">
                              {/* <div className="button-container-p">
                                <button className="button-p-view" onClick={()=>{
                                  if (this.props.userinfo.chips >= activeRoom.bootAmount * 10) {
                                    history.push('/Room', activeRoom)
                                  }}}> Join </button>
                              </div> */}
                              <div className="button-container-p trans-view-b">
                                <button className="button-p-view trans-view-b" onClick={()=>this.Join()}> Join </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </lobby-wrapper>
            <footer-wrapper>
              <ul className="f-left-container-p">
                <li>
                  <i className="type-p-v v-2">2</i>
                  <span>2 Max</span>
                </li>
                <li>
                  <i className="type-p-v v-3">3</i>
                  <span>3 Max</span>
                </li>
                <li>
                  <i className="type-p-v v-4">4</i>
                  <span>4 Max</span>
                </li>
                <li>
                  <i className="type-p-v v-5">5</i>
                  <span>5 Max</span>
                </li>
                <li>
                  <i className="type-p-v v-6">6</i>
                  <span>6 Max</span>
                </li>
                <li>
                  <i className="type-p-v v-8">8</i>
                  <span>8 Max</span>
                </li>
                <li>
                  <i className="type-p-v v-9">9</i>
                  <span>9 Max</span>
                </li>
              </ul>
            </footer-wrapper>
          </teenpatti-body>
        </teenpatti-container>
      </teenpatti-wrapper>
    )
  }
}

const Dropdown = ({index, label, icon=false, value, array, active, onSelectPicker, valueChange}) =>{
  return(
    <div className="dropdown-n-box">
      <div onClick={()=>onSelectPicker(index)} className={`d-filter-item-v ${active===index&&'active'}`}>
        <p className="icon_games name-filter-item-p">
          {icon&&icon}
          {label}
          <ChevronDown className='drop'/>
        </p>
        <span> Show All </span>
        <span className="filter-value"></span>
      </div>
      <div className="open-d-filter-view">
        <ul>
          <li className="passive_checkboxes" >
            <label className="checkbox-contain-p" >
              <input type="checkbox" className={value&&array&&value.length===array.length?"checked":''} onClick={()=>valueChange({value:'All', label:'All'}, label)}/>
              <span>{value&&array&&value.length===array.length?<Check/>:null}<i>All</i></span>
            </label>
          </li>
          {array&&array.length&&array.map((item, key)=>(
            <li key={key} className="passive_checkboxes" >
              <label className="checkbox-contain-p" >
                <input type="checkbox" className={value.find(e=>e.value===item.value)?"checked":''} onClick={()=>valueChange(item, label)}/>
                <span>{value.find(e=>e.value===item.value)&&<Check/>}<i> {item.label} </i></span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const RoomItem = ({item, state, Active}) =>(
  <React.Fragment>
    {
      state.Type.find(e=>e.value===item.roomType)&&
      state.Player.find(e=>e.value===item.maxPlayer)&&
      state.Bland.find(e=>e.value===item.maxBlind)&&
        <ul onClick={()=>Active(item)}>
          <li><p> {item.roomName} </p></li>
          <li><p> {item.roomType} </p></li>
          <li><span className={`type-p-v v-${item.maxPlayer}`}> {item.maxPlayer} </span></li>
          <li><p> {item.maxBlind} </p></li>
          <li><p> {item.bootAmount} </p></li>
          <li><p>{`${item.players.length} / ${item.maxPlayer}`}</p></li>
        </ul>
    }
  </React.Fragment>
)

const mapStateToProps = (state) => ({
  documentsData:state.documents.documentsData,
  currentPlayer:state.documents.currentPlayer,
  totalPlayer:state.documents.totalPlayer,
  userinfo:state.auth.userinfo,

  myData:state.documents.myData,
  roomData:state.documents.roomData,
  playersData:state.documents.playersData,
})

const mapDispatchToProps = {
  socket_connect, JoinRoom, signOut
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)