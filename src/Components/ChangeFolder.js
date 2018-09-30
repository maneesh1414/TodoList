import React, {Component} from 'react';
import { PreviousFolders } from './PreviousFolders.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {changeFolderRetrieve, removeTodoWhenChanged,
        moveMultiple, toggleFolderChangedSuccessfull, toggleSuccess} from '../Actions/todo.js';
import Modal from '../Modal';
import Banner from '../Banner';
import PropTypes from 'prop-types';
import '../todo.css';

class ChangeFolder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentFolder: 0,
      showFolderChangeModal: false,
      previousFolders: [],
      currentFolderName: "home.png",
      showBanner: false
    }

    this.handlePager = this.handlePager.bind(this);
    this.handleFolderClick = this.handleFolderClick.bind(this);
    this.handleMoveClicked = this.handleMoveClicked.bind(this);
  }

  componentDidMount() {

    this.setState({showFolderChangeModal: this.props.showFolderChangeModal === true});

    this.props.changeFolderRetrieve(this.state.currentFolder);

    if(this.props.items) {
      this.setState({items: this.props.items});
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({items: nextProps.items,
                   showFolderChangeModal: nextProps.showFolderChangeModal === true});

    if(nextProps.success) {
      this.props.toggleSuccess(false);
      this.props.removeTodoWhenChanged(this.props.uid);
      if(this.props.executeOnMove) {
        this.props.executeOnMove();
      }
      this.setState({showBanner: true});
    }
  }

  handlePager(index, id, name) {
    this.props.changeFolderRetrieve(id);
    this.setState({currentFolder: id, currentFolderName: name, previousFolders: this.state.previousFolders.slice(0, index)});
  }

  handleFolderClick(e) {
    const folderId = parseInt(e.currentTarget.getAttribute("folderid"));
    const folderText = e.currentTarget.getAttribute("foldertext");

    this.props.changeFolderRetrieve(folderId);

    this.setState({currentFolder: folderId,
                   currentFolderName: folderText,
                   previousFolders: [...this.state.previousFolders,
                                        {id: this.state.currentFolder, name: this.state.currentFolderName}
                                    ]
                  });
  }

  handleMoveClicked() {
      this.props.moveMultiple(1, this.props.uid, this.state.currentFolder);
   }

  render() {

    let items = [];

    if(this.state.items) {
      items = this.state.items;
    }

    items = items.filter((val) => ((val.isFolder || val.isFolder === 1) && !(this.props.uid.includes(val.id))))

    return (
      <Modal
        className="folderChangeModal"
        showModal={this.state.showFolderChangeModal}
        callBack={(s) => {  console.log("abcd");
                            this.setState({showFolderChangeModal: s});

                            if(this.props.callBack) {
                              this.props.callBack(s);
                            }
                          }}>
        <div className="folderChangeModalIcons">
          <PreviousFolders currentFolder={this.state.currentFolderName} pagerFunc={this.handlePager} previous={this.state.previousFolders} />
        </div>
        <div className="folderChangeModalFolderContainer">
        {items.map((value, index) =>
              <div className={`todoRow todoRowChange`} key={index}>
                <span className="todoRowHover">
                  <div className="todoRowFolder" folderid={value.folderId} foldertext={value.text} onClick={this.handleFolderClick}>
                    <img src="folder.png" className={`folderImg`} />
                    <span> {value.text} </span>
                  </div>
                </span>
              </div>
            )}
        </div>
        <div className={`folderChangeModalBanner`}>
          <Banner
            showBanner={this.state.showBanner}
            status={1}
            closeAfter={1}
            callBack={(s) => {
                                this.setState({showBanner: s, showFolderChangeModal: false});
                                if(this.props.callBack) {
                                  this.props.callBack(s);
                                }
                                this.props.toggleFolderChangedSuccessfull(false);
                             }}>
            Successfully <b>moved</b>!
          </Banner>
        </div>
        <div>
          <button
            className={`toDoButtonChange`}
            onClick={this.handleMoveClicked} > Move Here </button>
        </div>
      </Modal>
    );
  }

}



function mapStateToProps(state) {
  return { items: state.todoReducer.changeFolderItems,
           folderChangeSuccesful: state.todoReducer.folderChangeSuccesful,
            success: state.todoReducer.success};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({changeFolderRetrieve,
                             removeTodoWhenChanged,
                             moveMultiple,
                             toggleFolderChangedSuccessfull,
                             toggleSuccess }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (ChangeFolder);
