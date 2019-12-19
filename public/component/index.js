'use strict';

class Ticket extends React.Component{
  constructor(props){
    super(props);
    this.state = {text: ''}
    this.noticingColor = {backgroundColor: 'RGB(255, 255, 255)'};
  }

  onChangeHandler(event){
    const text = event.target.value;
    if(text.length > this.props.wordlimit)
      return;

    this.setState({text: text});

    const colorScale = 255 - text.length * Math.round(255 / this.props.wordlimit);
    const G = colorScale;
    const B = colorScale;
    this.noticingColor= {backgroundColor: `RGB(255, ${G}, ${B})`};
  }

  onSubmitHandler(event){
    event.preventDefault();
  }

  render(){
    return (
      <div className="panel">
            <h4 className="header">告诉树洞</h4>
            <form method="POST" action="" onSubmit={this.onSubmitHandler.bind(this)} className="form">
              <textarea  style={this.noticingColor} value={this.state.text} onChange={this.onChangeHandler.bind(this)} cols="40" rows="10" required></textarea>
              <div className="footer">
                <input type="submit" value='提交'/>
                {/*
                <span className="leftwords">
                  字数{this.props.wordlimit - this.state.text.length}
                </span>
                */}
              </div>
            </form>
        </div>
    );
  }
}

ReactDOM.render(<Ticket wordlimit="20"/>, document.getElementById('sentimentBinApp'));
