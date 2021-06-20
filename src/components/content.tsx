import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { BlogListItem, BlogListItemProps } from './blog/blog_list_item';
import BlogPost from './blog/blog';
import Home from './home/home';
import ProjectList from './projects/project_list';

import { MetaData } from '../blog/blog_metadata';

export default class Content extends React.Component {

    renderBlogList(): JSX.Element[] {
        const blogItems: JSX.Element[] = MetaData.map((data: BlogListItemProps) => {
            return <BlogListItem key={data.id} {...data}/>
        });

        return blogItems;
    }

    renderBlogRoute(): JSX.Element {
        return (
            <Route 
                path="/blog/:id"
                children={({ match }) => {
                    const slug = match.params.id;
                    const id = parseInt(slug.substring(0, slug.indexOf('-')));

                    for (let i = 0; i < MetaData.length; ++i) {
                        let data = MetaData[i]
                        if (data.id === id) {
                            return  (
                                <BlogPost title={data.title} date={data.date} tags={data.tags}>
                                    {data.renderBlog()}
                                </BlogPost>
                            );
                        }
                    }

                    return <div>Blog not found :(</div>
                }} 
            />
        )
    }

    render() {
        return (
            <div className="content">
                <Switch>
                    {this.renderBlogRoute()}
                    
                    <Route path='/blog'>
                        {this.renderBlogList()}
                    </Route>

                    <Route path='/project'>
                        <ProjectList />
                    </Route>

                    <Route exact path="/">
                        <Home />
                    </Route>

                    <Route path='/(.+)'>
                        <Redirect to='/'/>
                    </Route>
                </Switch>
            </div>
        )
    }
}