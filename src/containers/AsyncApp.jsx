import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	selectSubreddit,
	fetchPostsIfNeeded,
	invalidateSubreddit
} from "../actions/actions";
import Picker from '../components/Picker';
import Posts from '../components/Posts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class AsyncApp extends Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleRefreshClick = this.handleRefreshClick.bind(this);
	}

	componentDidMount() {
		const { dispatch, selectedSubreddit } = this.props;
		dispatch(fetchPostsIfNeeded(selectedSubreddit));
	}

	componentDidUpdate(prevProps) {
		if(this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
			const { dispatch, selectedSubreddit } = this.props;
			dispatch(fetchPostsIfNeeded(selectedSubreddit));
		}
	}

	handleChange(nextSubreddit) {
		this.props.dispatch(selectSubreddit(nextSubreddit));
		this.props.dispatch(fetchPostsIfNeeded(nextSubreddit));
	}

	handleRefreshClick(e) {
		e.preventDefault();

		const { dispatch, selectedSubreddit } = this.props;
		dispatch(invalidateSubreddit(selectedSubreddit));
		dispatch(fetchPostsIfNeeded(selectedSubreddit));
	}

	render() {
		const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props;
		return (
			<div className="container wrapper">
				<Picker
					value={selectedSubreddit}
					onChange={this.handleChange}
					options={['reactjs', 'frontend']}
				/>
				<div className="update">
					{lastUpdated && (
						<div className="updatedAt">
							<FontAwesomeIcon className="faicon" icon="mug-hot"/>{' '}
							Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
						</div>
					)}
					<button className="btn btn-info refresh" disabled={isFetching} onClick={this.handleRefreshClick}>Refresh</button>
				</div>

				{isFetching && posts.length === 0 && <h2>Loading...</h2>}
				{!isFetching && posts.length === 0 && <h2>Empty</h2>}
				{posts.length > 0 && (
					<div style={{opacity: isFetching ? 0.5 : 1}}>
						<Posts posts={posts}/>
					</div>
				)}
			</div>
		)
	}
}

AsyncApp.propTypes = {
	selectedSubreddit: PropTypes.string.isRequired,
	posts: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	lastUpdated: PropTypes.number,
	dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
	const { selectedSubreddit, postsBySubreddit } = state;
	const { isFetching, lastUpdated, items: posts } =
		postsBySubreddit[selectedSubreddit] || {isFetching : true, items: []};

	return {
		selectedSubreddit,
		posts,
		isFetching,
		lastUpdated
	};
}

export default connect(mapStateToProps)(AsyncApp);




