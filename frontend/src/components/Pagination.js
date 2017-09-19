import React from 'react';
import _ from 'lodash';
import {RaisedButton} from 'material-ui';
import AppBar from 'material-ui/AppBar';

const Props = {
    initialPage: 1
}

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }

    componentWillMount() {
        // set page if items array isn't empty
        if (this.props.items && this.props.items.length) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
    }

    setPage(page) {
        var items = this.props.items;
        var pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(items.length, page);

        // get new page of items from items array
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

        // update state
        this.setState({ pager: pager });

        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }

    getPager(totalItems, currentPage, pageSize) {
        //  to first page
        currentPage = currentPage || 1;

        //  page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
    buttonEnter(e) {
      if(e.currentTarget.parentElement.className !== "active") {
        e.currentTarget.getElementsByClassName("circle")[0].style.opacity = 0.6;
        e.currentTarget.getElementsByClassName("circle")[0].style.transform = "scale(1)";
      }
    }
    buttonLeave(e){
      //if not active do this
      if(e.currentTarget.parentElement.className !== "active") {
        e.currentTarget.getElementsByClassName("circle")[0].style.opacity = 0;
        e.currentTarget.getElementsByClassName("circle")[0].style.transform = "scale(0)";
      }
    }
    handleButtonClick(e,page) {
      e.currentTarget.getElementsByClassName("circle")[0].style.opacity = 1;
      e.currentTarget.getElementsByClassName("circle")[0].style.transform = "scale(1)";
    }

    render() {
        var pager = this.state.pager;

        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }

        const styles = {
          pagination:{
            display: 'inline-block',
            paddingLeft: 0,
            margin: '20px 0',
            borderRadius: '4px',
            boxSizing: 'border-box',
            listStyleType: 'disc',
            marginBefore: 'auto',
            marginAfter: 'auto',
            marginStart: '0px',
            marginEnd: '0px',
            paddingStart: '40px',
            textAlign: 'center',
          },
          circle:{
            position: "absolute",
            backgroundColor:"#0097a7",
            borderRadius:"50%",
            height: 34,
            left: 3,
            top: '1px',
            transform: "scale(0)",
            transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
            width: 34
          }
        }
        return (
          <AppBar showMenuIconButton={false} titleStyle={{display:'none'}} style={{borderRadius:'6px', backgroundColor: 'rgba(0, 151, 167,0.4)', marginBottom:'18px'}}>
            <ul className="pagination" style={styles.pagination}>
              <RaisedButton onClick={() => this.setPage(1)} disabled={pager.currentPage === 1 } label="First" disableTouchRipple disableFocusRipple/>
              <RaisedButton onClick={() => this.setPage(pager.currentPage - 1)} disabled={pager.currentPage === 1} label="Previous" disableTouchRipple disableFocusRipple/>
              {pager.pages.map((page, index) =>
                  <RaisedButton style={{minWidth:'36px', minHeight:'36px'}} onMouseEnter={this.buttonEnter} onMouseLeave={this.buttonLeave} onClick={(e) => this.setPage(page)} key={index} className={pager.currentPage === page ? 'active' : ''} label={page} disableTouchRipple disableFocusRipple>
                    <div className="circle" style={pager.currentPage === page ? {...styles.circle, opacity:1, transform:'scale(1)'} : {...styles.circle, opacity:0, transform:'scale(0)'} } />
                  </RaisedButton>
                )}
              <RaisedButton onClick={() => this.setPage(pager.currentPage + 1)} disabled={pager.currentPage === pager.totalPages } label="Next" disableTouchRipple disableFocusRipple/>
              <RaisedButton  onClick={() => this.setPage(pager.totalPages)} disabled={pager.currentPage === pager.totalPages } label="Last" disableTouchRipple disableFocusRipple/>
            </ul>
          </AppBar>
        );
    }
}


export default Pagination;
