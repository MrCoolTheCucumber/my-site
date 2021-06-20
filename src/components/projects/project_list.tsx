import React from 'react';
import './project_list.scss';

interface ProjectCardData {
    title: string;
    description: string;
    imgSrc: string;
    onClickLink: string;
}

const projectData: ProjectCardData[] = [
    {
        title: "Frosty",
        description: "Creating an accurate, maintainable Game Boy emulator written in the rust programming language.",
        onClickLink: "https://github.com/RubenG123/frosty",
        imgSrc: "https://user-images.githubusercontent.com/16002713/119414812-330f3000-bce8-11eb-9eac-b12482dbc3f2.png"
    }
];

export default class ProjectList extends React.Component {
    renderProjectCards(): JSX.Element[] {
        return projectData.map((data, i) => {
            return this.renderProjectCard(data, i);
        });
    }

    renderProjectCard(data: ProjectCardData, index: number): JSX.Element {
        const onClick = () => {
            window.location.href = data.onClickLink;
        }

        return (
            <div key={index} className="project-card" onClick={onClick}>
                <div className="project-card__details-wrapper">
                    <div className="project-card__title">{data.title}</div>
                    <div className="project-card__desc">{data.description}</div>
                </div>
                
                <img src={data.imgSrc} className="project-card__img" />
            </div>
        )
    }

    render() {
        return (
            <div className="project-list">
                {this.renderProjectCards()}
            </div>
        )
    }
}