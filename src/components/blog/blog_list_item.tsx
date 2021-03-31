import { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import './blog_list_item.scss'

export interface BlogListItemProps {
    id: number;
    title: string;
    description: string;
    date: Date;
    tags: string[];
}

const dateLocaleOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
}

export const BlogListItem = (props: BlogListItemProps): ReactElement => {
    let history = useHistory();

    const renderHeader = (): JSX.Element => {
        return (
            <div className="blog-list-item__header">
                <div className="blog-list-item__title">{props.title}</div>
                <div className="blog-list-item__date">
                    {props.date.toLocaleDateString(undefined, dateLocaleOptions)}
                </div>
            </div>
        )
    }

    const renderDescription = (): JSX.Element => {
        return (
            <div className="blog-list-item__desc">
                {props.description}
            </div>
        )
    }

    const handleOnClick = () => {
        const slug = props.id + "-" + props.title.replace (/\s/g, "-");
        console.log(props.title)
        history.push('/blog/' + slug);
    }

    return (
        <div onClick={handleOnClick} className="blog-list-item">
            {renderHeader()}
            {renderDescription()}
        </div>
    )
}
