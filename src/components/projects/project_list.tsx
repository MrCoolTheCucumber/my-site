import React from 'react';
import { Link } from 'react-router-dom';
import './project_list.scss';

interface ProjectCardData {
    title: string;
    description: string;
    imgSrc: string;
    githubLink?: string;
    demoLink?: string;
}

const projectData: ProjectCardData[] = [
    {
        title: "Frosty",
        description: "Creating an accurate, maintainable Game Boy emulator written in the rust programming language.",
        githubLink: "https://github.com/RubenG123/frosty",
        imgSrc: "https://user-images.githubusercontent.com/16002713/119414812-330f3000-bce8-11eb-9eac-b12482dbc3f2.png"
    },
    {
        title: "Chip 8",
        description: `My first ever emulator project. Served as a gentle introduction some 
            basic concepts, as well as a cool little project.`,
        githubLink: "https://github.com/RubenG123/my-site/tree/master/src/projects/chip8",
        imgSrc: "https://i.imgur.com/T0W73T5.png",
        demoLink: "chip8"
    }
];

export default class ProjectList extends React.Component {
    renderProjectCards(): JSX.Element[] {
        return projectData.map((data, i) => {
            return this.renderProjectCard(data, i);
        });
    }

    renderDemoButton(data: ProjectCardData): JSX.Element | void {
        if (data.demoLink) {
            return (
                <Link to={'/demo/' + data.demoLink} className="project-card__demo_button demo">
                    <span>Demo</span>
                </Link>
            )
        }
    }

    renderGithubButton(data: ProjectCardData): JSX.Element | void {
        if (data.githubLink) {
            return (
                <a href={data.githubLink} className="project-card__demo_button">
                    <span>Github</span>
                </a>
            )
        }
    }

    renderProjectCard(data: ProjectCardData, index: number): JSX.Element {
        return (
            <div key={index} className="project-card" >
                <div className="project-card__details-wrapper">
                    <div className="project-card__title-row-wrapper">
                        <div className="project-card__title">{data.title}</div>
                        {this.renderGithubButton(data)}
                        {this.renderDemoButton(data)}
                    </div>
                    
                    <div className="project-card__desc">{data.description}</div>
                </div>
                
                <div className="project-card__img-wrapper">
                    <img src={data.imgSrc} className="project-card__img" />
                </div>
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