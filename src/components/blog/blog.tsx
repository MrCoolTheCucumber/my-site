import React from 'react';
import './blog.scss';

interface BlogPostProps {
    title: string;
    date: Date;
    tags: string[];
}

const dateLocaleOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}

class BlogPost extends React.Component<BlogPostProps> {
    renderHeader(): JSX.Element {
        return (
            <div className="blog-post__header">
                <div className="blog-post__header-title">{this.props.title}</div>
                <div className="blog-post__header-date">
                    {this.props.date.toLocaleDateString(undefined, dateLocaleOptions)}
                </div>
            </div>
        );
    }

    renderFooter(): JSX.Element {
        const tags: JSX.Element[] = this.props.tags.map((tag, i) => {
            return <span key={i}>#{tag}</span>
        });

        return (
            <div className="blog-post__footer">
                {tags}
            </div>
        );
    }
    
    render() {
        return (
            <div className="blog-post">
                {this.renderHeader()}

                <div className="blog-post__content">
                    {this.props.children}
                </div>
                
                {this.renderFooter()}
            </div>
        );
    }
}

export default BlogPost;
