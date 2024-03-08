import {Component} from 'react'
import logo from '../../assets/logo-NYKW-2024.png'
import reset from '../../assets/back.1.svg'
import play from '../../assets/play.2.svg'
import pause from '../../assets/pause.4.svg'

import './index.css'

const initialState = {
  isTimerRunning: false,
  timeElapsedInSeconds: 0,
  timerLimitInMinutes: 20,
}

const params = new URL(window.location).searchParams
const title = params.get('title') // is the string "Jonathan Smith".
console.log('title :>> ', title)

class DigitalTimer extends Component {
  state = initialState

  componentWillUnmount() {
    this.clearTimerInterval()
  }

  clearTimerInterval = () => clearInterval(this.intervalId)

  onDecreaseTimerLimitInMinutes = () => {
    const {timerLimitInMinutes} = this.state

    if (timerLimitInMinutes > 1) {
      this.setState(prevState => ({
        timerLimitInMinutes: prevState.timerLimitInMinutes - 1,
      }))
    }
  }

  onIncreaseTimerLimitInMinutes = increment =>
    this.setState(prevState => ({
      timerLimitInMinutes: +prevState.timerLimitInMinutes + increment,
    }))

  handleChange = event => {
    event.preventDefault()
    this.setState({timerLimitInMinutes: +event.target.value})
  }

  renderTimerLimitController = () => {
    const {timerLimitInMinutes, timeElapsedInSeconds} = this.state
    const isTimerRunning = timeElapsedInSeconds > 0

    return (
      <div className="timer-limit-controller-container">
        {/* <p className="limit-label">Set Timer limit</p> */}
        <div className="timer-limit-controller">
          <div
            onSubmit={this.handleChange}
            className="limit-label-and-value-container"
          >
            <input
              className="limit-value"
              value={timerLimitInMinutes}
              onChange={this.handleChange}
              disabled={isTimerRunning}
              type="number"
              min={0}
              max={99}
            />
          </div>
          {this.renderTimerController()}
        </div>
        <section>
          <button
            className="limit-value plus-button"
            // disabled={isTimerRunning}
            onClick={() => this.onIncreaseTimerLimitInMinutes(1)}
          >
            +1
          </button>
          <button
            className="limit-value plus-button"
            // disabled={isTimerRunning}
            onClick={() => this.onIncreaseTimerLimitInMinutes(2)}
          >
            +2
          </button>
          <button
            className="limit-value plus-button"
            // disabled={isTimerRunning}
            onClick={() => this.onIncreaseTimerLimitInMinutes(5)}
          >
            +5
          </button>
          <button
            className="limit-value plus-button"
            // disabled={isTimerRunning}
            onClick={() => this.onIncreaseTimerLimitInMinutes(10)}
          >
            +10
          </button>
        </section>
      </div>
    )
  }

  onResetTimer = () => {
    this.clearTimerInterval()
    this.setState(initialState)
  }

  incrementTimeElapsedInSeconds = () => {
    const {timerLimitInMinutes, timeElapsedInSeconds} = this.state
    const isTimerCompleted = timeElapsedInSeconds === timerLimitInMinutes * 60

    if (isTimerCompleted) {
      this.clearTimerInterval()
      this.setState({isTimerRunning: false})
    } else {
      this.setState(prevState => ({
        timeElapsedInSeconds: prevState.timeElapsedInSeconds + 1,
      }))
    }
  }

  onStartOrPauseTimer = () => {
    const {
      isTimerRunning,
      timeElapsedInSeconds,
      timerLimitInMinutes,
    } = this.state
    const isTimerCompleted = timeElapsedInSeconds === timerLimitInMinutes * 60

    if (isTimerCompleted) {
      this.setState({timeElapsedInSeconds: 0})
    }
    if (isTimerRunning) {
      this.clearTimerInterval()
    } else {
      this.intervalId = setInterval(this.incrementTimeElapsedInSeconds, 1000)
    }
    this.setState(prevState => ({isTimerRunning: !prevState.isTimerRunning}))
  }

  renderTimerController = () => {
    const {isTimerRunning} = this.state
    const startOrPauseImageUrl = isTimerRunning ? pause : play
    const startOrPauseAltText = isTimerRunning ? 'pause icon' : 'play icon'

    return (
      <div className="timer-controller-container">
        <button
          className="timer-controller-btn"
          onClick={this.onStartOrPauseTimer}
          type="button"
        >
          <img
            alt={startOrPauseAltText}
            className="timer-controller-icon"
            src={startOrPauseImageUrl}
          />
        </button>
        <button
          className="timer-controller-btn"
          onClick={this.onResetTimer}
          type="button"
        >
          <img
            alt="reset icon"
            className="timer-controller-icon reset-btn"
            src={reset}
          />
        </button>
      </div>
    )
  }

  getElapsedSecondsInTimeFormat = () => {
    const {timerLimitInMinutes, timeElapsedInSeconds} = this.state
    const totalRemainingSeconds =
      timerLimitInMinutes * 60 - timeElapsedInSeconds
    const minutes = Math.floor(totalRemainingSeconds / 60)
    const seconds = Math.floor(totalRemainingSeconds % 60)
    const stringifiedMinutes = minutes > 9 ? minutes : `0${minutes}`
    const stringifiedSeconds = seconds > 9 ? seconds : `0${seconds}`

    return `${stringifiedMinutes}:${stringifiedSeconds}`
  }

  render() {
    const {isTimerRunning} = this.state
    console.log('isTimerRunning :>> ', isTimerRunning)
    const labelText = isTimerRunning ? 'Running' : 'Paused'

    return (
      <div className="app-container">
        <h4 className="heading">{title}</h4>
        <div className="digital-timer-container">
          <div className="timer-display-container">
            <div className="elapsed-time-container">
              <h1 className="elapsed-time">
                {this.getElapsedSecondsInTimeFormat()}
              </h1>
              <p className="timer-state">{labelText}</p>
            </div>
          </div>
          <div>
            <img src={logo} className="logo" alt="" />
          </div>
        </div>
        <div className="controls-container">
          {this.renderTimerLimitController()}
        </div>
      </div>
    )
  }
}

export default DigitalTimer
