import React, { PropTypes, Component } from 'react';
import { fetchCode, selectCode } from '../actions/code.js';
import { addCodeSmells, clearCodeSmells } from '../actions/smells';
import { getUserInfo } from '../actions/user.js';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';
import CodeBlock from '../components/CodeBlock';

/**
 * The review code component pulls the content and list of code smells. The user will be able
 * to assign individual line of code with a code smell and submit it. This will redirect the
 * user to a check code smell component where a score as well correct, incorrect, and missed
 * lines.
 * 
 * TODO: Add more thorough error checking. 
 * Display what line corresponds to which code smell.
 * Create syntax highlighting for different languages. 
 */
class ReviewCode extends Component {
    constructor(props) {
        super(props);
        this.clickAction = this.clickAction.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectCodeSmell = this.selectCodeSmell.bind(this);
        this.state = {
            codeSmellName: "",
            isModalOpen: false
        }
    }

    componentDidMount() {
        const { dispatch, id } = this.props;
        dispatch(fetchCode(id));
        dispatch(getUserInfo());
        dispatch(clearCodeSmells());
    }
    
    componentWillReceiveProps(nextProps) {
        const { dispatch, id } = nextProps;

        if(!this.props.codeReview &&
            (this.state.codeSmellName !== "")) {
            dispatch(fetchCode(id));
        } 

        if (nextProps.score > -1) {
            dispatch(pushState(null, `/score/${id}`));
        }
    }

    clickAction(lineNumber) {
        const { dispatch } = this.props;
        if (this.state.codeSmellName !== "") {
            dispatch(selectCode(lineNumber, this.state.codeSmellName));
        }
    }

    handleSubmit() {
        const { dispatch, id, userid, selectedLines } = this.props;
        dispatch(addCodeSmells(userid, id, selectedLines));
    }

    selectCodeSmell(name) {
        this.setState({
            codeSmellName: name
        });
    }

    render() {

        const { id, score, codeReview, codeSmells, selectedLines } = this.props;
       
        var content = "";

        if (codeReview) {
            content = codeReview.content.split("\n");
            for (var i = 0; i < content.length; i++) {
                var num = eval(i + 1);
                content[i] = {
                    lineNumber: num,
                    line: content[i],
                };
            }   
        }

        return (
            <div className="component-review">
                <h2>Review Code</h2>
                <div>
                    {
                        codeSmells.map((codeSmell) => {
                            return(<button 
                                    className="codesmell"
                                    key={codeSmell.id}
                                    onClick={() => this.selectCodeSmell(codeSmell.name)}>
                                    {codeSmell.name}
                                </button>)
                        })
                    }
                </div>
                <div className="codearea">
                    <CodeBlock
                        codeLines={content}
                        colorClass="highlight"
                        clickAction={this.clickAction}
                        selectedLines={selectedLines}
                    />  
                </div> 
                <button
                    onClick={this.handleSubmit}
                    type="button"
                    className="cta">
                    Submit
                </button>
            </div>
        );

    }

}

ReviewCode.propTypes = {
    id: PropTypes.string,
    score: PropTypes.number,
    userid: PropTypes.number,
    codeReview: PropTypes.object,
    codeSmells: PropTypes.array,
    selectedLines: PropTypes.array
}

// TODO Error checking
function mapStateToProps(state) {
    var id = state.router.params.id;
    var userid = state.user.user.id;
    var score = state.smells.score;
    var codeReview = state.code.codeReview;
    var codeSmells = state.smells.codeSmells || [
        {id: 1, name: "duplicate code"},
        {id: 2, name: "long methods/functions"},
        {id: 3, name: "large classes"},
        {id: 4, name: "long parameter list"},
        {id: 5, name: "message chain"},
        {id: 6, name: "feature envy"},
        {id: 7, name: "switch statements"},
        {id: 8, name: "temporary fields"},
        {id: 9, name: "refused bequest"},
        {id: 10, name: "too many bugs"},
        {id: 11, name: "too hard to understand"},
        {id: 12, name: "too hard to change"}];
    var selectedLines = state.code.selectedLines || [];

    return {
        id,
        score,
        userid,
        codeReview,
        codeSmells,
        selectedLines
    }
}

export default connect(mapStateToProps)(ReviewCode);
