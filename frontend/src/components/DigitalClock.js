import React, {Component} from 'react';

export default class DigitalClock extends Component {
    componentWillMount () {
      this.getTime = this.getTime.bind(this);
      this.setState({
        time: "00:00:00",
        amPm: "am"
      })
      this.loadInterval = setInterval(
        this.getTime, 1000
      );
    }

    getTime () {
      const
        takeTwelve = n => n > 12 ?  n  - 12 : n,
           addZero = n => n < 10 ? "0" +  n : n;

      setInterval(() => {
        let d, h, m, s, t, amPm;

        d = new Date();
        h = addZero(takeTwelve(d.getHours()));
        m = addZero(d.getMinutes());
        s = addZero(d.getSeconds());
        t = `${h}:${m}:${s}`;

        amPm = d.getHours() >= 12 ? "pm" : "am";

        this.setState({
          time: t,
          amPm: amPm
        });

      }, 1000);
    }


  render() {
    const styles = {
      mostInnerGreen: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        fontFamily: 'roboto',
        fontWeight: '400',
        textAlign: 'center',
        height: '78px',
        width: '250px',
        border: '1px solid #2ecc40',
        borderRadius: '125px',
        marginTop: '0px',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow:'0px 0px 31px 2px #2ecc40, inset 0px 0px 31px 2px #2ecc40',
        textShadow:'0 0 5px #fff, 0 0 10px #fff, 0 0 7px #fff, 0 0 20px #88dfff, 0 0 35px #68ffc8, 0 0 40px #68ffc8, 0 0 50px #68ffc8, 0 0 75px #68ffc8,'
      },
      mostInnerRed: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        fontFamily: 'roboto',
        fontWeight: '400',
        textAlign: 'center',
        height: '78px',
        width: '250px',
        border: '1px solid #db2828',
        borderRadius: '125px',
        marginTop: '0px',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow:'0px 0px 31px 2px #db2828, inset 0px 0px 31px 2px #db2828',
        textShadow:'0 0 5px #fff, 0 0 10px #fff, 0 0 7px #fff, 0 0 20px #88dfff, 0 0 35px #68ffc8, 0 0 40px #68ffc8, 0 0 50px #68ffc8, 0 0 75px #68ffc8,'
      },
      time :{
        color: 'white',
        fontSize: '34px',
        position: 'relative',
        display: 'block',
        marginTop: '16px',
      },

    amPm : {
      position: 'relative',
      display: 'block',
      width: '20px',
      marginLeft: '132px',
      marginTop: '2px',
      color: 'white',
      fontSize: '12px',
    }

    }
    return (
          <div className="most-inner" style={ this.props.switchState ? styles.mostInnerGreen : styles.mostInnerRed }>
            <span className={
              this.state.time === "00:00:00"
                ? "time blink"
                : "time"}
                style={styles.time}
            > {this.state.time}
              <span className="amPm" style={styles.amPm}>
                {this.state.amPm}
              </span>
            </span>

          </div>
    );
  }
}
